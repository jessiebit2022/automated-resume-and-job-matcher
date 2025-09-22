import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <h1>Resume Parser & Job Matcher</h1>
        </Link>
        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/upload" className="nav-link">Upload Resume</Link>
            </li>
            <li className="nav-item">
              <Link to="/jobs" className="nav-link">Browse Jobs</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;