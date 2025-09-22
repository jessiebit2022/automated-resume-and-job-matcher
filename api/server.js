const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

// Import routes
const uploadRoutes = require('./routes/upload');
const jobRoutes = require('./routes/jobs');
const parseRoutes = require('./routes/parse');

const app = express();
const PORT = process.env.PORT || 8000;
const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:5000';

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Upload rate limiting (more restrictive)
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 uploads per windowMs
  message: {
    error: 'Too many file uploads, please try again later.'
  }
});

// Basic middleware
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 16 * 1024 * 1024, // 16MB limit
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || 
                    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                    file.mimetype === 'application/msword';
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'resume-parser-api',
    version: '1.0.0'
  });
});

// File upload endpoint
app.post('/api/upload', uploadLimiter, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No file uploaded',
        details: 'Please select a resume file to upload'
      });
    }

    console.log('File uploaded:', req.file.filename);

    // Forward file to Python backend for processing
    const formData = new FormData();
    const fileBuffer = await fs.readFile(req.file.path);
    const blob = new Blob([fileBuffer], { type: req.file.mimetype });
    formData.append('file', blob, req.file.originalname);

    try {
      const response = await axios.post(`${PYTHON_BACKEND_URL}/parse`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 seconds timeout
      });

      // Clean up uploaded file
      await fs.unlink(req.file.path).catch(console.error);

      res.json({
        id: response.data.id || uuidv4(),
        message: 'Resume processed successfully',
        data: response.data
      });

    } catch (pythonError) {
      console.error('Python backend error:', pythonError.message);
      
      // Clean up uploaded file
      await fs.unlink(req.file.path).catch(console.error);
      
      // Return mock data if Python backend is not available
      const mockResult = {
        id: uuidv4(),
        filename: req.file.originalname,
        parsed_at: new Date().toISOString(),
        personal_info: {
          name: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA'
        },
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
        experience: [
          {
            company: 'Tech Corp',
            position: 'Senior Software Engineer',
            duration: '2020 - Present',
            description: 'Led development of web applications'
          }
        ],
        education: [
          {
            institution: 'University of Technology',
            degree: 'Bachelor of Computer Science',
            year: '2018'
          }
        ],
        job_matches: [
          {
            id: '1',
            title: 'Senior React Developer',
            company: 'Innovation Labs',
            location: 'San Francisco, CA',
            match_percentage: 95,
            description: 'Looking for an experienced React developer...'
          }
        ]
      };

      res.json({
        id: mockResult.id,
        message: 'Resume processed successfully (mock data)',
        data: mockResult
      });
    }

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up uploaded file if it exists
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    
    res.status(500).json({
      error: 'Failed to process resume',
      details: error.message
    });
  }
});

// Get jobs endpoint
app.get('/api/jobs', async (req, res) => {
  try {
    const response = await axios.get(`${PYTHON_BACKEND_URL}/jobs`, {
      timeout: 10000
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching jobs:', error.message);
    
    // Return mock jobs if Python backend is not available
    const mockJobs = [
      {
        id: '1',
        title: 'Senior Frontend Developer',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        salary: '$120k - $150k',
        type: 'Full-time',
        description: 'Join our team to build cutting-edge web applications.',
        skills: ['React', 'JavaScript', 'TypeScript', 'CSS']
      },
      {
        id: '2',
        title: 'Full Stack Engineer',
        company: 'Startup Inc',
        location: 'Remote',
        salary: '$100k - $130k',
        type: 'Full-time',
        description: 'Work on both frontend and backend technologies.',
        skills: ['Node.js', 'React', 'MongoDB', 'AWS']
      }
    ];
    
    res.json({
      jobs: mockJobs,
      total: mockJobs.length,
      timestamp: new Date().toISOString()
    });
  }
});

// Search jobs endpoint
app.post('/api/jobs/search', async (req, res) => {
  try {
    const response = await axios.post(`${PYTHON_BACKEND_URL}/jobs/search`, req.body, {
      timeout: 10000
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error searching jobs:', error.message);
    res.status(500).json({
      error: 'Failed to search jobs',
      details: 'Job search service is temporarily unavailable'
    });
  }
});

// Get parsed resume data
app.get('/api/results/:id', async (req, res) => {
  const { id } = req.params;
  
  // For now, return mock data since we don't have persistent storage
  const mockResult = {
    id: id,
    personal_info: {
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
        description: 'Built and maintained full-stack applications'
      }
    ],
    education: [
      {
        institution: 'University of Technology',
        degree: 'Bachelor of Computer Science',
        year: '2018'
      }
    ],
    job_matches: [
      {
        id: '1',
        title: 'Senior React Developer',
        company: 'Innovation Labs',
        location: 'San Francisco, CA',
        match_percentage: 95,
        description: 'Looking for an experienced React developer...'
      },
      {
        id: '2',
        title: 'Full Stack Engineer',
        company: 'Growth Solutions',
        location: 'Remote',
        match_percentage: 88,
        description: 'Join our dynamic team to build scalable web applications...'
      }
    ]
  };
  
  res.json(mockResult);
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        details: 'Maximum file size is 16MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too many files',
        details: 'Only one file can be uploaded at a time'
      });
    }
  }
  
  if (error.message.includes('Only PDF, DOC, and DOCX files are allowed')) {
    return res.status(400).json({
      error: 'Invalid file type',
      details: error.message
    });
  }
  
  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    details: `Route ${req.method} ${req.path} does not exist`
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Resume Parser API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🐍 Python backend: ${PYTHON_BACKEND_URL}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;