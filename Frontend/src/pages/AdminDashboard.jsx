import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    blogs: 0,
    comments: 0,
    courses: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "https://felblad-plateform.onrender.com/api/v1/admin/stats",
          { withCredentials: true }
        );
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Utilisateurs</h2>
          <p className="text-3xl">{stats.users}</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Blogs</h2>
          <p className="text-3xl">{stats.blogs}</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Commentaires</h2>
          <p className="text-3xl">{stats.comments}</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Courses</h2>
          <p className="text-3xl">{stats.courses}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
