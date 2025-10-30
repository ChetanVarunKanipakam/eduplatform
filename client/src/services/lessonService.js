import axios from 'axios';

const API_URL = '/api/lessons';

export const getLessonById = async (lessonId) => {
  console.log(lessonId)
  const res= await axios.get(`http://localhost:3000${API_URL}/${lessonId}`);
  console.log(res)
  return res.data;
};

export const createLesson = async (subjectId, formData) => {
  console.log(formData)
  const res = await axios.post(
    `http://localhost:3000/api/subjects/${subjectId}/lessons`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
};
export const getLessonsBySubject = async (subjectId) =>
  axios.get(`http://localhost:3000${API_URL}/subjects/${subjectId}/lessons`);

export const updateLesson = async (lessonId, formData) => {
  console.log(formData)
  const res = await axios.put(`http://localhost:3000${API_URL}/${lessonId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
const lessonService = {
  getLessonById,
  getLessonsBySubject,
  createLesson,
  updateLesson
};

export default lessonService;