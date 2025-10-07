import { ChartColumnBig, SquareUser, ShieldCheck } from "lucide-react";
import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { LiaCommentSolid } from "react-icons/lia";
import { PiChalkboardTeacher } from "react-icons/pi";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux"; // récupère le user depuis Redux

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth); // user stocké après login

  const linkStyle = ({ isActive }) =>
    `text-lg flex items-center gap-2 font-semibold cursor-pointer p-3 rounded-xl transition-colors ${
      isActive
        ? "bg-gray-800 dark:bg-gray-900 text-white"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
    }`;

  return (
    <div className="h-screen w-64 border-r-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-6">
      <div className="flex flex-col space-y-3">
        {/* Toujours visible */}
        <NavLink to="/dashboard/profile" className={linkStyle}>
          <SquareUser />
          <span>Profile</span>
        </NavLink>

        <NavLink to="/dashboard/your-blog" className={linkStyle}>
          <ChartColumnBig />
          <span>Your Blogs</span>
        </NavLink>

        <NavLink to="/dashboard/comments" className={linkStyle}>
          <LiaCommentSolid />
          <span>Comments</span>
        </NavLink>

        {(user?.role === "professeur" || user?.role === "admin") && (
          <NavLink to="/dashboard/write-blog" className={linkStyle}>
            <FaRegEdit />
            <span>Create Blog</span>
          </NavLink>
        )}

        {/* Visible seulement pour professeur OU admin */}
        {(user?.role === "professeur" || user?.role === "admin") && (
          <NavLink to="/dashboard/courses" className={linkStyle}>
            <PiChalkboardTeacher />
            <span>Courses</span>
          </NavLink>
        )}

        {/* Visible seulement pour admin */}
        {user?.role === "admin" && (
          <NavLink to="/dashboard/admin" className={linkStyle}>
            <ShieldCheck />
            <span>Admin</span>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
