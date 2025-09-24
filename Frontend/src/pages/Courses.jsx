import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          "https://felblad-plateform.onrender.com/api/v1/course"
        );
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Cours disponibles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Link
            to={`/courses/${course._id}`}
            key={course._id}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-semibold">{course.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {course.description}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Niveau : {course.level} | Prof : {course.prof?.firstName}{" "}
              {course.prof?.lastName}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Courses;
