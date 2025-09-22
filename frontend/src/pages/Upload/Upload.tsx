import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import './Upload.css';

const Upload: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      uploadFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const uploadFile = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadProgress(100);
      clearInterval(progressInterval);
      
      // Simulate getting a result ID
      const resultId = Math.random().toString(36).substr(2, 9);
      
      setTimeout(() => {
        navigate(`/results/${resultId}`);
      }, 500);

    } catch (error) {
      console.error('Upload failed:', error);
      setUploading(false);
      setUploadProgress(0);
      // TODO: Show error message to user
    }
  };

  return (
    <div className="upload-page">
      <div className="container">
        <div className="upload-header">
          <h1>Upload Your Resume</h1>
          <p>Upload your resume in PDF or DOCX format to get started with AI-powered job matching.</p>
        </div>

        <div className="upload-container">
          <div 
            {...getRootProps()} 
            className={`dropzone ${isDragActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
          >
            <input {...getInputProps()} />
            
            {uploading ? (
              <div className="upload-progress">
                <div className="progress-spinner"></div>
                <h3>Processing Your Resume...</h3>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p>{uploadProgress}% Complete</p>
              </div>
            ) : (
              <div className="dropzone-content">
                <div className="upload-icon">📄</div>
                <h3>
                  {isDragActive 
                    ? 'Drop your resume here...' 
                    : 'Drag & drop your resume here'
                  }
                </h3>
                <p>or click to browse files</p>
                <div className="file-types">
                  <span className="file-type">PDF</span>
                  <span className="file-type">DOCX</span>
                  <span className="file-type">DOC</span>
                </div>
                <p className="file-limit">Maximum file size: 10MB</p>
              </div>
            )}
          </div>

          <div className="upload-info">
            <h3>What happens next?</h3>
            <div className="info-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>File Upload</h4>
                  <p>Your resume is securely uploaded and validated</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>AI Analysis</h4>
                  <p>Our AI extracts skills, experience, and qualifications</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Job Matching</h4>
                  <p>Get matched with relevant job opportunities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;