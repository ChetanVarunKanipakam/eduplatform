import { useEffect, useState } from "react";
import subjectService from "../services/subjectService";
import SubjectForm from "./SubjectForm";
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
} from '@mui/material';
import { useNavigate } from "react-router-dom";


export default function SubjectList() {
  const [subjects, setSubjects] = useState([]);
  const [editSubject, setEditSubject] = useState(null);

  const loadSubjects = async () => {
    const data = await subjectService.getAllSubjects();
    console.log(data)
    setSubjects(data);
  };

  useEffect(() => {
    loadSubjects();
  }, []);
  const navigate = useNavigate();
  return (
    <div className="p-6">
      <SubjectForm
        existingSubject={editSubject}
        onSuccess={() => {
          setEditSubject(null);
          loadSubjects();
        }}
      />

      <h2 className="text-2xl font-bold mt-6 mb-4">Subjects</h2>
      <div className="grid grid-cols-3 gap-4">
         
        {subjects.map((s) => (
            
          <div key={s._id} className="border rounded-xl p-4 shadow bg-white">
            <Card onClick={() => navigate(`/subjects/${s._id}/lessonslist`)}>
            {s.image && (
              <img
                src={`http://localhost:3000/${s.image}`}
                alt={s.title}
                className="w-full h-40 object-cover rounded-lg mb-2"
              />
            )}
            <h3 className="font-bold text-lg">{s.title}</h3>
            <p className="text-gray-600 text-sm">{s.description}</p>
            </Card>
            <button
              onClick={() => setEditSubject(s)}
              className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
            >
              Edit
            </button>
          </div>

        ))}

      </div>
    </div>
  );
}
