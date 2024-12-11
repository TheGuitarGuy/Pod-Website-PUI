// src/hooks/useAuth.js

import React, { useContext, useState, useEffect, createContext } from 'react';
import { auth } from '../firebaseConfig'; // Ensure correct path
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap around your app
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(undefined); // Initialize as undefined
  const [loading, setLoading] = useState(true); // To handle async auth state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth State Changed:", user); // Debugging line
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    // Add other auth-related functions if needed
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children only after loading */}
    </AuthContext.Provider>
  );
};
