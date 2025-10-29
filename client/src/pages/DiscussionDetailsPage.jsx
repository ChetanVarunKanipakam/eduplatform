import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, TextField, Button, Box, Avatar, IconButton, Divider, Stack } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import api from '../services/api'; // You can uncomment this when your API is ready
import { AuthContext } from '../context/AuthContext'; // You can uncomment this when your AuthContext is ready

// --- Color Palette ---
const colors = {
  primaryBlue: '#0d47a1',
  lightBlue: '#1976d2',
  background: '#f4f6f8',
  paper: '#ffffff',
  textPrimary: '#212121',
  textSecondary: '#757575',
  action: '#bdbdbd', // A neutral grey for icons
};

// --- Mock Data for Demonstration --
const DiscussionDetailsPage = () => {
  const { id } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const { user } = useContext(AuthContext); // Use MockAuthContext

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

  const handleAnswerSubmit = async(e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/answers/${id}`, { content: newAnswer });
      setAnswers([...answers, res.data]);
      setNewAnswer('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike =async (answerId) => {
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
    <Box sx={{ backgroundColor: colors.background, py: 5, minHeight: '100vh' }}>
      <Container maxWidth="md">
        {/* --- The Question --- */}
        <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: '16px', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.08)' }}>
          <Stack spacing={2}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 'bold', color: colors.primaryBlue, wordBreak: 'break-word' }}
            >
              {discussion.title}
            </Typography>
            <Box display="flex" alignItems="center">
              <Avatar src={discussion.author.picture} alt={discussion.author.name} sx={{ width: 48, height: 48 }} />
              <Typography variant="subtitle1" sx={{ ml: 2, fontWeight: 'bold', color: colors.textPrimary }}>
                {discussion.author.name}
              </Typography>
            </Box>
            <Divider />
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.7, color: colors.textPrimary }}>
              {discussion.content}
            </Typography>
          </Stack>
        </Paper>

        {/* --- The Answers --- */}
        <Typography variant="h5" sx={{ mt: 5, mb: 3, fontWeight: 'bold', color: colors.textPrimary }}>
          Answers
        </Typography>
        <Stack spacing={3}>
          {answers.map((answer) => (
            <Paper key={answer._id} sx={{ p: 3, borderRadius: '16px', boxShadow: '0 4px 12px 0 rgba(0,0,0,0.06)' }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar src={answer.author.picture} alt={answer.author.name} sx={{ width: 40, height: 40 }} />
                <Typography variant="subtitle2" sx={{ ml: 1.5, fontWeight: 'bold' }}>
                  {answer.author.name}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontSize: '1rem', lineHeight: 1.6, color: colors.textSecondary, pb: 2 }}>
                {answer.content}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <IconButton onClick={() => handleLike(answer._id)} disabled={!user} size="small">
                  <ThumbUpIcon
                    sx={{ color: answer.likes.includes(user?.id) ? colors.lightBlue : colors.action }}
                  />
                </IconButton>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: colors.lightBlue }}>
                  {answer.likes.length}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Stack>

        {/* --- "Post Your Answer" Form --- */}
        {user && (
          <Paper sx={{ p: { xs: 2, md: 4 }, mt: 5, borderRadius: '16px', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.08)' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Your Answer
            </Typography>
            <form onSubmit={handleAnswerSubmit}>
              <TextField
                fullWidth
                multiline
                rows={5}
                variant="outlined"
                placeholder="Write your answer here..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    fontSize: '1.1rem'
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  mt: 2,
                  backgroundColor: colors.lightBlue,
                  '&:hover': { backgroundColor: colors.primaryBlue },
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  px: 4,
                }}
              >
                Post Your Answer
              </Button>
            </form>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default DiscussionDetailsPage;