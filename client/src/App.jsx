import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import SubjectPage from './pages/SubjectPage.jsx';
import LessonPage from './pages/LessonPage.jsx';


function App() {
  return (
    <Router>
      <CssBaseline />
      <Box sx={{ backgroundColor: '#F8F9FA', minHeight: '100vh' }}>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/subjects/:subjectId" element={<SubjectPage />} />
            <Route path="/lessons/:lessonId" element={<LessonPage />} />
          </Routes>
        </main>
      </Box>
    </Router>
  );
}

export default App;