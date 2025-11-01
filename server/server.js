import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import path from "path";
import { fileURLToPath } from 'url';

import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
// Load env vars
dotenv.config();
import User from './models/User.js';
// Route files
import subjectRoutes from './routes/subjectRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import discussionRoutes from './routes/discussionRoutes.js';
import answerRoutes from './routes/answerRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Connect to MongoDB
console.log(__dirname)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/subjects', subjectRoutes);
app.use('/api', lessonRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/answers', answerRoutes);

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const { sub, email, name, picture } = ticket.getPayload();

    // --- Find or create user in the database ---
    const user = await User.findOneAndUpdate(
      { googleId: sub },
      {
        $setOnInsert: {
          googleId: sub,
          email,
          name,
          picture,
        },
      },
      {
        upsert: true, // This will create the user if they don't exist
        new: true,    // This will return the new document if one was created
      }
    );

    // Create a JWT for the user session
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });

    res.status(200).json({
      message: 'Authentication successful!',
      token: jwtToken,
      user: { // Send user data back to the frontend
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(400).json({ message: 'Invalid Google token.' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));