const prisma = require('../config/prisma');
const path = require('path');
const { sendResolutionNotification } = require('../utils/emailService');

// Generate unique issue number CFX-YYYY-000001
const generateIssueNumber = async () => {
  const year = new Date().getFullYear();
  const prefix = `CFX-${year}-`;
  
  const lastIssue = await prisma.issue.findFirst({
    where: { issue_number: { startsWith: prefix } },
    orderBy: { issue_number: 'desc' }
  });

  if (!lastIssue) return `${prefix}000001`;
  
  const lastNum = parseInt(lastIssue.issue_number.split('-')[2]);
  const newNum = String(lastNum + 1).padStart(6, '0');
  return `${prefix}${newNum}`;
};

const { analyzeIssue, detectDuplicate } = require('../services/ai.service');

const createIssue = async (req, res, next) => {
  try {
    const { title, description, category_id, latitude, longitude, address } = req.body;
    const citizen_id = req.user.userId;
    const lat = parseFloat(latitude) || 0.0;
    const lng = parseFloat(longitude) || 0.0;

    // --- AI Duplicate Detection ---
    const unresolvedIssues = await prisma.issue.findMany({
      where: {
        category_id,
        status: { notIn: ['RESOLVED', 'CLOSED'] }
      },
      take: 50,
      orderBy: { created_at: 'desc' }
    });

    // Basic rough distance filter (approx 2km = ~0.02 degrees)
    const nearbyIssues = unresolvedIssues.filter(issue => {
      return Math.abs(issue.latitude - lat) < 0.02 && Math.abs(issue.longitude - lng) < 0.02;
    });

    if (nearbyIssues.length > 0) {
      const duplicateResult = await detectDuplicate({ title, description, latitude: lat, longitude: lng }, nearbyIssues);
      if (duplicateResult && duplicateResult.isDuplicate && duplicateResult.confidence > 0.6) {
        return res.status(409).json({
          success: false,
          isDuplicate: true,
          duplicateId: duplicateResult.duplicateOfId,
          error: { message: `Duplicate Detected: ${duplicateResult.reasoning}` }
        });
      }
    }
    // --- End Duplicate Detection ---

    const issue_number = await generateIssueNumber();
    
    // AI Verification & Routing
    let aiResult = null;
    const departments = await prisma.department.findMany({ select: { id: true, name: true } });
    
    if (req.file) {
      aiResult = await analyzeIssue(title, description, req.file.path, departments);
    }

    let finalDeptId = null;
    if (aiResult?.department_id && departments.find(d => d.id === aiResult.department_id)) {
      finalDeptId = aiResult.department_id;
    }

    const newIssue = await prisma.$transaction(async (tx) => {
      const issue = await tx.issue.create({
        data: {
          issue_number,
          title,
          description,
          category_id,
          citizen_id,
          latitude: parseFloat(latitude) || 0.0,
          longitude: parseFloat(longitude) || 0.0,
          address,
          status: 'SUBMITTED',
          priority: aiResult?.priority || 'MEDIUM',
          ai_category: aiResult?.category,
          ai_priority: aiResult?.priority,
          ai_confidence: aiResult?.confidence,
          department_id: finalDeptId,
        }
      });

      // Handle Image
      if (req.file) {
        const imageUrl = `/uploads/issues/${req.file.filename}`;
        await tx.issueImage.create({
          data: {
            issue_id: issue.id,
            url: imageUrl,
            storage_path: req.file.path,
            image_type: 'REPORT'
          }
        });
      }

      // Add History
      const note = aiResult 
        ? `Issue reported by citizen. AI Assessment: ${aiResult.reasoning}` 
        : 'Issue reported by citizen';

      await tx.statusHistory.create({
        data: {
          issue_id: issue.id,
          old_status: 'SUBMITTED',
          new_status: 'SUBMITTED',
          changed_by: citizen_id,
          note: note
        }
      });

      return issue;
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('issue_created', {
        id: newIssue.id,
        issue_number: newIssue.issue_number,
        title: newIssue.title,
        status: newIssue.status,
        latitude: newIssue.latitude,
        longitude: newIssue.longitude
      });
    }

    res.status(201).json({ success: true, data: newIssue });
  } catch (error) {
    next(error);
  }
};

const getIssues = async (req, res, next) => {
  try {
    const { status, category_id } = req.query;
    
    // Build filter
    const where = {};
    if (status) where.status = status;
    if (category_id) where.category_id = category_id;
    
    // If citizen, only show their issues
    if (req.user.role === 'CITIZEN') {
      where.citizen_id = req.user.userId || req.user.id;
    } else if (req.user.role === 'WORKER') {
      where.assignments = {
        some: {
          worker_id: req.user.userId || req.user.id
        }
      };
    }

    const issues = await prisma.issue.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        category: true,
        images: true,
        assignments: {
          include: { worker: { select: { id: true, name: true, phone: true } } }
        },
        _count: {
          select: { supports: true, comments: true }
        }
      }
    });

    res.status(200).json({ success: true, data: issues });
  } catch (error) {
    next(error);
  }
};

