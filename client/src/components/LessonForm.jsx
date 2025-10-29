import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox,
  FormControlLabel,
  IconButton,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import lessonService from "../services/lessonService";

const LessonForm = ({ subjectId, lesson, onClose, onSaved }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    hasCodeEditor: false,
    codeSnippet: "",
    links: [],
  });

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title || "",
        content: lesson.content || "",
        imageUrl: lesson.imageUrl || "",
        hasCodeEditor: lesson.hasCodeEditor || false,
        codeSnippet: lesson.codeSnippet || "",
        links: lesson.links || [],
      });
    }
  }, [lesson]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleLinkChange = (index, e) => {
    const newLinks = formData.links.map((link, i) => {
      if (index === i) {
        return { ...link, [e.target.name]: e.target.value };
      }
      return link;
    });
    setFormData({ ...formData, links: newLinks });
  };

  const addLink = () => {
    setFormData({
      ...formData,
      links: [...formData.links, { title: "", url: "" }],
    });
  };

  const removeLink = (index) => {
    const newLinks = formData.links.filter((_, i) => i !== index);
    setFormData({ ...formData, links: newLinks });
  };

  const handleSubmit = async () => {
    if (lesson) {
      await lessonService.updateLesson(lesson._id, formData);
    } else {
      await lessonService.createLesson(subjectId, formData);
    }
    onSaved();
    onClose();
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{lesson ? "Edit Lesson" : "Add Lesson"}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
          />
          <TextField
            label="Image URL"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                name="hasCodeEditor"
                checked={formData.hasCodeEditor}
                onChange={handleChange}
              />
            }
            label="Enable Code Editor"
          />
          {formData.hasCodeEditor && (
            <TextField
              label="Code Snippet"
              name="codeSnippet"
              value={formData.codeSnippet}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
            />
          )}

          <Typography variant="h6">Links</Typography>
          {formData.links.map((link, index) => (
            <Box key={index} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <TextField
                label="Link Title"
                name="title"
                value={link.title}
                onChange={(e) => handleLinkChange(index, e)}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Link URL"
                name="url"
                value={link.url}
                onChange={(e) => handleLinkChange(index, e)}
                sx={{ flex: 1 }}
              />
              <IconButton onClick={() => removeLink(index)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button startIcon={<AddIcon />} onClick={addLink}>
            Add Link
          </Button>

          <Button variant="contained" onClick={handleSubmit}>
            {lesson ? "Update" : "Add"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LessonForm;