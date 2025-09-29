import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ roles, children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    // Pas connecté → rediriger vers login
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // Connecté mais rôle non autorisé → rediriger vers dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
