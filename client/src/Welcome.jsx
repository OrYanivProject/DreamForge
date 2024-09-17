import React from 'react';
import Header from './Header';
import { Link } from 'react-router-dom';
import './styles.css';  // Ensure this CSS path is correct

const Welcome = () => {
  return (
    <div>
      <div className="welcome-page">
        <div className="content">
          <h1 className="title">DreamForge</h1>
          <p className="p">Bring Your Vision To The Next Level</p>
          <p className="p">Create Your Project's Blueprint in Seconds, No Experience Needed</p>
          <Link to="/register" className="button">Get Started</Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
