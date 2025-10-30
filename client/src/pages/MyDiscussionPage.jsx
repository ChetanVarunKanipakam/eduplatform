import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    Container, 
    Typography, 
    Paper, 
    List, 
    ListItem, 
    ListItemText, 
    Box, 
    TextField, 
    InputAdornment, 
    Chip,
    Button,
    ToggleButtonGroup,
    ToggleButton, // Make sure ToggleButton is imported
    Stack, // Stack is used for layout, so it should be imported
    CircularProgress // A better loading indicator
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
const filterTags = ['All', 'general', 'esp32', 'lpc', 'arduino', 'stm32'];
const colors = {
  primaryBlue: '#0d47a1',
  lightBlue: '#1976d2',
  background: '#f4f6f8',
  paper: '#ffffff',
  textPrimary: '#212121',
  textSecondary: '#757575',
  success: '#2e7d32', 
};

const MyDiscussionsPage = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true); // Add a dedicated loading state
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      const fetchDiscussions = async () => {
        try {
          const res = await api.get('/discussions/discussions/me');
          console.log(res)
          setDiscussions(res.data);
        } catch (err) {
          console.error('Failed to fetch user discussions:', err);
        } finally {
          setLoading(false); // Stop loading once done, even if there's an error
        }
      };
      fetchDiscussions();
    } else {
      setLoading(false); // If there's no user, we're not loading anything
    }
  }, [user]);

  // FIX #1: The handleSearchChange function is now clean. It only updates the state.
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event, newSortBy) => {
    if (newSortBy !== null) {
      setSortBy(newSortBy);
    }
  };
 
  // FIX #2: The sorting logic is updated to use data that exists in your schema.
  // 'popular' sort is removed as `votes` doesn't exist.
  const sortedAndFilteredDiscussions = discussions
    .filter((discussion) => {
      const matchesFilter = activeFilter === 'All' || discussion.postType.toLowerCase() === activeFilter.toLowerCase();
      const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'unanswered':
          return a.answers.length - b.answers.length;
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  
  // FIX #3: A proper loading state is handled here before rendering the main content.
  if (loading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <CircularProgress />
        </Box>
    );
  }

  // If there's no user logged in, show a helpful message.
  if (!user){
    navigate('/notloggedin'); // or show a message
    return;
  }

  // This is the main return statement for the component's UI.
  return (
    <Box sx={{ backgroundColor: colors.background, minHeight: '100vh', pb: 5 ,pt:2}}>
      <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: colors.primaryBlue }}>
                My Discussions
            </Typography>
            <Button component={Link} to="/new-discussion" variant="contained" size="large" sx={{ backgroundColor: colors.lightBlue, '&:hover': { backgroundColor: colors.primaryBlue }, borderRadius: '10px' }}>
                Ask a Question
            </Button>
            </Box>

            <Paper sx={{ p: { xs: 2, md: 4 }, mb: 5, borderRadius: '16px', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.08)' }}>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search your questions..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                    <SearchIcon sx={{ color: colors.textSecondary }} />
                    </InputAdornment>
                ),
                sx: { borderRadius: '12px', backgroundColor: colors.background },
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
                        py: 2.5, px: 1.5,
                        borderRadius: '10px',
                        color: activeFilter === tag ? '#fff' : colors.lightBlue,
                        backgroundColor: activeFilter === tag ? colors.lightBlue : 'transparent',
                        border: `2px solid ${colors.lightBlue}`,
                        '&:hover': { backgroundColor: activeFilter === tag ? colors.primaryBlue : 'rgba(25, 118, 210, 0.08)'},
                    }}
                />
                ))}
            </Box>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <ToggleButtonGroup value={sortBy} exclusive onChange={handleSortChange}>
                    <ToggleButton value="newest">Newest</ToggleButton>
                    <ToggleButton value="unanswered">Unanswered</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Paper sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.08)' }}>
            <List sx={{ p: 0 }}>
                {sortedAndFilteredDiscussions.length > 0 ? (
                sortedAndFilteredDiscussions.map((discussion, index) => (
                    <ListItem
                        button
                        component={Link}
                        to={`/discussions/${discussion._id}`}
                        key={discussion._id}
                        divider={index < sortedAndFilteredDiscussions.length - 1}
                        sx={{ py: 2, px: 3, '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' } }}
                    >
                    {/* FIX #4: UI updated to remove non-existent `votes` and `hasAcceptedAnswer` */}
                    <Stack direction="row" spacing={3} alignItems="center" sx={{ width: '100%' }}>
                        <Stack direction="column" spacing={0.5} alignItems="center" sx={{ color: colors.textSecondary, minWidth: '80px' }}>
                            <Typography variant="h6">{discussion.answers.length}</Typography>
                            <Typography variant="caption">answers</Typography>
                        </Stack>
                        <ListItemText
                            primary={discussion.title}
                            secondary={`Category: ${discussion.postType}`}
                            primaryTypographyProps={{ fontSize: '1.2rem', fontWeight: '600', color: colors.textPrimary }}
                            secondaryTypographyProps={{ fontSize: '0.9rem', color: colors.textSecondary }}
                        />
                    </Stack>
                    </ListItem>
                ))
                ) : (
                <Typography sx={{ p: 5, textAlign: 'center', fontSize: '1.2rem', color: colors.textSecondary }}>
                    You haven't asked any questions yet, or none match your current filter.
                </Typography>
                )}
            </List>
            </Paper>
        </Container>
    </Box>
  );
};

export default MyDiscussionsPage;