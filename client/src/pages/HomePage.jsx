// A subtle animation for the background gradient glow

import React, { useRef,useState, useEffect } from 'react';
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
import lessonService from '../services/lessonService';
// A subtle animation for the background gradient glow
const animatedGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;
// STYLED SUBJECT CARD COMPONENT
const SubjectCard = ({ subject }) => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false); // 👈 **(Step 2) ADD LOADING STATE**

  const handleCardClick = async () => {
    // Prevent multiple clicks while fetching
    if (isNavigating) return;
    setIsNavigating(true);

    try {
      // 👈 **(Step 3) FETCH LESSONS FOR THIS SPECIFIC SUBJECT**
      const response = await lessonService.getLessonsBySubject(subject._id);
      const lessons = response.data; // Assuming your service returns { data: [...] }
      console.log(lessons)
      console.log(response)
      if (lessons && lessons.length > 0) {
        // Find the first lesson to navigate to
        const firstLessonId = lessons[0]._id;
        
        // 👈 **(Step 4) NAVIGATE WITH THE CORRECT URL AND FULL STATE**
        // We combine the original subject info with the lessons we just fetched.
        // This gives the next page (SubjectLessonPage) everything it needs.
        const subjectWithLessons = { ...subject, lessons };

        navigate(`/subjects/${subject._id}/lessons/${firstLessonId}`, {
          state: { subject: subjectWithLessons },
        });
      } else {
        // Handle case where a subject might have no lessons
        console.warn(`Subject "${subject.title}" has no lessons to navigate to.`);
        alert(`The subject "${subject.title}" has no lessons yet. Please check back later.`);
        setIsNavigating(false); // Reset state if we don't navigate
      }
    } catch (error) {
      console.error("Failed to fetch lessons for subject:", error);
      alert("Could not load lessons. Please try again.");
      setIsNavigating(false); // Reset state on error
    }
    // No need for a finally block, as navigation will unmount the component
  };

return (
<Card
onClick={handleCardClick}
sx={{
height: "390px",
width: "450px",
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

  // --- Fallback for any number of subjects other than 4 ---
  // This renders the standard, responsive grid you already had.
  if (subjects.length !== 4) {
    return (
      <Grid container spacing={6} justifyContent="center">
        {subjects.map((subject) => (
          <Grid item key={subject._id} xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <SubjectCard subject={subject} />
          </Grid>
        ))}
      </Grid>
    );
  }

  // --- Special "+" Layout for exactly 4 subjects ---
  // We manually place each card in its position.
  const [subject1, subject2, subject3, subject4] = subjects;

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: 6 // This provides vertical spacing between the rows
      }}
    >
      {/* Row 1: The top, single, centered card */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <SubjectCard subject={subject1} />
      </Box>

      {/* Row 2: The middle row with two cards */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 6, // This provides horizontal spacing between the two cards
          flexWrap: 'wrap' // Ensures responsiveness on smaller screens
        }}
      >
        <SubjectCard subject={subject2} />
        <SubjectCard subject={subject3} />
      </Box>

      {/* Row 3: The bottom, single, centered card */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <SubjectCard subject={subject4} />
      </Box>
    </Box>
  );
};
// MAIN HOMEPAGE COMPONENT
const HomePage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create a ref for the subjects section
  const subjectsRef = useRef(null);

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

  // Function to handle the button click and scroll
  const handleExploreClick = () => {
    subjectsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#0F172A',
        }}
      >
        <CircularProgress sx={{ color: '#00C4FF' }} />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box
        sx={{
          pt:7,
          backgroundColor: '#0F172A',
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* All content must be positioned relative to be above any pseudo-elements */}
        <Box position="sticky" sx={{ zIndex: 1 }}>
          {/* Hero Section */}
          <Box
            sx={{
              minHeight: '40vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: '#E2E8F0',
              p: 3,
              backgroundImage: `linear-gradient(rgba(1, 3, 6, 0.9), rgba(0, 0, 0, 1)), url(${bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <Container maxWidth="md">
              <Typography
                variant="h2"
                component="h1"
                fontWeight="bold"
                gutterBottom
              >
                Unlock Your Potential
              </Typography>
              <Typography variant="h5" sx={{ color: '#CBD5E0', mb: 4 }}>
                Learn from industry experts and build amazing embedded projects.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleExploreClick} // Attach the click handler here
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
            ref={subjectsRef} // Attach the ref to this Box
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
