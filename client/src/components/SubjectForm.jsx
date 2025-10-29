import { useState, useEffect } from "react";
import subjectService from "../services/subjectService";
import { useNavigate } from "react-router-dom";


export default function SubjectForm({ existingSubject, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    if (existingSubject) {
      setFormData({
        title: existingSubject.title,
        description: existingSubject.description,
        image: null,
      });
    }
  }, [existingSubject]);
  
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (formData.image) data.append("image", formData.image);

    try {
      if (existingSubject) {
        await subjectService.updateSubject(existingSubject._id, data);
        alert("Subject updated!");
      } else {
        await subjectService.createSubject(data);
        alert("Subject created!");
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Error submitting form");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow"
    >
      <h2 className="text-xl font-bold mb-4">
        {existingSubject ? "Update Subject" : "Add Subject"}
      </h2>
       
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        className="border p-2 w-full mb-3 rounded"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="border p-2 w-full mb-3 rounded"
        required
      ></textarea>

      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleChange}
        className="border p-2 w-full mb-3 rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {existingSubject ? "Update" : "Create"}
      </button>
    </form>
  );
}
