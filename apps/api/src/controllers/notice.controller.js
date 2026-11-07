const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all notices
exports.getNotices = async (req, res) => {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        author: {
          select: { name: true, role: true }
        }
      }
    });

    res.status(200).json({ success: true, data: notices });
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ success: false, error: { message: 'Server Error' } });
  }
};

// Create a notice (Admin/Officer only)
exports.createNotice = async (req, res) => {
  try {
    const { title, content, type } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, error: { message: 'Title and content are required' } });
    }

    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        type: type || 'INFO',
        author_id: req.user.id
      },
      include: {
        author: {
          select: { name: true, role: true }
        }
      }
    });
    
    // Broadcast to all connected clients
    req.app.get('io').emit('new_notice', notice);

    res.status(201).json({ success: true, data: notice });
  } catch (error) {
    console.error('Error creating notice:', error);
    res.status(500).json({ success: false, error: { message: 'Server Error' } });
  }
};

// Delete a notice
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await prisma.notice.findUnique({ where: { id: req.params.id } });
    
    if (!notice) {
      return res.status(404).json({ success: false, error: { message: 'Notice not found' } });
    }

    await prisma.notice.delete({ where: { id: req.params.id } });

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting notice:', error);
    res.status(500).json({ success: false, error: { message: 'Server Error' } });
  }
};
