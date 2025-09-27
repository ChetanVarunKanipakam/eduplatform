import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  CircularProgress,
  Paper,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import subjectService from '../services/subjectService';
import { Layers } from 'lucide-react';

const SubjectPage = () => {
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { subjectId } = useParams();

  useEffect(() => {
    subjectService
      .getSubjectById(subjectId)
      .then((response) => {
        setSubject(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching subject:', error);
        setLoading(false);
      });
  }, [subjectId]);

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  }

  if (!subject) {
    return (
      <Typography variant="h6" sx={{ textAlign: 'center', mt: 4, color: 'error.main' }}>
        Subject not found.
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
        {/* Subject Header */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(to right, #10b981, #065f46)',
            color: 'white',
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Layers size={36} />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {subject.title}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {subject.description}
            </Typography>
          </Box>
        </Paper>

        {/* Lessons List */}
        <Paper
          elevation={2}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <List>
            {subject.lessons.map((lesson, index) => (
              <React.Fragment key={lesson._id}>
                <ListItemButton
                  component={Link}
                  to={`/lessons/${lesson._id}`}
                  sx={{
                    py: 2,
                    px: 3,
                    '&:hover': {
                      backgroundColor: '#f1f5f9',
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#1E293B' }}>
                        {lesson.title}
                      </Typography>
                    }
                  />
                </ListItemButton>
                {index < subject.lessons.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Container>
    </Box>
  );
};

export default SubjectPage;
