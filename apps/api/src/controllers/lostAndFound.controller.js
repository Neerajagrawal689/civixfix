const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await prisma.lostAndFound.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        reporter: {
          select: { name: true, phone: true }
        }
      }
    });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching lost and found:', error);
    res.status(500).json({ success: false, error: { message: 'Server Error' } });
  }
};

// Create new item
exports.createItem = async (req, res) => {
  try {
    const { item_name, description, type, location, contact_info } = req.body;
    
    // In a real app, handle image upload properly. For now, we support optional image_url or leave null.
    const image_url = req.body.image_url || null;

    if (!item_name || !description || !type || !location || !contact_info) {
      return res.status(400).json({ success: false, error: { message: 'All fields are required' } });
    }

    const item = await prisma.lostAndFound.create({
      data: {
        item_name,
        description,
        type,
        location,
        contact_info,
        image_url,
        reporter_id: req.user.userId || req.user.id
      },
      include: {
        reporter: {
          select: { name: true, phone: true }
        }
      }
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ success: false, error: { message: 'Server Error' } });
  }
};

// Update status (e.g., Mark as Resolved/Found)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const item = await prisma.lostAndFound.findUnique({ where: { id: req.params.id } });
    
    if (!item) {
      return res.status(404).json({ success: false, error: { message: 'Item not found' } });
    }

    // Only allow the reporter or an admin to update
    if (item.reporter_id !== (req.user.userId || req.user.id) && req.user.role !== 'ADMIN' && req.user.role !== 'OFFICER') {
      return res.status(403).json({ success: false, error: { message: 'Unauthorized' } });
    }

    const updatedItem = await prisma.lostAndFound.update({
      where: { id: req.params.id },
      data: { status },
      include: { reporter: { select: { name: true, phone: true } } }
    });

    res.status(200).json({ success: true, data: updatedItem });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, error: { message: 'Server Error' } });
  }
};

// Delete item
exports.deleteItem = async (req, res) => {
  try {
    const item = await prisma.lostAndFound.findUnique({ where: { id: req.params.id } });
    if (!item) {
      return res.status(404).json({ success: false, error: { message: 'Item not found' } });
    }

    // Only allow reporter or admin
    if (item.reporter_id !== (req.user.userId || req.user.id) && req.user.role !== 'ADMIN' && req.user.role !== 'OFFICER') {
      return res.status(403).json({ success: false, error: { message: 'Unauthorized' } });
    }

    await prisma.lostAndFound.delete({ where: { id: req.params.id } });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ success: false, error: { message: 'Server Error' } });
  }
};
