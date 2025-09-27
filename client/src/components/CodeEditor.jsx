import React from 'react';
import { Paper, Typography } from '@mui/material';

const CodeEditor = ({ codeSnippet }) => {
  return (
    <Paper elevation={2} sx={{ p: 2, mt: 2, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6" gutterBottom>
        Code Editor
      </Typography>
      <pre>
        <code>{codeSnippet}</code>
      </pre>
    </Paper>
  );
};

export default CodeEditor;