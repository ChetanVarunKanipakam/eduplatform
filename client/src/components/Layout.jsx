import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ForumIcon from '@mui/icons-material/Forum';
import PersonIcon from '@mui/icons-material/Person';

const drawerWidth = 260;

// --- Color Palette ---
const colors = {
  primaryBlue: '#0d47a1',
  lightBlue: '#1976d2',
  background: '#f4f6f8',
  paper: '#ffffff',
  activeLink: 'rgba(25, 118, 210, 0.08)',
};

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'All Discussions', icon: <ForumIcon />, path: '/discussions' },
  { text: 'My Discussions', icon: <PersonIcon />, path: '/my-discussions' },
];

const Layout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: colors.paper,
            borderRight: 'none',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', p: 2 }}>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  end={item.path === '/'} // 'end' ensures the root path is only active when exact
                  sx={{
                    borderRadius: '8px',
                    '&.active': {
                      backgroundColor: colors.activeLink,
                      color: colors.lightBlue,
                      '& .MuiListItemIcon-root': {
                        color: colors.lightBlue,
                      },
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: '600' }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: colors.background,
          p: 4,
          minHeight: '100vh',
        }}
      >
        <Toolbar /> {/* This empty Toolbar provides the necessary spacing */}
        <Outlet /> {/* Child routes will render here */}
      </Box>
    </Box>
  );
};

export default Layout;