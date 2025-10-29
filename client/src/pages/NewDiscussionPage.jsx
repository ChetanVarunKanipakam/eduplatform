import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Paper, Box, Stack } from '@mui/material';
// import api from '../services/api'; // You can uncomment this when your API is ready
// import { AuthContext } from '../context/AuthContext'; // You can uncomment this when your AuthContext is ready

// --- Color Palette ---
const colors = {
  primaryBlue: '#0d47a1',
  lightBlue: '#1976d2',
  background: '#f4f6f8',
  textPrimary: '#212121',
};

import api from '../services/api';
import { AuthContext } from '../context/AuthContext';



const NewDiscussionPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('general');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
    // Handle case where user is not logged in
    navigate('/login'); // or show a message
    return;
    }
    try {
    const res = await api.post('/discussions', { title, content, postType });
    navigate(`/discussions/${res.data._id}`);
    } catch (err) {
    console.error(err);
    }
  };
  return (
    <Box sx={{ backgroundColor: colors.background, py: 5, minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: '16px', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.08)' }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{ fontWeight: 'bold', color: colors.primaryBlue }}
                >
                  Ask a Public Question
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  Be specific and imagine you’re asking a question to another person.
                </Typography>
              </Box>

              <TextField
                label="Title"
                fullWidth
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g., How do I use GPIO pins on an ESP32 with the Arduino IDE?"
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': { fontSize: '1.1rem', borderRadius: '12px' },
                  '& .MuiInputLabel-root': { fontSize: '1.1rem', fontWeight: 'bold' }
                }}
              />

              <TextField
                label="Content"
                fullWidth
                multiline
                rows={8}
                variant="outlined"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder="Include all the information someone would need to answer your question."
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': { fontSize: '1.1rem', borderRadius: '12px' },
                  '& .MuiInputLabel-root': { fontSize: '1.1rem', fontWeight: 'bold' }
                }}
              />

              <FormControl fullWidth variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}>
                <InputLabel id="category-select-label" sx={{ fontWeight: 'bold' }}>Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  label="Category"
                  value={postType}
                  onChange={(e) => setPostType(e.target.value)}
                >
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="esp32">ESP32</MenuItem>
                  <MenuItem value="stm32">STM32</MenuItem>
                  <MenuItem value="lpc">LPC</MenuItem>
                  <MenuItem value="arduino">Arduino</MenuItem>
                </Select>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: colors.lightBlue,
                  '&:hover': { backgroundColor: colors.primaryBlue },
                  borderRadius: '10px',
                  boxShadow: '0 4px 14px 0 rgba(0, 118, 255, 0.39)',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  py: 1.5,
                }}
              >
                Post Your Question
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default NewDiscussionPage;