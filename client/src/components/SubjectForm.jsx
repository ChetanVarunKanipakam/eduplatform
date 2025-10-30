// src/components/SubjectForm.jsx
import { useState, useEffect, useRef } from "react";
import subjectService from "../services/subjectService";
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Box, CircularProgress, Typography
} from "@mui/material";

const SubjectForm = ({ open, onClose, existingSubject, onSuccess }) => {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (existingSubject) {
      setFormData({
        title: existingSubject.title,
        description: existingSubject.description,
      });
      if (existingSubject.imageUrl) {
        setImagePreview(`http://localhost:3000${existingSubject.imageUrl}`);
      }
    } else {
      // Reset form when adding a new subject
      setFormData({ title: "", description: "" });
      setImageFile(null);
      setImagePreview("");
    }
  }, [existingSubject, open]); // Depend on 'open' to reset the form

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      if (existingSubject) {
        await subjectService.updateSubject(existingSubject._id, data);
      } else {
        await subjectService.createSubject(data);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Error: Could not save subject.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{existingSubject ? "Update Subject" : "Add New Subject"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
            <TextField
              name="title"
              label="Subject Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <TextField
              name="description"
              label="Subject Description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              required
            />
            <Box sx={{ border: '1px dashed grey', p: 2, borderRadius: '8px', textAlign: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => fileInputRef.current.click()}
              >
                Upload Image
              </Button>
              <input
                type="file"
                name="image"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              {imagePreview && (
                <Box mt={2}>
                  <Typography variant="subtitle2">Image Preview:</Typography>
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', marginTop: '8px' }} />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: '16px 24px' }}>
          <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : (existingSubject ? "Update" : "Create")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default SubjectForm;