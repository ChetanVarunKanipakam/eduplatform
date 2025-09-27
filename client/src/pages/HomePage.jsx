import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import Slider from 'react-slick';
import { BookOpen, Layers, Code2 } from 'lucide-react'; // background icons
import SubjectCard from '../components/SubjectCard.jsx';
import subjectService from '../services/subjectService';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomePage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    subjectService
      .getAllSubjects()
      .then((response) => {
        setSubjects(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching subjects:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  }

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

 // helper for watermark background icon
// helper for watermark background icon
const renderHeroSlide = (bg, Icon, title, subtitle) => (
  <Box
    sx={{
      height: '100vh',
      background: bg,
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      px: 2,
    }}
  >
    {/* Background watermark icon - perfectly centered */}
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 0.08,
        zIndex: 0,
      }}
    >
      <Icon size={400} />
    </Box>

    {/* Text container (vertically centered) */}
    <Box
      sx={{
       position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
        maxWidth: '700px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <Typography variant="h2" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h3">{subtitle}</Typography>
    </Box>
  </Box>
);



  return (
    <Box sx={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      {/* Hero Carousel */}
      <Box sx={{ mb: 6 }}>
        <Slider {...settings}>
          {renderHeroSlide(
            'linear-gradient(to right, #2563eb, #1e3a8a)',
            Code2,
            'Unlock Your Potential',
            'Learn from industry experts and take your career to the next level with our curated courses.'
          )}
          {renderHeroSlide(
            'linear-gradient(to right, #10b981, #065f46)',
            Layers,
            'Explore Endless Knowledge',
            'Join thousands of learners and dive into subjects that inspire you.'
          )}
          {renderHeroSlide(
            'linear-gradient(to right, #f59e0b, #b45309)',
            BookOpen,
            'Learn Anytime, Anywhere',
            'Access your courses on any device and keep growing at your pace.'
          )}
        </Slider>
      </Box>

      {/* Subjects Section */}
      <Box
        sx={{
          py: 8,
          px: 2,
          background: 'linear-gradient(to right, #f9fafb, #eef2ff)',
        }}
      >
        <Container>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{ color: '#1E293B', fontWeight: 'bold', mb: 6 }}
          >
            Explore Our Subjects
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {subjects.map((subject) => (
              <Grid item key={subject._id} xs={12} sm={6} md={4}>
                <SubjectCard subject={subject} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          mt: 8,
          py: 4,
          textAlign: 'center',
          backgroundColor: '#1E293B',
          color: 'white',
        }}
      >
        <Typography variant="body1">
          © {new Date().getFullYear()} EduPlatform. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;
