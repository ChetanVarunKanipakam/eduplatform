// src/pages/AdminSubjectsPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import subjectService from "../services/subjectService";
import SubjectForm from "../components/SubjectForm"; // The new modal form
import { useNavigate } from "react-router-dom";
import {
  Container, Grid, Typography, CircularProgress, Box, Card,
  CardContent, CardMedia, Button, CardActions, Paper, IconButton
} from '@mui/material';
import { Add, Edit, Delete } from "@mui/icons-material";

// A single card component for a subject
const AdminSubjectCard = ({ subject, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const imageUrl = subject.imageUrl ? `http://localhost:3000${subject.imageUrl}` : "https://via.placeholder.com/400x200";

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="160"
        image={imageUrl}
        alt={subject.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">
          {subject.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subject.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button
          size="small"
          variant="contained"
          onClick={() => navigate(`/subjects/${subject._id}/lessonslist`)}
        >
          Manage Lessons
        </Button>
        <Box>
          <IconButton size="small" onClick={() => onEdit(subject)}><Edit /></IconButton>
          <IconButton size="small" onClick={() => onDelete(subject._id)}><Delete /></IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};


const AdminSubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSubject, setEditingSubject] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await subjectService.getAllSubjects();
      setSubjects(response || []);
    } catch (err) {
      console.error("Failed to load subjects:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const handleOpenForm = (subject = null) => {
    setEditingSubject(subject);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSubject(null);
  };

  const handleSuccess = () => {
    handleCloseForm();
    loadSubjects();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? This will delete the subject and all its lessons.")) {
      try {
        await subjectService.deleteSubject(id);
        loadSubjects();
      } catch (err) {
        console.error("Failed to delete subject:", err);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 4, borderRadius: '16px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Manage Subjects
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenForm(null)}
          >
            Add Subject
          </Button>
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {subjects.map((subject) => (
            <Grid item key={subject._id} xs={12} sm={6} md={4}>
              <AdminSubjectCard
                subject={subject}
                onEdit={handleOpenForm}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {isFormOpen && (
        <SubjectForm
          open={isFormOpen}
          onClose={handleCloseForm}
          existingSubject={editingSubject}
          onSuccess={handleSuccess}
        />
      )}
    </Container>
  );
}

export default AdminSubjectsPage;