import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ForumIcon from '@mui/icons-material/Forum';
import PersonIcon from '@mui/icons-material/Person';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import DashboardNavbar from './DashboardNavbar';

const drawerWidth = 250;

const colors = {
  primaryBlue: '#1565c0',
  lightBlue: '#42a5f5',
  gradient: 'linear-gradient(180deg, #1976d2 0%, #2196f3 100%)',
  white: '#ffffff',
  grayText: '#546e7a',
  activeBg: 'rgba(25, 118, 210, 0.1)',
};

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'My Discussions', icon: <PersonIcon />, path: '/my-discussions' },
  { text: 'All Discussions', icon: <ForumIcon />, path: '/discussions' },
];

const Layout = () => {
  return (
    <>
      <DashboardNavbar />
      <Box sx={{ display: 'flex' }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            zIndex:0,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              background: colors.gradient,
              color: colors.white,
              borderRight: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              pt: 2,
            },
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                fontWeight: '700',
                mb: 2,
                letterSpacing: 0.5,
              }}
            >
              EduPlatform
            </Typography>

            <List>
              {navItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to={item.path}
                    end
                    sx={{
                      borderRadius: '12px',
                      mx: 1,
                      my: 0.5,
                      py: 1,
                      color: colors.white,
                      '&.active': {
                        backgroundColor: colors.activeBg,
                        '& .MuiListItemIcon-root': {
                          color: colors.white,
                        },
                      },
                      '&:hover': {
                        backgroundColor: colors.activeBg,
                        transform: 'scale(1.03)',
                        transition: '0.2s ease',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: colors.white }}>{item.icon}</ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>

          <Box sx={{ textAlign: 'center', p: 2, opacity: 0.8 }}>
            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
              © 2025 EduPlatform
            </Typography>
          </Box>
        </Drawer>

        <Box
          component={motion.main}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            flexGrow: 1,
            backgroundColor: '#f5f8ff',
            minHeight: '100vh',
            pt: 8,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default Layout;
