import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
} from '@mui/material';
import { keyframes } from '@emotion/react';
import subjectService from '../services/subjectService'; // Make sure this path is correct
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import bg from '../assets/bg2.png';
// A subtle animation for the background gradient glow
const animatedGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// STYLED SUBJECT CARD COMPONENT
const SubjectCard = ({ subject }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Navigate to the first lesson of the subject if it exists
    if (subject && subject.lessons && subject.lessons.length > 0) {
      navigate(`/subjects/${subject._id}/lessons/${subject.lessons[0]._id}`,{
state: { subject }, // pass subject and its lessons here
});
    } else {
      console.warn(`Subject "${subject.title}" has no lessons to navigate to.`);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        height: "380px",
        width: "500px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "rgba(30, 41, 59, 0.85)", // Made slightly more opaque for readability
        backdropFilter: 'blur(8px)', // Frosted glass effect
        borderRadius: "16px",
        border: "1px solid rgba(0, 196, 255, 0.4)",
        cursor: "pointer",
        overflow: 'hidden', // Ensures CardMedia respects the border radius
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0px 10px 30px rgba(0, 196, 255, 0.3)",
        },
      }}
    >
      <CardMedia
        component="img"
        height="300"
        image={subject.imageUrl 
    ? `http://localhost:3000${subject.imageUrl}` 
    : "https://via.placeholder.com/400x200"}
        alt={subject.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#E2E8F0", mb: 1 }}
        >
          {subject.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#CBD5E0", lineHeight: 1.6 }}
        >
          {subject.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

// SUBJECTS GRID COMPONENT
const SubjectsGrid = ({ subjects }) => {
  console.log(subjects)
  return (
    <Grid container spacing={6} justifyContent="center">
      {subjects.map((subject) => (
        <Grid item key={subject._id} xs={12} sm={6} md={4}>
          <SubjectCard subject={subject} />
        </Grid>
      ))}
    </Grid>
  );
};

// MAIN HOMEPAGE COMPONENT
const HomePage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    subjectService
      .getAllSubjects()
      .then((response) => {
        setSubjects(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching subjects:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0F172A' }}>
        <CircularProgress sx={{ color: '#00C4FF' }} />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box
        sx={{
          backgroundColor: '#0F172A',
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* All content must be positioned relative to be above any pseudo-elements */}
        <Box  position="sticky" sx={{ zIndex: 1}}>
          {/* Hero Section */}
          <Box
           
            sx={{
              minHeight: '20vh', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: '#E2E8F0',
              p: 3,
              // NEW Hero Background: A dark, clean schematic/blueprint
              backgroundImage: `
                linear-gradient(rgba(1, 3, 6, 0.9), rgba(0, 0, 0, 1)),
                url(${bg})
              `,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <Container maxWidth="md">
              <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
                Unlock Your Potential
              </Typography>
              <Typography variant="h5" sx={{ color: '#CBD5E0', mb: 4 }}>
                Learn from industry experts and build amazing embedded projects.
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(45deg, #00C4FF, #00E676)',
                  color: '#0F172A',
                  fontWeight: 'bold',
                  padding: '12px 32px',
                  borderRadius: '12px',
                  boxShadow: '0px 0px 25px rgba(0, 210, 180, 0.5)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0px 0px 35px rgba(0, 210, 180, 0.7)',
                  },
                }}
              >
                Explore Courses
              </Button>
            </Container>
          </Box>

          {/* Subjects Section */}
          <Box
            sx={{
              py: 10,
              // NEW Subjects Background: A detailed PCB (Printed Circuit Board)
              backgroundImage: `
                linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 1)),
                url(${bg})
              `,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed', // Parallax effect
            }}
          >
            <Container>
              <Typography
                variant="h4"
                gutterBottom
                align="center"
                sx={{ color: '#E2E8F0', fontWeight: 'bold', mb: 8 }}
              >
                Explore Our Subjects
              </Typography>
              <SubjectsGrid subjects={subjects} />
            </Container>
          </Box>

          {/* Footer */}
          <Box
            component="footer"
            sx={{
              py: 4,
              textAlign: 'center',
              backgroundColor: '#0F172A', // Solid dark footer
              borderTop: '1px solid rgba(0, 196, 255, 0.2)',
              color: '#CBD5E0',
            }}
          >
            <Typography variant="body1">
              © {new Date().getFullYear()} EduPlatform. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default HomePage;