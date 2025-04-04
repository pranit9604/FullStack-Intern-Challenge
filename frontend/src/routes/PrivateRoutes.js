import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoutes = ({ allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  // Redirect to login if the user is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if the user's role is not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Render the child routes if the user is authenticated and has the correct role
  return <Outlet />;
};

export default PrivateRoutes;