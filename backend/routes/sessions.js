const express = require('express');
const { body, validationResult } = require('express-validator');
const Session = require('../models/Session');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/sessions
// @desc    Get all published sessions (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find({ status: 'published' })
      .populate('user_id', 'email')
      .sort({ updated_at: -1 });

    // Transform the data to match frontend expectations
    const transformedSessions = sessions.map(session => ({
      ...session.toObject(),
      author: session.user_id
    }));

    res.json(transformedSessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/sessions/my-sessions
// @desc    Get user's own sessions (drafts + published)
// @access  Private
router.get('/my-sessions', auth, async (req, res) => {
  try {
    const sessions = await Session.find({ user_id: req.user.id })
      .sort({ updated_at: -1 });

    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/sessions
// @desc    Create a new session
// @access  Private
router.post('/', [
  auth,
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, status = 'draft' } = req.body;

    const session = new Session({
      user_id: req.user.id,
      title,
      content: content || '',
      status
    });

    await session.save();
    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/sessions/:id
// @desc    Get a single session by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      user_id: req.user.id
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/sessions/:id
// @desc    Update a session
// @access  Private
router.patch('/:id', [
  auth,
  body('title').optional().trim().isLength({ min: 1 }).withMessage('Title cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, status } = req.body;

    const session = await Session.findOne({
      _id: req.params.id,
      user_id: req.user.id
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Update fields if provided
    if (title !== undefined) session.title = title;
    if (content !== undefined) session.content = content;
    if (status !== undefined) session.status = status;

    await session.save();
    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/sessions/:id
// @desc    Delete a session
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.id
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/sessions/my-sessions/:id
// @desc    Get a single user session
// @access  Private
router.get('/my-sessions/:id', auth, async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      user_id: req.user.id
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/sessions/my-sessions/save-draft
// @desc    Save or update a draft session
// @access  Private
router.post('/my-sessions/save-draft', [
  auth,
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('tags').optional().custom((value) => {
    // Allow both string and array
    if (value !== undefined && typeof value !== 'string' && !Array.isArray(value)) {
      throw new Error('Tags must be a string or array');
    }
    return true;
  }),
  body('json_file_url').optional().custom((value) => {
    if (value && value.trim() !== '') {
      try {
        new URL(value);
        return true;
      } catch (e) {
        throw new Error('Must be a valid URL');
      }
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, tags, json_file_url, sessionId } = req.body;

    // Parse tags if they're comma-separated string
    let parsedTags = tags;
    if (typeof tags === 'string') {
      parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    let session;

    if (sessionId) {
      // Update existing session
      session = await Session.findOne({
        _id: sessionId,
        user_id: req.user.id
      });

      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      session.title = title;
      session.tags = parsedTags || [];
      session.json_file_url = json_file_url || '';
      session.status = 'draft';
    } else {
      // Create new session
      session = new Session({
        user_id: req.user.id,
        title,
        tags: parsedTags || [],
        json_file_url: json_file_url || '',
        status: 'draft'
      });
    }

    await session.save();

    res.json({
      message: 'Draft saved successfully',
      session
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/sessions/my-sessions/publish
// @desc    Publish a session
// @access  Private
router.post('/my-sessions/publish', [
  auth,
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('tags').optional().custom((value) => {
    // Allow both string and array
    if (value !== undefined && typeof value !== 'string' && !Array.isArray(value)) {
      throw new Error('Tags must be a string or array');
    }
    return true;
  }),
  body('json_file_url').isURL().withMessage('JSON file URL is required and must be valid')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, tags, json_file_url, sessionId } = req.body;

    // Parse tags if they're comma-separated string
    let parsedTags = tags;
    if (typeof tags === 'string') {
      parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    let session;

    if (sessionId) {
      // Update existing session
      session = await Session.findOne({
        _id: sessionId,
        user_id: req.user.id
      });

      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      session.title = title;
      session.tags = parsedTags || [];
      session.json_file_url = json_file_url;
      session.status = 'published';
    } else {
      // Create new session
      session = new Session({
        user_id: req.user.id,
        title,
        tags: parsedTags || [],
        json_file_url,
        status: 'published'
      });
    }

    await session.save();

    res.json({
      message: 'Session published successfully',
      session
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/sessions/my-sessions/:id
// @desc    Delete a user session
// @access  Private
router.delete('/my-sessions/:id', auth, async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.id
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
