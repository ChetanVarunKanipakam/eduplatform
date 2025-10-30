import React from "react";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Paper,
  Button,
  Container,
  Divider,
} from "@mui/material";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../context/AuthContext';
const NotLoggedIn = () => {
    const {  login} = useAuth();
  const navigate = useNavigate();
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

  return (
     <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to bottom right, #e3f2fd, #ffffff)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Paper
          elevation={10}
          sx={{
            p: 6,
            borderRadius: 4,
            textAlign: "center",
            width: "380px",
            bgcolor: "white",
            border: "1px solid #e3f2fd",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            color="primary"
            gutterBottom
            sx={{ mb: 2 }}
          >
            You’re Not Logged In
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Seems like you’re not logged in yet. Please log in to continue and
            access your dashboard.
          </Typography>

          {/* Google OAuth 2.0 Login */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary">
            Don’t have an account? It will be created automatically after login.
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default NotLoggedIn;
