import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Results.css';

interface ParsedResume {
  id: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  skills: string[];
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  matchedJobs: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    matchPercentage: number;
    description: string;
  }>;
}

const Results: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [resumeData, setResumeData] = useState<ParsedResume | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchResults = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockData: ParsedResume = {
          id: id || '',
          personalInfo: {
            name: 'John Doe',
            email: 'john.doe@email.com',
            phone: '+1 (555) 123-4567',
            location: 'San Francisco, CA'
          },
          skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS', 'Docker', 'Git'],
          experience: [
            {
              company: 'Tech Corp',
              position: 'Senior Software Engineer',
              duration: '2020 - Present',
              description: 'Led development of web applications using React and Node.js'
            },
            {
              company: 'StartupXYZ',
              position: 'Full Stack Developer',
              duration: '2018 - 2020',
              description: 'Built and maintained full-stack applications using modern technologies'
            }
          ],
          education: [
            {
              institution: 'University of Technology',
              degree: 'Bachelor of Computer Science',
              year: '2018'
            }
          ],
          matchedJobs: [
            {
              id: '1',
              title: 'Senior React Developer',
              company: 'Innovation Labs',
              location: 'San Francisco, CA',
              matchPercentage: 95,
              description: 'Looking for an experienced React developer to join our team...'
            },
            {
              id: '2',
              title: 'Full Stack Engineer',
              company: 'Growth Solutions',
              location: 'Remote',
              matchPercentage: 88,
              description: 'Join our dynamic team to build scalable web applications...'
            },
            {
              id: '3',
              title: 'Frontend Developer',
              company: 'Creative Agency',
              location: 'New York, NY',
              matchPercentage: 82,
              description: 'Create beautiful and functional user interfaces...'
            }
          ]
        };
        
        setResumeData(mockData);
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  if (loading) {
    return (
      <div className="results-page">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <h2>Analyzing your resume...</h2>
            <p>Please wait while we process your information</p>
          </div>
        </div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="results-page">
        <div className="container">
          <div className="error">
            <h2>Results not found</h2>
            <p>We couldn't find the results for this resume.</p>
            <Link to="/upload" className="cta-button primary">Upload New Resume</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page">
      <div className="container">
        <div className="results-header">
          <h1>Resume Analysis Results</h1>
          <p>Here's what we extracted from your resume and your job matches</p>
        </div>

        <div className="results-grid">
          <div className="resume-data">
            <section className="data-section">
              <h2>Personal Information</h2>
              <div className="personal-info">
                <div className="info-item">
                  <strong>Name:</strong> {resumeData.personalInfo.name}
                </div>
                <div className="info-item">
                  <strong>Email:</strong> {resumeData.personalInfo.email}
                </div>
                <div className="info-item">
                  <strong>Phone:</strong> {resumeData.personalInfo.phone}
                </div>
                <div className="info-item">
                  <strong>Location:</strong> {resumeData.personalInfo.location}
                </div>
              </div>
            </section>

            <section className="data-section">
              <h2>Skills</h2>
              <div className="skills-list">
                {resumeData.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </section>

            <section className="data-section">
              <h2>Experience</h2>
              <div className="experience-list">
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="experience-item">
                    <h3>{exp.position}</h3>
                    <div className="company-duration">
                      <span className="company">{exp.company}</span>
                      <span className="duration">{exp.duration}</span>
                    </div>
                    <p>{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="data-section">
              <h2>Education</h2>
              <div className="education-list">
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="education-item">
                    <h3>{edu.degree}</h3>
                    <div className="institution-year">
                      <span className="institution">{edu.institution}</span>
                      <span className="year">{edu.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="job-matches">
            <section className="data-section">
              <h2>Job Matches</h2>
              <div className="matches-list">
                {resumeData.matchedJobs.map((job) => (
                  <div key={job.id} className="job-match-card">
                    <div className="match-header">
                      <h3>{job.title}</h3>
                      <div className="match-percentage">
                        <span className="percentage">{job.matchPercentage}%</span>
                        <span className="match-label">Match</span>
                      </div>
                    </div>
                    <div className="job-details">
                      <div className="company-location">
                        <span className="company">{job.company}</span>
                        <span className="location">{job.location}</span>
                      </div>
                      <p className="job-description">{job.description}</p>
                    </div>
                    <div className="job-actions">
                      <button className="apply-button">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="results-actions">
          <Link to="/upload" className="cta-button secondary">Upload Another Resume</Link>
          <Link to="/jobs" className="cta-button primary">Browse All Jobs</Link>
        </div>
      </div>
    </div>
  );
};

export default Results;