import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Find Your Perfect Job Match with AI-Powered Resume Analysis
            </h1>
            <p className="hero-description">
              Upload your resume and let our advanced AI parse your skills, experience, 
              and qualifications to match you with the most relevant job opportunities.
            </p>
            <div className="hero-actions">
              <Link to="/upload" className="cta-button primary">
                Upload Your Resume
              </Link>
              <Link to="/jobs" className="cta-button secondary">
                Browse Jobs
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="resume-mockup">
              <div className="mockup-lines">
                <div className="line long"></div>
                <div className="line medium"></div>
                <div className="line short"></div>
                <div className="line medium"></div>
                <div className="line long"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📄</div>
              <h3>Upload Resume</h3>
              <p>Upload your resume in PDF or DOCX format. Our system supports various resume layouts and formats.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>AI Analysis</h3>
              <p>Advanced NLP algorithms parse your resume to extract skills, experience, education, and key qualifications.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Job Matching</h3>
              <p>Get matched with relevant job opportunities based on your profile and career preferences.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Resumes Parsed</div>
            </div>
            <div className="stat">
              <div className="stat-number">5,000+</div>
              <div className="stat-label">Job Matches Made</div>
            </div>
            <div className="stat">
              <div className="stat-number">95%</div>
              <div className="stat-label">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;