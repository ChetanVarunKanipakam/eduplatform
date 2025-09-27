import axios from 'axios';

const API_URL = '/api/lessons';

const getLessonById = (lessonId) => {
  return axios.get(`${API_URL}/${lessonId}`);
};

const lessonService = {
  getLessonById,
};

export default lessonService;