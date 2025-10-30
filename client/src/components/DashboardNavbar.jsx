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
  Avatar,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

const colors = {
  white: '#ffffff',
  lightBlue: '#1976d2',
  gradient: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
  textDark: '#0f172a',
};

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <path d="M4 12V4H12V12H4ZM8 8H10V6H8V8Z" fill={colors.lightBlue} />
    <path d="M12 20V12H20V20H12ZM16 16H18V14H16V16Z" fill={colors.lightBlue} />
  </svg>
);

const DashboardNavbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setDrawerOpen(open);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch('http://localhost:3000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      if (!res.ok) throw new Error('Google login failed');

      const data = await res.json();
      login(data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const drawerContent = (
    <Box sx={{ width: 250, backgroundColor: colors.white, height: '100%' }}>
      <List>
        {user ? (
          <>
            <ListItemButton component={Link} to="/dashboard">
              <ListItemText primary="Dashboard" sx={{ color: colors.textDark }} />
            </ListItemButton>
            <ListItemButton component={Link} to="/discussions">
              <ListItemText primary="Discussions" sx={{ color: colors.textDark }} />
            </ListItemButton>
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" sx={{ color: colors.textDark }} />
            </ListItemButton>
          </>
        ) : (
          <ListItemButton component={Link} to="/alldiscussions">
            <ListItemText primary="Discussions" sx={{ color: colors.textDark }} />
          </ListItemButton>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={2}
        sx={{
          background: colors.white,
          color: colors.textDark,
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none', color: colors.textDark, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Logo />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              EduPlatform
            </Typography>
          </Link>

          {!isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {user ? (
                <>
                  <Button component={Link} to="/dashboard" sx={{ color: colors.textDark, fontWeight: 500 }}>
                    Dashboard
                  </Button>
                  <Button component={Link} to="/discussions" sx={{ color: colors.textDark, fontWeight: 500 }}>
                    Discussions
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="contained"
                    sx={{
                      background: colors.gradient,
                      color: colors.white,
                      fontWeight: 'bold',
                      borderRadius: '8px',
                      textTransform: 'none',
                      px: 2,
                    }}
                  >
                    Logout
                  </Button>
                  <Avatar alt={user.name} src={user.picture} sx={{ width: 34, height: 34 }} />
                </>
              ) : (
                <>
                  <Button component={Link} to="/alldiscussions" sx={{ color: colors.textDark }}>
                    Discussions
                  </Button>
                  <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.log('Login Failed')} />
                </>
              )}
            </Box>
          ) : (
            <IconButton onClick={toggleDrawer(true)} sx={{ color: colors.textDark }}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </>
  );
};

export default DashboardNavbar;