const getIssueById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const issue = await prisma.issue.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        status_history: {
          orderBy: { created_at: 'desc' }
        },
        citizen: { select: { id: true, name: true, email: true } },
        assignments: {
          include: { worker: { select: { id: true, name: true, phone: true } } }
        },
        supports: {
          select: { citizen_id: true }
        },
        _count: {
          select: { supports: true, comments: true }
        }
      }
    });

    if (!issue) {
      return res.status(404).json({ success: false, error: { message: 'Issue not found' } });
    }

    // Access control: citizens can only view their own issues
    if (req.user.role === 'CITIZEN' && issue.citizen_id !== req.user.userId) {
      return res.status(403).json({ success: false, error: { message: 'Forbidden' } });
    }

    const isSupported = issue.supports?.some(s => s.citizen_id === req.user.userId) || false;
    const totalSupports = issue.supports?.length || 0;

    res.status(200).json({ success: true, data: { ...issue, isSupported, totalSupports } });
  } catch (error) {
    next(error);
  }
};

const getAllPublicIssues = async (req, res, next) => {
  try {
    const { status, category_id, min_lat, max_lat, min_lng, max_lng } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (category_id) where.category_id = category_id;
    
    // SQLite bounding box filtering if coords are provided
    if (min_lat && max_lat && min_lng && max_lng) {
      where.latitude = { gte: parseFloat(min_lat), lte: parseFloat(max_lat) };
      where.longitude = { gte: parseFloat(min_lng), lte: parseFloat(max_lng) };
    }

    const issues = await prisma.issue.findMany({
      where,
      select: {
        id: true,
        title: true,
        issue_number: true,
        latitude: true,
        longitude: true,
        status: true,
        created_at: true,
        category: { select: { name: true } },
        images: { select: { url: true }, take: 1 }
      },
      take: 500 // Limit for performance on map
    });

    res.status(200).json({ success: true, data: issues });
  } catch (error) {
    next(error);
  }
};

const updateIssueStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { new_status, note } = req.body;
    
    // Only OFFICER, DEPT_HEAD, FIELD_WORKER can update status
    if (['CITIZEN'].includes(req.user.role)) {
      return res.status(403).json({ success: false, error: { message: 'Forbidden' } });
    }

    const existingIssue = await prisma.issue.findUnique({ where: { id } });
    if (!existingIssue) {
      return res.status(404).json({ success: false, error: { message: 'Issue not found' } });
    }

    const updatedIssue = await prisma.$transaction(async (tx) => {
      // 1. Update the issue
      const issue = await tx.issue.update({
        where: { id },
        data: { status: new_status },
        include: { citizen: { select: { name: true, email: true } } }
      });

      // 2. Add history record
      await tx.statusHistory.create({
        data: {
          issue_id: issue.id,
          old_status: existingIssue.status,
          new_status: new_status,
          changed_by: req.user.userId,
          note: note || 'Status updated by official'
        }
      });

      // Handle optional resolution image
      if (req.file) {
        const imageUrl = `/uploads/issues/${req.file.filename}`;
        await tx.issueImage.create({
          data: {
            issue_id: issue.id,
            url: imageUrl,
            storage_path: req.file.path,
            image_type: 'RESOLUTION'
          }
        });
      }

      // If status is changed to RESOLVED, send mock email/WhatsApp notification
      if (new_status === 'RESOLVED' && existingIssue.status !== 'RESOLVED') {
        // We don't block the transaction on this, just run it asynchronously
        sendResolutionNotification(issue.citizen.email, issue.citizen.name, issue)
          .catch(err => console.error("Email notification error:", err));
      }

      return issue;
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('issue_updated', {
        id: updatedIssue.id,
        issue_number: updatedIssue.issue_number,
        title: updatedIssue.title,
        old_status: existingIssue.status,
        new_status: updatedIssue.status,
        note: note || 'Status updated by official'
      });
    }

    res.status(200).json({ success: true, data: updatedIssue });
  } catch (error) {
    next(error);
  }
};

const getComments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comments = await prisma.comment.findMany({
      where: { issue_id: id },
      include: {
        user: { select: { id: true, name: true, role: true } }
      },
      orderBy: { created_at: 'asc' }
    });
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const newComment = await prisma.comment.create({
      data: {
        issue_id: id,
        user_id: req.user.userId,
        comment
      },
      include: {
        user: { select: { id: true, name: true, role: true } }
      }
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`issue_${id}`).emit('new_comment', newComment);
    }

    res.status(201).json({ success: true, data: newComment });
  } catch (error) {
    next(error);
  }
};

