// src/components/LessonForm.jsx

import React, { useState, useEffect } from "react";
import {
  Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Typography, Paper, Menu, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import {
  Add, Delete, DragIndicator, Title as TitleIcon, TextFields as TextFieldsIcon,
  Image as ImageIcon, Code as CodeIcon, Link as LinkIcon
} from "@mui/icons-material";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates, useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import lessonService from "../services/lessonService";

// Helper to get initial form data
const getInitialFormData = () => ({ title: "", contentBlocks: [] });

// A single block editor component made compatible with dnd-kit
const SortableBlockEditor = ({
  block,
  index,
  onRemove,
  onChange,
  onAddLink,
  onRemoveLink,
  onLinkChange
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderInputs = () => {
    switch (block.type) {
      case 'heading':
        return (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              fullWidth
              variant="standard"
              placeholder="Heading"
              value={block.text}
              onChange={(e) => onChange(index, 'text', e.target.value)}
              InputProps={{ style: { fontSize: '1.75rem', fontWeight: 600 } }}
            />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Level</InputLabel>
              <Select
                value={block.level || 2}
                label="Level"
                onChange={(e) => onChange(index, 'level', e.target.value)}
              >
                <MenuItem value={2}>H2</MenuItem>
                <MenuItem value={3}>H3</MenuItem>
                <MenuItem value={4}>H4</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );
      case 'paragraph':
        return <TextField fullWidth multiline variant="standard" placeholder="Type your paragraph here..." value={block.text} onChange={(e) => onChange(index, 'text', e.target.value)} InputProps={{ style: { fontSize: '1.1rem', lineHeight: 1.6 } }} />;
      case 'image':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <TextField label="Image URL" value={block.src || ''} onChange={(e) => onChange(index, 'src', e.target.value)} fullWidth />
            <TextField label="Image Caption" value={block.caption || ''} onChange={(e) => onChange(index, 'caption', e.target.value)} fullWidth />
            {block.src && <img src={block.src} alt={block.caption || 'Preview'} style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '8px' }} />}
          </Box>
        );
      case 'code':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Language (e.g., javascript, python)"
              value={block.language || 'javascript'}
              onChange={(e) => onChange(index, 'language', e.target.value)}
              fullWidth
            />
            <TextField
              fullWidth
              multiline
              rows={8}
              label="Code Snippet"
              value={block.code || ''}
              onChange={(e) => onChange(index, 'code', e.target.value)}
              InputProps={{ style: { fontFamily: 'monospace', backgroundColor: '#f5f5f5', borderRadius: '4px' } }}
            />
          </Box>
        );
      case 'linkList':
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography variant="subtitle1" fontWeight="bold">Resource Links</Typography>
                {(block.links || []).map((link, linkIndex) => (
                    <Box key={linkIndex} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextField label="Link Title" value={link.title} onChange={(e) => onLinkChange(index, linkIndex, 'title', e.target.value)} sx={{ flex: 1 }} />
                        <TextField label="Link URL" value={link.url} onChange={(e) => onLinkChange(index, linkIndex, 'url', e.target.value)} sx={{ flex: 1 }} />
                        <IconButton onClick={() => onRemoveLink(index, linkIndex)}><Delete /></IconButton>
                    </Box>
                ))}
                <Button startIcon={<Add />} onClick={() => onAddLink(index)} sx={{ alignSelf: 'flex-start' }}>
                    Add Link
                </Button>
            </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Paper ref={setNodeRef} style={style} sx={{ p: 2, display: 'flex', alignItems: 'flex-start', gap: 1, touchAction: 'none' }}>
      <Box {...attributes} {...listeners} sx={{ cursor: 'grab' }}>
        <DragIndicator />
      </Box>
      <Box flexGrow={1}>{renderInputs()}</Box>
      <IconButton onClick={() => onRemove(index)} size="small"><Delete /></IconButton>
    </Paper>
  );
};

