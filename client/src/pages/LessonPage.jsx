import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  CircularProgress,
  Link as MuiLink,
  Box,
  Paper,
  Divider,
} from '@mui/material';
import lessonService from '../services/lessonService';
import CodeEditor from '../components/CodeEditor';
import { BookOpen, ExternalLink } from 'lucide-react';

const LessonPage = () => {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const { lessonId } = useParams();

  useEffect(() => {
    lessonService
      .getLessonById(lessonId)
      .then((response) => {
        setLesson(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching lesson:', error);
        setLoading(false);
      });
  }, [lessonId]);

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  }

  if (!lesson) {
    return (
      <Typography variant="h6" sx={{ textAlign: 'center', mt: 4, color: 'error.main' }}>
        Lesson not found.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #f9fafb, #eef2ff)',
        py: 6,
      }}
    >
      <Container maxWidth="md">
        {/* Lesson Header */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(to right, #2563eb, #1e3a8a)',
            color: 'white',
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <BookOpen size={36} />
          <Typography variant="h4" fontWeight="bold">
            {lesson.title}
          </Typography>
        </Paper>

        {/* Lesson Content */}
        <Paper
          elevation={2}
          sx={{
            p: 4,
            borderRadius: 3,
            mb: 4,
            backgroundColor: 'white',
          }}
        >
          <Typography
            variant="body1"
            paragraph
            sx={{ color: '#374151', lineHeight: 1.7, fontSize: '1.1rem' }}
          >
            {lesson.content}
          </Typography>
        </Paper>

        {/* Code Editor */}
        {lesson.hasCodeEditor && (
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              mb: 4,
              background: 'linear-gradient(to right, #1e293b, #0f172a)',
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}
            >
              Try It Yourself
            </Typography>
            <CodeEditor codeSnippet={lesson.codeSnippet} />
          </Paper>
        )}

        {/* Additional Resources */}
        {lesson.links && lesson.links.length > 0 && (
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: '#f8fafc',
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: '#1E293B', fontWeight: 'bold', mb: 2 }}
            >
              Additional Resources
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {lesson.links.map((link, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1.5,
                  '&:last-child': { mb: 0 },
                }}
              >
                <ExternalLink size={18} style={{ marginRight: 8, color: '#2563eb' }} />
                <MuiLink
                  href={link.url}
                  target="_blank"
                  rel="noopener"
                  sx={{
                    color: '#2563eb',
                    fontWeight: 500,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {link.title}
                </MuiLink>
              </Box>
            ))}
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default LessonPage;