const toggleSupport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const citizen_id = req.user.userId;

    const existingSupport = await prisma.support.findUnique({
      where: { issue_id_citizen_id: { issue_id: id, citizen_id } }
    });

    if (existingSupport) {
      await prisma.support.delete({
        where: { issue_id_citizen_id: { issue_id: id, citizen_id } }
      });
    } else {
      await prisma.support.create({
        data: { issue_id: id, citizen_id }
      });
    }

    // Auto-escalation logic: Check total supports
    const totalSupports = await prisma.support.count({ where: { issue_id: id } });
    
    // For demo purposes, we'll set the threshold to 3 instead of 50
    let issue = await prisma.issue.findUnique({ where: { id } });
    
    if (totalSupports >= 3 && issue.priority !== 'CRITICAL') {
      issue = await prisma.issue.update({
        where: { id },
        data: { priority: 'CRITICAL' }
      });
      // Notify via Socket
      const io = req.app.get('io');
      if (io) {
        io.emit('issue_updated', {
          id: issue.id,
          issue_number: issue.issue_number,
          title: issue.title,
          note: 'Priority auto-escalated to CRITICAL due to high community upvotes!'
        });
      }
    }

    res.status(200).json({ success: true, data: { totalSupports, isSupported: !existingSupport, newPriority: issue.priority } });
  } catch (error) {
    next(error);
  }
};

const getSupportStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const citizen_id = req.user?.userId;
    const totalSupports = await prisma.support.count({ where: { issue_id: id } });
    let isSupported = false;
    if (citizen_id) {
      const existing = await prisma.support.findUnique({
        where: { issue_id_citizen_id: { issue_id: id, citizen_id } }
      });
      isSupported = !!existing;
    }
    res.status(200).json({ success: true, totalSupports, isSupported });
  } catch (error) {
    next(error);
  }
};



// Assign issue to a worker
const assignIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const { worker_id } = req.body;
    
    if (!worker_id) {
      return res.status(400).json({ success: false, error: { message: 'Worker ID is required' } });
    }

    const issue = await prisma.issue.findUnique({ where: { id } });
    if (!issue) return res.status(404).json({ success: false, error: { message: 'Issue not found' } });

    // Check if worker exists
    const worker = await prisma.user.findUnique({ where: { id: worker_id, role: 'WORKER' } });
    if (!worker) return res.status(404).json({ success: false, error: { message: 'Worker not found' } });

    // Create assignment and update issue status
    await prisma.$transaction([
      prisma.assignment.create({
        data: {
          issue_id: id,
          officer_id: req.user.userId || req.user.id,
          worker_id
        }
      }),
      prisma.issue.update({
        where: { id },
        data: { status: 'ASSIGNED' }
      }),
      prisma.statusHistory.create({
        data: {
          issue_id: id,
          changed_by: req.user.userId || req.user.id,
          old_status: issue.status,
          new_status: 'ASSIGNED',
          note: `Assigned to ${worker.name}`
        }
      })
    ]);

    const updatedIssue = await prisma.issue.findUnique({
      where: { id },
      include: {
        assignments: { include: { worker: true } }
      }
    });

    res.status(200).json({ success: true, data: updatedIssue });
  } catch (error) {
    console.error('Error assigning issue:', error);
    res.status(500).json({ success: false, error: { message: 'Server Error' } });
  }
};

const getFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const feedbacks = await prisma.feedback.findMany({
      where: { issue_id: id },
      include: { citizen: { select: { id: true, name: true } } },
      orderBy: { created_at: 'desc' }
    });
    const avgRating = feedbacks.length > 0
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
      : null;
    res.status(200).json({ success: true, data: feedbacks, avgRating: avgRating ? parseFloat(avgRating) : null });
  } catch (error) {
    next(error);
  }
};

const submitFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const citizen_id = req.user.userId;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, error: { message: 'Rating must be between 1 and 5' } });
    }

    // Check issue is resolved
    const issue = await prisma.issue.findUnique({ where: { id } });
    if (!issue) return res.status(404).json({ success: false, error: { message: 'Issue not found' } });
    if (issue.status !== 'RESOLVED' && issue.status !== 'CLOSED') {
      return res.status(400).json({ success: false, error: { message: 'Can only give feedback on resolved issues' } });
    }

    const feedback = await prisma.feedback.upsert({
      where: { issue_id_citizen_id: { issue_id: id, citizen_id } },
      update: { rating: parseInt(rating), comment: comment || null },
      create: { issue_id: id, citizen_id, rating: parseInt(rating), comment: comment || null },
      include: { citizen: { select: { id: true, name: true } } }
    });

    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    next(error);
  }
};

module.exports = { createIssue, getIssues, getIssueById, getAllPublicIssues, updateIssueStatus, getComments, addComment, toggleSupport, getSupportStatus, assignIssue, getFeedback, submitFeedback };