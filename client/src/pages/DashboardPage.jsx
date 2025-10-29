// import React from 'react';
// import { useAuth } from '../context/AuthContext';
// import { Box, Typography, Avatar } from '@mui/material';

// const Dashboard = () => {
//   const { user } = useAuth();

//   if (!user) {
//     // This can be a loading spinner or a redirect in a real app
//     return <Typography>Loading...</Typography>;
//   }

//   return (
//     <Box sx={{ padding: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         Welcome to your Dashboard, {user.name}!
//       </Typography>
//       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 2 }}>
//         <Avatar src={user.picture} alt={user.name} sx={{ width: 56, height: 56 }} />
//         <Box>
//             <Typography variant="h6">{user.name}</Typography>
//             <Typography color="text.secondary">{user.email}</Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Dashboard;

import React from 'react';
import { useAuth } from '../context/AuthContext'; // Uncomment when your context is ready
import { Box, Typography, Avatar, Paper, Grid, Stack } from '@mui/material';

// --- Color Palette ---
const colors = {
  primaryBlue: '#0d47a1',
  textPrimary: '#212121',
};

// --- Mock Data for Demonstration ---
const mockUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  picture: 'https://i.pravatar.cc/150?u=john.doe',
};

const Dashboard = () => {
  const { user } = useAuth(); // Use your actual user from context
  

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: colors.primaryBlue, mb: 4 }}>
        Welcome, {user.name}!
      </Typography>
      <Grid container spacing={4}>
        {/* Profile Card */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: '16px', height: '100%', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.08)' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Profile</Typography>
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar src={user.picture} alt={user.name} sx={{ width: 80, height: 80 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.textPrimary }}>
                  {user.name}
                </Typography>
                <Typography color="text.secondary">{user.email}</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
        {/* Statistics Card */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: '16px', height: '100%', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.08)' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Your Activity</Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Questions Asked</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.primaryBlue }}>5</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Answers Posted</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.primaryBlue }}>12</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;