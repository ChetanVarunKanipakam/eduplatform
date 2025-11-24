import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedEmailRoute = ({ allowedEmail, children }) => {
  const { user } = useAuth();

  // Not logged in → redirect
  if (!user) return <Navigate to="/notloggedin" />;

  // Logged in but email doesn't match → block
  if (user.email !== allowedEmail) return <h1>Access Denied</h1>;

  // Allowed user → load the page
  return children;
};

export default ProtectedEmailRoute;
