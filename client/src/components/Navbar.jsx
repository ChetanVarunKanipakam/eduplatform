import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar, // Import Avatar for user picture
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import MenuIcon from '@mui/icons-material/Menu';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext'; // Import your auth hook

// A simple SVG logo for "EduPlatform"
const Logo = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 12V4H12V12H4ZM8 8H10V6H8V8Z" fill="#00C4FF" />
        <path d="M12 20V12H20V20H12ZM16 16H18V14H16V16Z" fill="#00C4FF" />
        <path d="M4 20V12H12V20H4ZM8 16H10V14H8V16Z" fill="#E2E8F0" />
        <path d="M12 4H20V12H12V4ZM16 8H18V6H16V8Z" fill="#E2E8F0" />
    </svg>
);

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Get user, login, and logout from AuthContext
  const { user, login, logout } = useAuth();
  const navigate = useNavigate(); // Hook for navigation

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log(credentialResponse);
    try {
        const res = await fetch('http://localhost:3000/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: credentialResponse.credential }),
        });

        if (!res.ok) {
            throw new Error('Google login failed');
        }

        const data = await res.json();
        
        // Use the login function from context
        login(data);

        // Navigate to the dashboard
        navigate('/dashboard');

    } catch (error) {
        console.error("Authentication failed:", error);
    }
  };

  const handleGoogleFailure = () => {
    console.log('Login Failed');
  };

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home page after logout
  };

  const drawerContent = (
    <Box
      sx={{ width: 250, backgroundColor: '#1E293B', height: '100%' }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {user ? (
          <>
            <ListItemButton component={Link} to="/dashboard">
                <ListItemText primary="Dashboard" sx={{ color: '#E2E8F0' }} />
            </ListItemButton>
            <ListItemButton onClick={handleLogout}>
                <ListItemText primary="Logout" sx={{ color: '#E2E8F0' }} />
            </ListItemButton>
          </>
        ) : (
          ['Features', 'Pricing', 'Docs'].map((text) => (
            <ListItemButton key={text} sx={{ '&:hover': { backgroundColor: 'rgba(0, 196, 255, 0.1)' } }}>
              <ListItemText primary={text} sx={{ color: '#E2E8F0' }} />
            </ListItemButton>
          ))
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: '#0F172A',
          boxShadow: '0px 4px 20px rgba(0, 196, 255, 0.1)',
          borderBottom: '1px solid rgba(0, 196, 255, 0.2)',
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Logo />
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#E2E8F0' }}>
                EduPlatform
              </Typography>
            </Link>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {user ? (
                // --- Logged-in user view ---
                <>
                  <Button color="inherit" component={Link} to="/dashboard" sx={{ color: '#E2E8F0' }}>
                    Dashboard
                  </Button>
                  <Button color="inherit" onClick={handleLogout} sx={{ color: '#E2E8F0' }}>
                    Logout
                  </Button>
                  <Avatar alt={user.name} src={user.picture} sx={{ width: 32, height: 32 }} />
                </>
              ) : (
                // --- Logged-out user view ---
                <>
                  <Button color="inherit" component={Link} to="/features" sx={{ color: '#E2E8F0' }}>
                    Features
                  </Button>
                  <Button color="inherit" component={Link} to="/pricing" sx={{ color: '#E2E8F0' }}>
                    Pricing
                  </Button>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleFailure}
                  />
                </>
              )}
            </Box>
          )}

          {isMobile && (
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ color: '#E2E8F0' }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{ sx: { backgroundColor: '#1E293B' } }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;