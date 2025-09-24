import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CourseView = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `https://felblad-plateform.onrender.com/api/v1/course/${id}`
        );
        setCourse(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourse();
  }, [id]);

  if (!course) return <p className="p-6">Chargement...</p>;

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
      <p className="mb-4">{course.description}</p>
      <p className="text-gray-500">
        Niveau : {course.level} | Prof : {course.prof?.firstName}{" "}
        {course.prof?.lastName}
      </p>

      {course.pdfUrl && (
        <a
          href={course.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-6 p-3 bg-blue-500 text-white rounded-lg w-fit"
        >
          Télécharger PDF
        </a>
      )}
      {course.videoUrl && (
        <div className="mt-6">
          <iframe
            src={course.videoUrl}
            title="Course Video"
            className="w-full h-96 rounded-lg"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default CourseView;
