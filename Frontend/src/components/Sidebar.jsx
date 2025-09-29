import { ChartColumnBig, SquareUser } from "lucide-react";
import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { LiaCommentSolid } from "react-icons/lia";
import { PiChalkboardTeacher } from "react-icons/pi"; // pour courses
import { ShieldCheck } from "lucide-react"; // pour admin
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkStyle = ({ isActive }) =>
    `text-lg flex items-center gap-2 font-semibold cursor-pointer p-3 rounded-xl transition-colors ${
      isActive
        ? "bg-gray-800 dark:bg-gray-900 text-white"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
    }`;

  return (
    <div className="h-screen w-64 border-r-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-6">
      <div className="flex flex-col space-y-3">
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

        <NavLink to="/dashboard/write-blog" className={linkStyle}>
          <FaRegEdit />
          <span>Create Blog</span>
        </NavLink>

        {/* NEW: Courses */}
        <NavLink to="/dashboard/courses" className={linkStyle}>
          <PiChalkboardTeacher />
          <span>Courses</span>
        </NavLink>

        {/* NEW: Admin (visible seulement si user = admin → tu peux mettre une condition plus tard) */}
        <NavLink to="/dashboard/admin" className={linkStyle}>
          <ShieldCheck />
          <span>Admin</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
