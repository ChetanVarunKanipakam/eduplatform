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
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import lessonService from "../services/lessonService";
import { BookOpen, Layers, Code, ExternalLink } from "lucide-react";
import CodeEditor from "../components/CodeEditor";

const drawerWidth = 280;

// 🎨 Color Palette — matching dashboard & sidebar
const colors = {
  primary: "#0d47a1",
  accent: "#00B0FF",
  lightBg: "#F8FAFC",
  border: "#E2E8F0",
  textDark: "#1E293B",
  textLight: "#475569",
  white: "#FFFFFF",
};

// ========================================================
// Reusable Block Components (styled for white–blue theme)
// ========================================================
const HeadingBlock = ({ text, level }) => {
  const variant = `h${Math.min(level + 3, 6)}`;
  return (
    <Typography
      variant={variant}
      fontWeight="bold"
      color={colors.primary}
      sx={{ mt: 4, mb: 2 }}
    >
      {text}
    </Typography>
  );
};

const ParagraphBlock = ({ text }) => (
  <Paper
    elevation={1}
    sx={{
      p: { xs: 3, md: 4 },
      borderRadius: 2,
      mb: 4,
      backgroundColor: colors.white,
      border: `1px solid ${colors.border}`,
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    }}
  >
    <Typography
      variant="body1"
      sx={{
        color: colors.textLight,
        lineHeight: 1.8,
        fontSize: "1.05rem",
        whiteSpace: "pre-wrap",
      }}
    >
      {text}
    </Typography>
  </Paper>
);

const ImageBlock = ({ src, caption }) => (
  <motion.figure
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    style={{
      margin: 0,
      borderRadius: 12,
      overflow: "hidden",
      marginBottom: 24,
      border: `1px solid ${colors.border}`,
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      backgroundColor: colors.white,
    }}
  >
    <img src={src} alt={caption || "Lesson image"} style={{ width: "100%", display: "block" }} />
    {caption && (
      <Typography
        component="figcaption"
        sx={{
          p: 2,
          backgroundColor: colors.lightBg,
          color: colors.textLight,
          textAlign: "center",
        }}
      >
        {caption}
      </Typography>
    )}
  </motion.figure>
);

const CodeBlock = ({ code, language }) => (
  <Paper
    elevation={1}
    sx={{
      borderRadius: 2,
      mb: 4,
      overflow: "hidden",
      border: `1px solid ${colors.border}`,
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    }}
  >
    <Box
      sx={{
        p: 2,
        backgroundColor: colors.lightBg,
        display: "flex",
        alignItems: "center",
        gap: 2,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <Code size={20} color={colors.primary} />
      <Typography variant="h6" sx={{ color: colors.primary, fontWeight: "bold" }}>
        Try It Yourself
      </Typography>
    </Box>
    <CodeEditor codeSnippet={code} language={language} />
  </Paper>
);

const LinkListBlock = ({ links }) => (
  <Paper
    elevation={1}
    sx={{
      p: 3,
      borderRadius: 2,
      backgroundColor: colors.white,
      border: `1px solid ${colors.border}`,
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    }}
  >
    <Typography variant="h6" gutterBottom sx={{ color: colors.primary, fontWeight: "bold" }}>
      Additional Resources
    </Typography>
    <Divider sx={{ mb: 2 }} />
    {links.map((link, index) => (
      <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
        <ExternalLink size={18} style={{ marginRight: 8, color: colors.accent }} />
        <MuiLink
          href={link.url}
          target="_blank"
          rel="noopener"
          sx={{
            color: colors.accent,
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
);

// ========================================================
// Main Component
// ========================================================
const SubjectLessonPage = () => {
  const { subjectId, lessonId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const subject = location.state?.subject || null;
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loadingLesson, setLoadingLesson] = useState(true);

  useEffect(() => {
    if (subject && !lessonId && subject.lessons?.length > 0) {
      navigate(`/subjects/${subjectId}/lessons/${subject.lessons[0]._id}`, {
        replace: true,
        state: { subject },
      });
    }
  }, [subject, subjectId, lessonId, navigate]);

  useEffect(() => {
    if (lessonId) {
      setLoadingLesson(true);
      lessonService
        .getLessonById(lessonId)
        .then((response) => {
          setCurrentLesson(response);
          setLoadingLesson(false);
        })
        .catch(() => setLoadingLesson(false));
    }
  }, [lessonId]);

  const renderContentBlock = (block, index) => {
    switch (block.type) {
      case "heading":
        return <HeadingBlock key={index} text={block.text} level={block.level} />;
      case "paragraph":
        return <ParagraphBlock key={index} text={block.text} />;
      case "image":
        return <ImageBlock key={index} src={block.src} caption={block.caption} />;
      case "code":
        return <CodeBlock key={index} code={block.code} language={block.language} />;
      case "linkList":
        return <LinkListBlock key={index} links={block.links} />;
      default:
        return null;
    }
  };

  if (!subject) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: colors.lightBg,
        }}
      >
        <Typography variant="h6" color="error">
          Subject not found. Please navigate from the homepage.
        </Typography>
      </Box>
    );
  }

  const drawerContent = (
    <Box sx={{ p: 2, height: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, pl: 2 }}>
        <Layers size={24} color={colors.primary} />
        <Typography variant="h6" fontWeight="bold" color={colors.primary}>
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
              navigate(`/subjects/${subjectId}/lessons/${lesson._id}`, { state: { subject } })
            }
            sx={{
              borderRadius: 2,
              mb: 1,
              transition: "0.3s",
              "&.Mui-selected": {
                backgroundColor: colors.accent,
                color: colors.white,
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#0094CC" },
              },
              "&:hover": { backgroundColor: "rgba(13, 71, 161, 0.08)" },
            }}
          >
            <ListItemText primary={lesson.title} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: colors.lightBg }}>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: `1px solid ${colors.border}`,
            backgroundColor: colors.white,
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
          background: "linear-gradient(to bottom right, #FFFFFF, #F0F8FF)",
        }}
      >
        {loadingLesson ? (
          <CircularProgress sx={{ display: "block", margin: "auto", mt: 4, color: colors.accent }} />
        ) : !currentLesson ? (
          <Typography variant="h6" color="error" align="center" mt={4}>
            Lesson not found.
          </Typography>
        ) : (
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: 2,
                  backgroundColor: colors.white,
                  mb: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  borderLeft: `5px solid ${colors.accent}`,
                  boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
                }}
              >
                <BookOpen size={36} color={colors.accent} />
                <Typography variant="h4" fontWeight="bold" color={colors.textDark}>
                  {currentLesson.title}
                </Typography>
              </Paper>

              {/* Render Lesson Content Dynamically */}
              <AnimatePresence>
                {currentLesson.contentBlocks &&
                  currentLesson.contentBlocks.map((block, index) =>
                    renderContentBlock(block, index)
                  )}
              </AnimatePresence>
            </motion.div>
          </Container>
        )}
      </Box>
    </Box>
  );
};

export default SubjectLessonPage;
