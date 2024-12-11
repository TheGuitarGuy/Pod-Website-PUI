// src/components/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  console.log("ProtectedRoute - currentUser:", currentUser); // Debugging line

  if (currentUser === undefined) {
    // Authentication state is still loading
    return <div>Loading...</div>; // Optional: Replace with a spinner or loader
  }

  if (!currentUser) {
    // Not authenticated, redirect to Login
    return <Navigate to="/" replace />;
  }

  // Authenticated, render the child component
  return children;
};

export default ProtectedRoute;
