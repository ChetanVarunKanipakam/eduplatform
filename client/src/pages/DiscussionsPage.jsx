import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Box,
  Chip,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import api from '../services/api'; // You can uncomment this when your API is ready

const filterTags = ['All', 'general', 'esp32', 'lpc', 'arduino', 'stm32'];

// --- Color Palette ---
const colors = {
  primaryBlue: '#0d47a1', // A deeper, professional blue
  lightBlue: '#1976d2',
  background: '#f4f6f8', // A very light grey for the page background
  paper: '#ffffff',
  textPrimary: '#212121',
  textSecondary: '#757575',
};

const DiscussionsPage = () => {
  const [discussions, setDiscussions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchDiscussions = async () => {
      // Replaced API call with mock data for immediate demonstration
      try {
        const res = await api.get('/discussions');
        setDiscussions(res.data);
        
      } catch (err) {
        console.error(err);
      }
    };
    fetchDiscussions();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredDiscussions = discussions.filter((discussion) => {
    const matchesFilter = activeFilter === 'All' || discussion.postType.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <Box sx={{ backgroundColor: colors.background, minHeight: '100vh', py: 5 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '2rem', md: '2.75rem' }, // Responsive font size
              color: colors.primaryBlue,
            }}
          >
            Community Discussions
          </Typography>
          <Button
            component={Link}
            to="/new-discussion"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: colors.lightBlue,
              '&:hover': { backgroundColor: colors.primaryBlue },
              borderRadius: '10px',
              boxShadow: '0 4px 14px 0 rgba(0, 118, 255, 0.39)',
              fontSize: '1.1rem',
              px: 4,
              py: 1.5,
            }}
          >
            Ask a Question
          </Button>
        </Box>

        <Paper sx={{ p: { xs: 2, md: 4 }, mb: 5, borderRadius: '16px', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.08)' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for questions about ESP32, Arduino, and more..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: colors.textSecondary }} />
                </InputAdornment>
              ),
              sx: {
                fontSize: '1.1rem',
                borderRadius: '12px',
                backgroundColor: colors.background,
              },
            }}
          />
          <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {filterTags.map((tag) => (
              <Chip
                key={tag}
                label={tag.charAt(0).toUpperCase() + tag.slice(1)}
                clickable
                onClick={() => setActiveFilter(tag)}
                sx={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  py: 2.5,
                  px: 1.5,
                  borderRadius: '10px',
                  color: activeFilter === tag ? '#fff' : colors.lightBlue,
                  backgroundColor: activeFilter === tag ? colors.lightBlue : 'transparent',
                  border: `2px solid ${colors.lightBlue}`,
                  '&:hover': {
                    backgroundColor: activeFilter === tag ? colors.primaryBlue : 'rgba(25, 118, 210, 0.08)',
                  },
                }}
              />
            ))}
          </Box>
        </Paper>

        <Paper sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.08)' }}>
          <List sx={{ p: 0 }}>
            {filteredDiscussions.length > 0 ? (
              filteredDiscussions.map((discussion, index) => (
                <ListItem
                  button
                  component={Link}
                  to={`/discussions/${discussion._id}`}
                  key={discussion._id}
                  divider={index < filteredDiscussions.length - 1}
                  sx={{
                    py: 3,
                    px: 3,
                    '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' },
                  }}
                >
                  <ListItemText
                    primary={discussion.title}
                    secondary={`Asked by ${discussion.author.name} | Category: ${discussion.postType}`}
                    primaryTypographyProps={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: colors.textPrimary,
                      mb: 0.5,
                    }}
                    secondaryTypographyProps={{ fontSize: '1rem', color: colors.textSecondary }}
                  />
                </ListItem>
              ))
            ) : (
              <Typography sx={{ p: 5, textAlign: 'center', fontSize: '1.2rem', color: colors.textSecondary }}>
                No discussions found. Try adjusting your search or filters.
              </Typography>
            )}
          </List>
        </Paper>
      </Container>
    </Box>
  );
};

export default DiscussionsPage;