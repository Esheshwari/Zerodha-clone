import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "18px",
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to frontend login page
    window.location.href = "http://localhost:3000/login";
    return null;
  }

  return children;
};

export default ProtectedRoute;
