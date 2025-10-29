import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Paper,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Link as MuiLink,
} from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import lessonService from "../services/lessonService"; // Ensure path is correct
import { BookOpen, Layers, Code, ExternalLink } from "lucide-react";
import CodeEditor from "../components/CodeEditor"; // Ensure you have this component

const drawerWidth = 280;

const SubjectLessonPage = () => {
  const { subjectId, lessonId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const subject = location.state?.subject || null;
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loadingLesson, setLoadingLesson] = useState(true);

  // Redirect to the first lesson if none is selected
  useEffect(() => {
    if (subject && !lessonId && subject.lessons?.length > 0) {
      navigate(`/subjects/${subjectId}/lessons/${subject.lessons[0]._id}`, {
        replace: true,
        state: { subject },
      });
    }
  }, [subject, subjectId, lessonId, navigate]);

  // Fetch the specific lesson's content
  useEffect(() => {
    if (lessonId) {
      setLoadingLesson(true);
      lessonService
        .getLessonById(lessonId)
        .then((response) => {
          console.log(response)
          setCurrentLesson(response);
          setLoadingLesson(false);
        })
        .catch((error) => {
          console.error("Error fetching lesson:", error);
          setLoadingLesson(false);
        });
    }
  }, [lessonId]);

  if (!subject) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#F8FAFC",
        }}
      >
        <Typography variant="h6" color="error">
          Subject not found. Please navigate from the homepage.
        </Typography>
      </Box>
    );
  }

  const drawerContent = (
    <Box sx={{ p: 2, height: '100%' }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, pl: 2 }}>
        <Layers size={24} color="#0F172A" />
        <Typography variant="h6" fontWeight="bold" color="#0F172A">
          {subject.title}
        </Typography>
      </Box>
      <Divider />
      <List>
        {subject.lessons?.map((lesson) => (
          <ListItemButton
            key={lesson._id}
            selected={lesson._id === lessonId}
            onClick={() =>
              navigate(`/subjects/${subjectId}/lessons/${lesson._id}`, {
                state: { subject },
              })
            }
            sx={{
              borderRadius: 2,
              mb: 1,
              "&.Mui-selected": {
                backgroundColor: "#00C4FF",
                color: "#0F172A",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#00a8e0" },
              },
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
            }}
          >
            <ListItemText primary={lesson.title} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid #E2E8F0",
            backgroundColor: "#FFFFFF",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          // Clean, light background for the main content area
          background: 'linear-gradient(to bottom right, #FFFFFF, #F8FAFC)',
        }}
      >
        {loadingLesson ? (
          <CircularProgress sx={{ display: "block", margin: "auto", mt: 4, color: '#00C4FF' }} />
        ) : !currentLesson ? (
          <Typography variant="h6" color="error" align="center" mt={4}>
            Lesson not found.
          </Typography>
        ) : (
          <Container maxWidth="lg">
            {/* Lesson Header */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 2,
                backgroundColor: 'white',
                mb: 4,
                display: "flex",
                alignItems: "center",
                gap: 2,
                borderLeft: '5px solid #00C4FF', // Accent border
                border: '1px solid #E2E8F0',
              }}
            >
              <BookOpen size={36} color="#00C4FF" />
              <Typography variant="h4" fontWeight="bold" color="#2D3748">
                {currentLesson.title}
              </Typography>
            </Paper>

            {/* Lesson Content */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 2,
                mb: 4,
                backgroundColor: "white",
                border: "1px solid #E2E8F0",
              }}
            >
              <Typography
                variant="body1"
                sx={{ color: "#2D3748", lineHeight: 1.8, fontSize: "1.1rem" }}
              >
                {currentLesson.content}
              </Typography>
            </Paper>

            {/* Code Editor */}
            {currentLesson.hasCodeEditor && (
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 2,
                  mb: 4,
                  overflow: "hidden",
                  border: '1px solid #E2E8F0',
                }}
              >
                <Box sx={{ p: 2, backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid #E2E8F0' }}>
                  <Code size={20} color="#2D3748" />
                  <Typography variant="h6" sx={{ color: '#2D3748', fontWeight: 'bold' }}>
                    Try It Yourself
                  </Typography>
                </Box>
                {/* The CodeEditor itself remains dark for contrast and developer preference */}
                <CodeEditor codeSnippet={currentLesson.codeSnippet} />
              </Paper>
            )}

            {/* Additional Resources */}
            {currentLesson.links && currentLesson.links.length > 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: "white",
                  border: "1px solid #E2E8F0",
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ color: "#1E293B", fontWeight: "bold" }}>
                  Additional Resources
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {currentLesson.links.map((link, index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                    <ExternalLink size={18} style={{ marginRight: 8, color: "#00C4FF" }} />
                    <MuiLink
                      href={link.url}
                      target="_blank"
                      rel="noopener"
                      sx={{
                        color: "#00C4FF",
                        fontWeight: 500,
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      {link.title}
                    </MuiLink>
                  </Box>
                ))}
              </Paper>
            )}
          </Container>
        )}
      </Box>
    </Box>
  );
};

export default SubjectLessonPage;