// The main form component
const LessonForm = ({ subjectId, lesson, onClose, onSaved }) => {
  const [formData, setFormData] = useState(getInitialFormData());
  const [menuAnchor, setMenuAnchor] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {

    if (lesson) {
      // ** BUG FIX **: Correctly map existing blocks to have unique IDs
      const blocksWithIds = (lesson.contentBlocks || []).map((block, index) => ({
        ...block,
        id: `block-${index}-${Date.now()}` // Ensure a unique ID is created every time
      }));
      setFormData({ title: lesson.title || "", contentBlocks: blocksWithIds });
    } else {
      setFormData(getInitialFormData());
    }
  }, [lesson, onClose]);

  const handleTitleChange = (e) => setFormData({ ...formData, title: e.target.value });

  const addBlock = (type) => {
    let newBlock;
    const id = `block-new-${Date.now()}`;
    switch (type) {
      case 'heading': newBlock = { id, type, text: '', level: 2 }; break;
      case 'paragraph': newBlock = { id, type, text: '' }; break;
      case 'image': newBlock = { id, type, src: '', caption: '' }; break;
      case 'code': newBlock = { id, type, code: '', language: 'javascript' }; break;
      case 'linkList': newBlock = { id, type, links: [] }; break; // Add linkList to the addBlock function
      default: return;
    }
    setFormData({ ...formData, contentBlocks: [...formData.contentBlocks, newBlock] });
    handleMenuClose();
  };

  const removeBlock = (index) => {
    const newBlocks = formData.contentBlocks.filter((_, i) => i !== index);
    setFormData({ ...formData, contentBlocks: newBlocks });
  };

  const handleBlockChange = (index, field, value) => {
    const newBlocks = [...formData.contentBlocks];
    newBlocks[index][field] = value;
    setFormData({ ...formData, contentBlocks: newBlocks });
  };

  // --- Handlers for the LinkList block ---
  const addLinkToBlock = (blockIndex) => {
    const newBlocks = [...formData.contentBlocks];
    if (!newBlocks[blockIndex].links) {
        newBlocks[blockIndex].links = [];
    }
    newBlocks[blockIndex].links.push({ title: '', url: '' });
    setFormData({ ...formData, contentBlocks: newBlocks });
  };

  const removeLinkFromBlock = (blockIndex, linkIndex) => {
    const newBlocks = [...formData.contentBlocks];
    newBlocks[blockIndex].links = newBlocks[blockIndex].links.filter((_, i) => i !== linkIndex);
    setFormData({ ...formData, contentBlocks: newBlocks });
  };

  const handleLinkChangeInBlock = (blockIndex, linkIndex, field, value) => {
    const newBlocks = [...formData.contentBlocks];
    newBlocks[blockIndex].links[linkIndex][field] = value;
    setFormData({ ...formData, contentBlocks: newBlocks });
  };


  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = formData.contentBlocks.findIndex(block => block.id === active.id);
      const newIndex = formData.contentBlocks.findIndex(block => block.id === over.id);
      
      const newBlocks = Array.from(formData.contentBlocks);
      const [movedBlock] = newBlocks.splice(oldIndex, 1);
      newBlocks.splice(newIndex, 0, movedBlock);

      setFormData({ ...formData, contentBlocks: newBlocks });
    }
  };
  
  const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const handleSubmit = async () => {
    try {
        const payload = {
            ...formData,
            contentBlocks: formData.contentBlocks.map(({ id, ...rest }) => rest)
        };
      if (lesson) {
        await lessonService.updateLesson(lesson._id, payload);
      } else {
        await lessonService.createLesson(subjectId, payload);
      }
      onSaved();
    } catch (error) {
      console.error("Failed to save lesson:", error);
    }
  };

  return (
    <Dialog open fullScreen onClose={onClose}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {lesson ? "Edit Lesson" : "Create New Lesson"}
        <Button onClick={onClose}>Close</Button>
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: '#f4f6f8', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 2, mb: 2 }}>
          <TextField fullWidth variant="standard" placeholder="Lesson Title" value={formData.title} onChange={handleTitleChange} InputProps={{ style: { fontSize: '2.5rem', fontWeight: 'bold' } }} />
        </Box>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={formData.contentBlocks} strategy={verticalListSortingStrategy}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {formData.contentBlocks.map((block, index) => (
                <SortableBlockEditor
                  key={block.id}
                  block={block}
                  index={index}
                  onRemove={removeBlock}
                  onChange={handleBlockChange}
                  onAddLink={addLinkToBlock}
                  onRemoveLink={removeLinkFromBlock}
                  onLinkChange={handleLinkChangeInBlock}
                />
              ))}
            </Box>
          </SortableContext>
        </DndContext>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <Button variant="outlined" onClick={handleMenuOpen}><Add /> Add Content Block</Button>
        </Box>
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
          <MenuItem onClick={() => addBlock('heading')}><TitleIcon sx={{ mr: 1 }} /> Heading</MenuItem>
          <MenuItem onClick={() => addBlock('paragraph')}><TextFieldsIcon sx={{ mr: 1 }} /> Paragraph</MenuItem>
          <MenuItem onClick={() => addBlock('image')}><ImageIcon sx={{ mr: 1 }} /> Image</MenuItem>
          <MenuItem onClick={() => addBlock('code')}><CodeIcon sx={{ mr: 1 }} /> Code</MenuItem>
          <MenuItem onClick={() => addBlock('linkList')}><LinkIcon sx={{ mr: 1 }} /> Link List</MenuItem>
        </Menu>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0', backgroundColor: 'white' }}>
        <Button variant="contained" onClick={handleSubmit}>
          {lesson ? "Update Lesson" : "Save Lesson"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LessonForm;