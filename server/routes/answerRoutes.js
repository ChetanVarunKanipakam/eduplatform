import express  from'express';
const router = express.Router();
import auth from'../middleware/auth.js';
import Answer from'../models/Answer.js';
import Discussion from'../models/Discussion.js';

// @route   POST api/answers/:discussionId
// @desc    Add an answer to a discussion
// @access  Private
router.post('/:discussionId', auth, async (req, res) => {
  const { content } = req.body;
  try {
    const discussion = await Discussion.findById(req.params.discussionId);
    if (!discussion) {
      return res.status(404).json({ msg: 'Discussion not found' });
    }

    const newAnswer = new Answer({
      content,
      author: req.userId,
      discussion: req.params.discussionId,
    });

    const answer = await newAnswer.save();
    discussion.answers.push(answer.id);
    await discussion.save();

    const populatedAnswer = await Answer.findById(answer.id).populate('author', ['name', 'picture']);
    res.json(populatedAnswer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/answers/:id/like
// @desc    Like or unlike an answer
// @access  Private
router.put('/:id/like', auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ msg: 'Answer not found' });
    }

    // Check if the answer has already been liked by this user
    if (answer.likes.some((like) => like.toString() === req.userId)) {
      // Unlike
      answer.likes = answer.likes.filter(
        (like) => like.toString() !== req.userId
      );
    } else {
      // Like
      answer.likes.push(req.userId);
    }

    await answer.save();
    res.json(answer.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;