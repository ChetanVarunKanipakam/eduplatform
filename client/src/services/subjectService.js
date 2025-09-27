import axios from 'axios';

const API_URL = '/api/subjects';

const getAllSubjects = () => {
  return axios.get(API_URL);
};

const getSubjectById = (subjectId) => {
  return axios.get(`${API_URL}/${subjectId}`);
};

const subjectService = {
  getAllSubjects,
  getSubjectById,
};

export default subjectService;