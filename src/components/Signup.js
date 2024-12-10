// src/components/Signup.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import '../styles/styles.css'; // Ensure correct path
import backgroundImage from '../images/pod-web-bg.png'; // Import the background image

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
  const navigate = useNavigate();

  useEffect(() => {
    // Set the CSS variable for the background image
    document.documentElement.style.setProperty('--podWebBg', `url(${backgroundImage})`);
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();

    // Password confirmation validation
    if (password !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/event-form');
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Error signing up: ' + error.message);
    }
  };

  return (
    <div className="container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="Enter your password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label> {/* New Confirm Password field */}
          <input 
            type="password" 
            id="confirmPassword"
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
            placeholder="Confirm your password"
          />
        </div>
        <button type="submit" className="next-btn">Sign Up</button>
      </form>
      <p className="download-link">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Signup;
