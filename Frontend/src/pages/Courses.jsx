import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = "https://felblad-plateform.onrender.com/api/v1/course";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("primaire");

  // 🔹 Récupérer tous les cours
  const fetchCourses = async () => {
    try {
      const res = await axios.get(API_URL);
      setCourses(res.data);
    } catch (err) {
      console.error("Erreur GET ALL :", err.response?.data || err);
    }
  };

  // 🔹 Créer un cours
  const createCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        API_URL,
        { title, description, level },
        { withCredentials: true } // cookie avec token
      );
      setTitle("");
      setDescription("");
      setLevel("primaire");
      fetchCourses();
    } catch (err) {
      console.error("Erreur POST :", err.response?.data || err);
      alert(
        "Erreur création cours (vérifie si tu es connecté comme professeur)"
      );
    }
  };

  // 🔹 Supprimer un cours
  const deleteCourse = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
      fetchCourses();
    } catch (err) {
      console.error("Erreur DELETE :", err.response?.data || err);
      alert("Erreur suppression (tu dois être admin ou professeur)");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Cours disponibles</h1>

      {/* FORMULAIRE AJOUT */}
      <form onSubmit={createCourse} className="p-4 border rounded-lg space-y-3">
        <h2 className="text-xl font-semibold">Créer un cours</h2>
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full border p-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full border p-2 rounded"
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="block w-full border p-2 rounded"
        >
          <option value="primaire">Primaire</option>
          <option value="college">Collège</option>
          <option value="lycee">Lycée</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Ajouter
        </button>
      </form>

      {/* LISTE DES COURS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition"
          >
            <Link to={`/courses/${course._id}`}>
              <h2 className="text-2xl font-semibold">{course.title}</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {course.description}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Niveau : {course.level} | Prof : {course.prof?.firstName}{" "}
                {course.prof?.lastName}
              </p>
            </Link>
            <button
              onClick={() => deleteCourse(course._id)}
              className="mt-3 text-red-500 underline"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
