// src/components/LessonList.jsx
import React, { useEffect, useState, useCallback } from "react";
import lessonService from "../services/lessonService";
import { Button, Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";
import LessonForm from "./LessonForm";
import { useParams } from "react-router-dom";

const LessonList = () => {
  const { subjectId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  console.log(subjectId)
  // Use useCallback to memoize the fetch function
  const fetchLessons = useCallback(() => {
    setLoading(true);
    lessonService.getLessonsBySubject(subjectId)
      .then((response) => {
        // Correctly access the data from the response
        console.log(response)
        setLessons(response);
      })
      .catch((err) => console.error("Failed to fetch lessons:", err))
      .finally(() => setLoading(false));
  }, [subjectId]);

  useEffect(() => {
    if (subjectId) {
      fetchLessons();
    }
  }, [subjectId, fetchLessons]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      try {
        await lessonService.deleteLesson(id);
        // Refetch lessons to ensure consistency
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
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">
          Lessons
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenForm(null)}
        >
          Add New Lesson
        </Button>
      </Box>

      {loading ? <CircularProgress /> : (
        <Box sx={{ mt: 2 }}>
          {lessons.map((lesson) => (
            <Card key={lesson._id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{lesson.title}</Typography>
                {/* description is no longer part of the schema */}
                <Box sx={{ mt: 1 }}>
                  <Button size="small" onClick={() => handleOpenForm(lesson)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDelete(lesson._id)}>
                    Delete
                  </Button>
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
            fetchLessons(); // Refetch after saving
          }}
        />
      )}
    </Box>
  );
};

export default LessonList;