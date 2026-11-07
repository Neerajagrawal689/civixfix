const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all polls
exports.getPolls = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    
    // Fetch polls with options and vote counts
    const polls = await prisma.poll.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        creator: {
          select: { name: true, role: true }
        },
        options: {
          include: {
            _count: {
              select: { votes: true }
            }
          }
        },
        votes: {
          where: { user_id: userId },
          select: { option_id: true }
        }
      }
    });

    // Format the response so frontend can easily render
    const formattedPolls = polls.map(poll => {
      const totalVotes = poll.options.reduce((sum, opt) => sum + opt._count.votes, 0);
      const userVotedOptionId = poll.votes.length > 0 ? poll.votes[0].option_id : null;

      return {
        id: poll.id,
        question: poll.question,
        active: poll.active,
        created_at: poll.created_at,
        creator: poll.creator,
        totalVotes,
        hasVoted: !!userVotedOptionId,
        userVotedOptionId,
        options: poll.options.map(opt => ({
          id: opt.id,
          text: opt.text,
          votes: opt._count.votes,
          percentage: totalVotes > 0 ? Math.round((opt._count.votes / totalVotes) * 100) : 0
        }))
      };
    });

    res.status(200).json({ success: true, data: formattedPolls });
  } catch (error) {
    console.error('Error fetching polls:', error);
    res.status(500).json({ success: false, error: { message: 'Server Error' } });
  }
};

// Create a new poll (Admin/Officer only)
exports.createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;
    const userId = req.user.userId || req.user.id;

    if (!question || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ success: false, error: { message: 'Question and at least 2 options are required' } });
    }

    const poll = await prisma.poll.create({
      data: {
        question,
        creator_id: userId,
        options: {
          create: options.map(text => ({ text }))
        }
      },
      include: {
        options: true
      }
    });

    res.status(201).json({ success: true, data: poll });
  } catch (error) {
    console.error('Error creating poll:', error);
    res.status(500).json({ success: false, error: { message: 'Server Error' } });
  }
};

// Vote on a poll
exports.voteOnPoll = async (req, res) => {
  try {
    const { id: poll_id } = req.params;
    const { option_id } = req.body;
    const user_id = req.user.userId || req.user.id;

    const poll = await prisma.poll.findUnique({ where: { id: poll_id } });
    if (!poll) return res.status(404).json({ success: false, error: { message: 'Poll not found' } });
    if (!poll.active) return res.status(400).json({ success: false, error: { message: 'Poll is closed' } });

    // Check if user already voted (handled by unique constraint, but good to check explicitly)
    const existingVote = await prisma.pollVote.findUnique({
      where: {
        poll_id_user_id: { poll_id, user_id }
      }
    });

    if (existingVote) {
      return res.status(400).json({ success: false, error: { message: 'You have already voted on this poll' } });
    }

    await prisma.pollVote.create({
      data: {
        poll_id,
        option_id,
        user_id
      }
    });

    res.status(200).json({ success: true, message: 'Vote recorded' });
  } catch (error) {
    console.error('Error voting:', error);
    res.status(500).json({ success: false, error: { message: 'Server Error' } });
  }
};

// Close a poll
exports.closePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await prisma.poll.update({
      where: { id },
      data: { active: false }
    });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Error closing poll:', error);
    res.status(500).json({ success: false, error: { message: 'Server Error' } });
  }
};
