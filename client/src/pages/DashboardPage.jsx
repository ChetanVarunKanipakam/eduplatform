import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Grid,
  Stack,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import subjectService from "../services/subjectService";
import { useNavigate } from "react-router-dom";
import lessonService from "../services/lessonService";
const colors = {
  bg: "#f5f8ff",
  card: "#ffffff",
  blue: "#1976d2",
  gray: "#607d8b",
  accent: "#00C4FF",
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  useEffect(() => {
    subjectService
      .getAllSubjects()
      .then((res) => {
        setSubjects(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch subjects:", err);
        setLoading(false);
      });
  }, []);

  const handleSubjectClick = async (subject) => {
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

  if (!user){
    navigate('/notloggedin'); // or show a message
    return;
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: colors.bg,
        }}
      >
        <CircularProgress sx={{ color: colors.blue }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: colors.bg,
        minHeight: "100vh",
        py: 6,
        px: { xs: 2, md: 6 },
      }}
    >
      {/* Welcome Section */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: colors.blue, mb: 4 }}
        >
          Welcome back, {user.name} 👋
        </Typography>
      </motion.div>

      {/* Profile + Stats */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            <Paper
              sx={{
                p: 3,
                borderRadius: "20px",
                backgroundColor: colors.card,
                boxShadow: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Profile Overview
              </Typography>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar
                  src={user.picture}
                  alt={user.name}
                  sx={{
                    width: 80,
                    height: 80,
                    border: `2px solid ${colors.blue}`,
                  }}
                />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {user.name}
                  </Typography>
                  <Typography sx={{ color: colors.gray }}>
                    {user.email}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </motion.div>
        </Grid>

        {/* <Grid item xs={12} md={6}>
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4 }}
          >
            <Paper
              sx={{
                p: 3,
                borderRadius: "20px",
                backgroundColor: colors.card,
                boxShadow: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Your Activity
              </Typography>
              <Stack spacing={1.5}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>Questions Asked</Typography>
                  <Typography
                    sx={{ fontWeight: "bold", color: colors.blue }}
                  >
                    5
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>Answers Posted</Typography>
                  <Typography
                    sx={{ fontWeight: "bold", color: "#2e7d32" }}
                  >
                    12
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </motion.div>
        </Grid> */}
      </Grid> 

      {/* Subjects Section */}
      <Box sx={{ mt: 8 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", mb: 4, color: colors.blue }}
        >
          Your Subjects
        </Typography>

        <Grid container spacing={3}>
          {subjects.map((subject, index) => (
            <Grid item xs={12} sm={6} md={3} key={subject._id}>
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.1 * index }}
              >
                <Card
                  onClick={() => handleSubjectClick(subject)}
                  sx={{
                    borderRadius: "16px",
                    textAlign: "center",
                    p: 3,
                    backgroundColor: colors.card,
                    boxShadow: 3,
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      transition: "1s ease",
                      boxShadow: 6,
                      border: `2px solid ${colors.accent}`,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={
                      subject.imageUrl
                        ? `http://localhost:3000${subject.imageUrl}`
                        : "https://via.placeholder.com/150"
                    }
                    alt={subject.title}
                    sx={{
                      width: "100%",
                      height: 120,
                      borderRadius: "12px",
                      objectFit: "cover",
                      mb: 2,
                    }}
                  />
                  <Typography
                    sx={{ fontWeight: "600", color: colors.blue, mb: 1 }}
                  >
                    {subject.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.gray,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {subject.description}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
