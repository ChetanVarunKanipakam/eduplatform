import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Box,
} from '@mui/material';
import { BookOpen, Code2, Layers } from 'lucide-react'; // icons
import { Link } from 'react-router-dom';

const iconMap = {
  javascript: <Code2 size={32} />,
  react: <Layers size={32} />,
  node: <BookOpen size={32} />,
};

const SubjectCard = ({ subject }) => {
  const getIcon = () => {
    const title = subject.title.toLowerCase();
    if (title.includes('javascript')) return iconMap.javascript;
    if (title.includes('react')) return iconMap.react;
    if (title.includes('node')) return iconMap.node;
    return <BookOpen size={32} />;
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 4,
        backgroundColor: '#F9FAFB', // 🔹 soft gray background instead of white
        height: 340, // 🔹 fixed height for uniformity
        width: '100%', // 🔹 take full available width
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 8,
        },
      }}
    >
      {/* Header with Icon */}
      <Box
        sx={{
          height: 100,
          background: 'linear-gradient(to right, #2563eb, #1e40af)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          color: 'white',
        }}
      >
        {getIcon()}
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{ fontWeight: 'bold', color: '#1E293B' }}
        >
          {subject.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '60px', // ensures uniform description space
          }}
        >
          {subject.description}
        </Typography>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button
          variant="contained"
          component={Link}
          to={`/subjects/${subject._id}`}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'bold',
            px: 3,
            backgroundColor: '#2563eb',
            '&:hover': { backgroundColor: '#1e40af' },
          }}
        >
          View Lessons
        </Button>
      </CardActions>
    </Card>
  );
};

export default SubjectCard;
