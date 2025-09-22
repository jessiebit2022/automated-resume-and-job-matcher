import React from 'react';
import './Jobs.css';

const Jobs: React.FC = () => {
  // Mock job data
  const mockJobs = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      salary: '$120k - $150k',
      type: 'Full-time',
      description: 'Join our team to build cutting-edge web applications using React and modern technologies.',
      tags: ['React', 'JavaScript', 'TypeScript', 'CSS']
    },
    {
      id: '2',
      title: 'Full Stack Engineer',
      company: 'Startup Inc',
      location: 'Remote',
      salary: '$100k - $130k',
      type: 'Full-time',
      description: 'Work on both frontend and backend technologies in a fast-paced startup environment.',
      tags: ['Node.js', 'React', 'MongoDB', 'AWS']
    },
    {
      id: '3',
      title: 'Python Developer',
      company: 'Data Solutions',
      location: 'New York, NY',
      salary: '$90k - $120k',
      type: 'Full-time',
      description: 'Develop data processing applications and APIs using Python and machine learning.',
      tags: ['Python', 'Django', 'PostgreSQL', 'Machine Learning']
    },
    {
      id: '4',
      title: 'DevOps Engineer',
      company: 'Cloud Systems',
      location: 'Austin, TX',
      salary: '$110k - $140k',
      type: 'Full-time',
      description: 'Manage infrastructure and deployment pipelines for large-scale applications.',
      tags: ['Docker', 'Kubernetes', 'AWS', 'CI/CD']
    }
  ];

  return (
    <div className="jobs-page">
      <div className="container">
        <div className="jobs-header">
          <h1>Browse Jobs</h1>
          <p>Discover exciting opportunities that match your skills and interests</p>
        </div>

        <div className="jobs-filters">
          <div className="filter-group">
            <label>Location</label>
            <select>
              <option value="">All Locations</option>
              <option value="remote">Remote</option>
              <option value="sf">San Francisco</option>
              <option value="ny">New York</option>
              <option value="austin">Austin</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Job Type</label>
            <select>
              <option value="">All Types</option>
              <option value="fulltime">Full-time</option>
              <option value="parttime">Part-time</option>
              <option value="contract">Contract</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Experience Level</label>
            <select>
              <option value="">All Levels</option>
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
            </select>
          </div>
        </div>

        <div className="jobs-grid">
          {mockJobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <h2>{job.title}</h2>
                <div className="job-meta">
                  <span className="company">{job.company}</span>
                  <span className="location">{job.location}</span>
                </div>
              </div>
              
              <div className="job-details">
                <div className="job-info">
                  <span className="salary">{job.salary}</span>
                  <span className="type">{job.type}</span>
                </div>
                <p className="job-description">{job.description}</p>
                
                <div className="job-tags">
                  {job.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
              
              <div className="job-actions">
                <button className="apply-button primary">Apply Now</button>
                <button className="save-button">Save</button>
              </div>
            </div>
          ))}
        </div>

        <div className="jobs-pagination">
          <button className="pagination-button" disabled>Previous</button>
          <span className="page-info">Page 1 of 5</span>
          <button className="pagination-button">Next</button>
        </div>
      </div>
    </div>
  );
};

export default Jobs;