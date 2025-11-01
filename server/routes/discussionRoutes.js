
import express from 'express';
const router = express.Router();
import auth from'../middleware/auth.js'; // Assuming you have auth middleware
import Discussion from '../models/Discussion.js';
import Answer from '../models/Answer.js';

// @route   POST api/discussions
// @desc    Create a new discussion
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, content, postType } = req.body;
  try {
    const newDiscussion = new Discussion({
      title,
      content,
      postType,
      author: req.userId,
    });
    const discussion = await newDiscussion.save();
    res.json(discussion);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.get('/discussions/me',auth, async (req,res) => {
  try{
      const discussions = await Discussion.find({author : req.userId}).populate('author', ['name', 'picture']).sort({ createdAt: -1 });
      res.json(discussions);
  
  }catch(e){
    console.error(e.message);
    res.status(500).send("Server Error")
  }
});

// @route   GET api/discussions
// @desc    Get all discussions
// @access  Public
router.get('/', async (req, res) => {
  try {
    const discussions = await Discussion.find().populate('author', ['name', 'picture']).sort({ createdAt: -1 });
    res.json(discussions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/discussions/:id
// @desc    Get discussion by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id).populate('author', ['name', 'picture']);
    if (!discussion) {
      return res.status(404).json({ msg: 'Discussion not found' });
    }
    const answers = await Answer.find({ discussion: req.params.id }).populate('author', ['name', 'picture']);
    res.json({ discussion, answers });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


export default router;