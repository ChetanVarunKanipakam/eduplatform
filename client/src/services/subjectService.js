import axios from 'axios';

const API_URL = '/api/subjects';

const getAllSubjects = async () => {
  const res=await axios.get(API_URL);
  return res.data
};

const getSubjectById = (subjectId) => {
  return axios.get(`${API_URL}/${subjectId}`);
};

export const createSubject = async (formData) => {
  const res = await axios.post(API_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateSubject = async (id, formData) => {
  const res = await axios.put(`${API_URL}/${id}`, formData, {
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



