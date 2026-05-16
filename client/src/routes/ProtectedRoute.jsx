import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {

    // Get user from localStorage
    const user = localStorage.getItem("userDetails");

    // If not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If logged in
    return children;
};

export default ProtectedRoute;