import React from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();
  const date = new Date(blog?.createdAt);
  const formattedDate = date.toLocaleDateString("en-GB");

  return (
    <div className="bg-white dark:bg-gray-800 dark:border-gray-600 p-5 rounded-2xl shadow-lg border hover:scale-105 transition-all">
      {/* Image avec fallback */}
      <img
        src={blog?.thumbnail || "/placeholder.jpg"}
        alt={blog?.title || "Blog thumbnail"}
        className="rounded-lg"
      />

      {/* Auteur et infos */}
      <p className="text-sm mt-2">
        By{" "}
        {blog?.author
          ? `${blog.author.firstName} ${blog.author.lastName}`
          : "Unknown Author"}{" "}
        | {blog?.category || "General"} | {formattedDate}
      </p>

      {/* Titre et sous-titre */}
      <h2 className="text-xl font-semibold mt-1">
        {blog?.title || "Untitled"}
      </h2>
      <h3 className="text-gray-500 mt-1">
        {blog?.subtitle || "No subtitle available"}
      </h3>

      {/* Bouton Lire plus */}
      <Button
        onClick={() => navigate(`/blogs/${blog?._id}`)}
        className="mt-4 px-4 py-2 rounded-lg text-sm"
      >
        Read More
      </Button>
    </div>
  );
};

export default BlogCard;
