import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import SubjectPage from './pages/SubjectPage.jsx';
import LessonPage from './pages/LessonPage.jsx';
import SubjectLessonPage from './pages/SubjectLessonPage.jsx';
import SubjectList from './components/SubjectList.jsx';
import LessonList from './components/LessonList.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Dashboard from './pages/DashboardPage.jsx';
import {ThemeProvider }from '@mui/material/styles';
// Import new pages
import DiscussionsPage from './pages/DiscussionsPage.jsx';
import DiscussionDetailsPage from './pages/DiscussionDetailsPage.jsx';
import NewDiscussionPage from './pages/NewDiscussionPage.jsx';
import theme from './theme.js';
import Layout from './components/Layout.jsx';
import MyDiscussionsPage from './pages/MyDiscussionPage.jsx';
function App() {
  return (

     <AuthProvider>
    <Router>
      <CssBaseline /> 
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/subjects/:subjectId/lessons" element={<SubjectLessonPage />} />
            <Route path="/subjects/:subjectId/lessons/:lessonId" element={<SubjectLessonPage />} />
            <Route path="/subjects/:subjectId" element={<SubjectPage />} />
            <Route path="/lessons/:lessonId" element={<LessonPage />} />
            <Route path="/subjectlist" element={<SubjectList/>} />
            <Route path="/subjects/:subjectId/lessonslist" element={<LessonList/>} />
            <Route path="/alldiscussions" element={<DiscussionsPage />} />
            {/* Add new discussion routes here */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/discussions" element={<DiscussionsPage />} />
              <Route path="/my-discussions" element={<MyDiscussionsPage />} />
              <Route path="/discussions/:id" element={<DiscussionDetailsPage />} />
              <Route path="/new-discussion" element={<NewDiscussionPage />} />
           </Route>
          </Routes>
        </main>
    </Router>
    </AuthProvider>
  );
}

export default App;