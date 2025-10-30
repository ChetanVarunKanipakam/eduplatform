import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Avatar,
  IconButton,
  Divider,
  Stack,
  Fade,
  Tooltip,
  Chip,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { motion } from 'framer-motion';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const MotionPaper = motion(Paper);

// --- Color Palette ---
const colors = {
  primaryBlue: '#1565c0',
  lightBlue: '#1e88e5',
  background: '#f0f6ff',
  paper: '#ffffff',
  textPrimary: '#0f172a',
  textSecondary: '#555',
  accent: '#42a5f5',
  gray: '#bdbdbd',
};

const DiscussionDetailsPage = () => {
  const { id } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchDiscussion = async () => {
      try {
        const res = await api.get(`/discussions/${id}`);
        setDiscussion(res.data.discussion);
        setAnswers(res.data.answers);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDiscussion();
  }, [id]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/answers/${id}`, { content: newAnswer });
      setAnswers([...answers, res.data]);
      setNewAnswer('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (answerId) => {
    try {
      const res = await api.put(`/answers/${answerId}/like`);
      setAnswers(
        answers.map((answer) =>
          answer._id === answerId ? { ...answer, likes: res.data } : answer
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (!discussion) return <Typography>Loading...</Typography>;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(125deg, #e3f2fd, ${colors.background}, #dbeafe)`,
        py: 8,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="md">
        {/* --- Main Discussion Card --- */}
        <MotionPaper
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: '24px',
            background:
              'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(255,255,255,0.98))',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 12px 40px rgba(33, 150, 243, 0.15)',
            mb: 6,
          }}
        >
          <Stack spacing={3}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: colors.primaryBlue,
                wordBreak: 'break-word',
                lineHeight: 1.3,
              }}
            >
              {discussion.title}
            </Typography>

            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                src={discussion.author.picture}
                alt={discussion.author.name}
                sx={{
                  width: 64,
                  height: 64,
                  border: `3px solid ${colors.accent}`,
                }}
              />
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, color: colors.textPrimary }}
                >
                  {discussion.author.name}
                </Typography>
                <Chip
                  label="Discussion Author"
                  size="small"
                  sx={{
                    backgroundColor: '#e3f2fd',
                    color: colors.lightBlue,
                    fontWeight: 600,
                    mt: 0.5,
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ borderColor: 'rgba(0,0,0,0.08)' }} />

            <Typography
              variant="body1"
              sx={{
                fontSize: '1.15rem',
                lineHeight: 1.8,
                color: colors.textPrimary,
                whiteSpace: 'pre-line',
              }}
            >
              {discussion.content}
            </Typography>
          </Stack>
        </MotionPaper>

        {/* --- Answers Section --- */}
        <Typography
          variant="h5"
          sx={{
            mt: 6,
            mb: 3,
            fontWeight: 700,
            color: colors.primaryBlue,
            borderLeft: `6px solid ${colors.accent}`,
            pl: 2,
          }}
        >
          Answers ({answers.length})
        </Typography>

        <Stack spacing={4}>
          {answers.map((answer, i) => (
            <Fade in key={answer._id} style={{ transitionDelay: `${i * 100}ms` }}>
              <MotionPaper
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 140 }}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: '18px',
                  backgroundColor: 'rgba(255,255,255,0.96)',
                  boxShadow: '0 10px 28px rgba(0,0,0,0.08)',
                  borderLeft: `4px solid ${colors.lightBlue}`,
                }}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    src={answer.author.picture}
                    alt={answer.author.name}
                    sx={{
                      width: 50,
                      height: 50,
                      border: `2px solid ${colors.lightBlue}`,
                    }}
                  />
                  <Box sx={{ ml: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: colors.textPrimary,
                      }}
                    >
                      {answer.author.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: colors.textSecondary }}
                    >
                      {new Date(answer.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '1.05rem',
                    lineHeight: 1.7,
                    color: colors.textSecondary,
                    pb: 2,
                  }}
                >
                  {answer.content}
                </Typography>

                <Box display="flex" alignItems="center">
                  <Tooltip title={!user ? 'Login to like' : 'Like this answer'}>
                    <span>
                      <IconButton
                        onClick={() => handleLike(answer._id)}
                        disabled={!user}
                        size="small"
                      >
                        <ThumbUpIcon
                          sx={{
                            color: answer.likes.includes(user?.id)
                              ? colors.lightBlue
                              : colors.gray,
                            transition: 'color 0.3s ease',
                          }}
                        />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: colors.lightBlue,
                      ml: 0.5,
                    }}
                  >
                    {answer.likes.length}
                  </Typography>
                </Box>
              </MotionPaper>
            </Fade>
          ))}
        </Stack>

        {/* --- Post Answer Form --- */}
        {user && (
          <MotionPaper
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            sx={{
              p: { xs: 3, md: 5 },
              mt: 8,
              mb: 6,
              borderRadius: '24px',
              boxShadow: '0 10px 40px rgba(33,150,243,0.15)',
              background: 'rgba(255,255,255,0.97)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: colors.primaryBlue,
              }}
            >
              Share Your Answer 💡
            </Typography>

            <form onSubmit={handleAnswerSubmit}>
              <TextField
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                placeholder="Write something helpful and detailed..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '14px',
                    fontSize: '1.05rem',
                    backgroundColor: '#fff',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 0 12px rgba(25,118,210,0.2)',
                    },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  mt: 3,
                  background: `linear-gradient(90deg, ${colors.lightBlue}, ${colors.accent})`,
                  '&:hover': { opacity: 0.9 },
                  borderRadius: '14px',
                  fontWeight: 'bold',
                  px: 5,
                  py: 1.4,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 6px 20px rgba(33,150,243,0.25)',
                }}
              >
                Post Your Answer
              </Button>
            </form>
          </MotionPaper>
        )}
      </Container>
    </Box>
  );
};

export default DiscussionDetailsPage;
