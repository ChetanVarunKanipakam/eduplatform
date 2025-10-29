import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Paper, List, ListItem, ListItemText, Box, TextField, InputAdornment, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// This was missing from your provided code, so I've added it back.
const filterTags = ['All', 'general', 'esp32', 'lpc', 'arduino', 'stm32'];

const MyDiscussionsPage = () => {
  const [myDiscussions, setMyDiscussions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const { user } = useAuth();

  // --- FIX #1: The useEffect hook is now at the top level with all other hooks ---
  useEffect(() => {
    // --- FIX #2: Add a check to ensure 'user' exists before fetching ---
    // This prevents errors if the component renders before the user is loaded.
    if (user) {
      const fetchDiscussions = async () => {
        try {
          const res = await api.get('/discussions/me');
          setMyDiscussions(res.data);
        } catch (err) {
          console.error('Failed to fetch user discussions:', err);
          // Optionally, handle the error state in the UI
        }
      };
      fetchDiscussions();
    }
    // The dependency array should include 'user' to refetch if the user logs in or out.
  }, [user]);

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  // --- FIX #3: The conditional return is now placed *after* all hook calls ---
  if (!user) {
    // This can be a loading spinner or skeleton screen for a better UX
    return <Typography sx={{ p: 4 }}>Loading user data...</Typography>;
  }

  const filteredDiscussions = myDiscussions.filter((discussion) => {
    // Added optional chaining (?.) to prevent errors if postType is missing
    const matchesFilter = activeFilter === 'All' || discussion.postType?.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch = discussion.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 0, p: '0 !important' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          My Discussions
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 4, borderRadius: '16px' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search your questions..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),
            sx: { borderRadius: '12px' },
          }}
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {filterTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              clickable
              variant={activeFilter === tag ? 'filled' : 'outlined'}
              color="primary"
              onClick={() => setActiveFilter(tag)}
            />
          ))}
        </Box>
      </Paper>

      <Paper sx={{ borderRadius: '16px' }}>
        <List>
          {filteredDiscussions.length > 0 ? (
            filteredDiscussions.map((discussion, index) => (
              <ListItem
                button
                component={Link}
                to={`/discussions/${discussion._id}`}
                key={discussion._id}
                divider={index < filteredDiscussions.length - 1}
                sx={{ py: 2, px: 3 }}
              >
                <ListItemText
                  primary={discussion.title}
                  secondary={`Category: ${discussion.postType}`}
                  primaryTypographyProps={{ fontWeight: 'medium', fontSize: '1.1rem' }}
                />
              </ListItem>
            ))
          ) : (
            <Typography sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
              You haven't asked any questions yet.
            </Typography>
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default MyDiscussionsPage;