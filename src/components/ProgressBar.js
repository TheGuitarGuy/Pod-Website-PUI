// ProgressBar.js
import React from 'react';
import '../styles/styles.css';


const ProgressBar = ({ currentStep, totalSteps }) => (
  <div className="progress-bar">
    {[...Array(totalSteps)].map((_, i) => (
      <div key={i} className={`progress-section ${i <= currentStep ? 'progress-section-active' : ''}`} />
    ))}
  </div>
);

export default ProgressBar;
