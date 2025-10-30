// src/pages/AdminLessonsPage.jsx (Previously LessonList.jsx)
import React, { useEffect, useState, useCallback } from "react";
import lessonService from "../services/lessonService";
import { Button, Card, CardContent, Typography, Box, CircularProgress, Container, Paper } from "@mui/material";
import LessonForm from "../components/LessonForm"; // Your excellent lesson builder
import { useParams, Link } from "react-router-dom";
import { Add, Edit, Delete } from "@mui/icons-material";

const AdminLessonsPage = () => {
  const { subjectId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  const fetchLessons = useCallback(() => {
    setLoading(true);
    lessonService.getLessonsBySubject(subjectId)
      .then((response) => setLessons(response.data))
      .catch((err) => console.error("Failed to fetch lessons:", err))
      .finally(() => setLoading(false));
  }, [subjectId]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      try {
        await lessonService.deleteLesson(id);
        fetchLessons();
      } catch (error) {
        console.error("Failed to delete lesson:", error);
      }
    }
  };

  const handleOpenForm = (lesson = null) => {
    setSelectedLesson(lesson);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedLesson(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, mb: 4, borderRadius: '16px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                Manage Lessons
                </Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenForm(null)}>
                Add New Lesson
                </Button>
            </Box>
            <Button component={Link} to="/admin/subjects" sx={{ mt: 2 }}>
                &larr; Back to Subjects
            </Button>
        </Paper>

      {loading ? <CircularProgress /> : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {lessons.map((lesson) => (
            <Card key={lesson._id}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{lesson.title}</Typography>
                <Box>
                  <Button startIcon={<Edit />} onClick={() => handleOpenForm(lesson)}>Edit</Button>
                  <Button startIcon={<Delete />} color="error" onClick={() => handleDelete(lesson._id)}>Delete</Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {openForm && (
        <LessonForm
          subjectId={subjectId}
          lesson={selectedLesson}
          onClose={handleCloseForm}
          onSaved={() => {
            handleCloseForm();
            fetchLessons();
          }}
        />
      )}
    </Container>
  );
};

export default AdminLessonsPage;