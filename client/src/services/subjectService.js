import axios from 'axios';

const API_URL = '/api/subjects';

const getAllSubjects = async () => {
  const res=await axios.get(`http://localhost:3000${API_URL}`);

  return res.data
};

const getSubjectById = (subjectId) => {
  return axios.get(`http://localhost:3000${API_URL}/${subjectId}`);
};

export const createSubject = async (formData) => {
  const res = await axios.post(`http://localhost:3000${API_URL}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateSubject = async (id, formData) => {
  const res = await axios.put(`http://localhost:3000${API_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
const subjectService = {
  getAllSubjects,
  getSubjectById,
  updateSubject,
  createSubject,
};

export default subjectService;



