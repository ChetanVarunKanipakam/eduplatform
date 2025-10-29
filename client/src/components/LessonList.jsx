// src/components/LessonList.jsx
import React, { useEffect, useState } from "react";
import lessonService from "../services/lessonService";
import { Button, Card, CardContent, Typography, Box } from "@mui/material";
import LessonForm from "./LessonForm";
import { useParams } from "react-router-dom";
const LessonList = () => {
    const { subjectId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    if (subjectId) {
       lessonService.getLessonsBySubject(subjectId)
        .then((res) =>{ console.log(res);setLessons(res.data)})
        .catch((err) => console.error(err));
    }
  }, [subjectId]);
  console.log(lessons)
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
    //   await deleteLesson(id);
      setLessons((prev) => prev.filter((l) => l._id !== id));
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Lessons
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setSelectedLesson(null);
          setOpenForm(true);
        }}
      >
        Add Lesson
      </Button>

      <Box sx={{ mt: 2 }}>
        {lessons.map((lesson) => (
          <Card key={lesson._id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{lesson.title}</Typography>
              <Typography variant="body2">{lesson.description}</Typography>

              <Box sx={{ mt: 1 }}>
                <Button
                  size="small"
                  onClick={() => {
                    setSelectedLesson(lesson);
                    setOpenForm(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDelete(lesson._id)}
                >
                  Delete
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {openForm && (
        <LessonForm
          subjectId={subjectId}
          lesson={selectedLesson}
          onClose={() => setOpenForm(false)}
          onSaved={() =>
            lessonService.getLessonsBySubject(subjectId).then((res) => setLessons(res.data))
          }
        />
      )}
    </Box>
  );
};

export default LessonList;
