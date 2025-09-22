# Development Guide

## Quick Start

### Automated Setup (Recommended)
```bash
# Make sure you have Node.js (v16+) and Python (v3.8+) installed
./start.sh
```

This script will:
- Check all prerequisites
- Install all dependencies
- Set up Python virtual environment
- Download required NLP models
- Start all three services simultaneously

### Manual Setup

#### 1. Frontend (React)
```bash
cd frontend
npm install
npm start
```
Runs on http://localhost:3000

#### 2. API (Express.js)
```bash
cd api
npm install
npm start
```
Runs on http://localhost:8000

#### 3. Backend (Python)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python main.py
```
Runs on http://localhost:5000

## Development Workflow

### Making Changes

#### Frontend Changes
- Edit files in `frontend/src/`
- React will hot-reload automatically
- Check console for errors

#### API Changes
- Edit `api/server.js` or add routes in `api/routes/`
- Restart the API server: `npm start`

#### Backend Changes
- Edit Python files in `backend/app/`
- Restart the Python server: `python main.py`

### Testing Uploads

1. Navigate to http://localhost:3000
2. Click "Upload Your Resume"
3. Upload a PDF or DOCX file
4. View the parsed results

### API Endpoints

#### Health Checks
- GET `/health` - API health check
- GET `http://localhost:5000/health` - Python backend health

#### Resume Processing
- POST `/api/upload` - Upload and parse resume
- GET `/api/results/:id` - Get parsed resume data

#### Job Management
- GET `/api/jobs` - List all jobs
- POST `/api/jobs/search` - Search jobs with filters

### Environment Variables

#### API (.env)
```bash
PORT=8000
FRONTEND_URL=http://localhost:3000
PYTHON_BACKEND_URL=http://localhost:5000
```

#### Backend (.env)
```bash
FLASK_PORT=5000
FLASK_DEBUG=True
SPACY_MODEL=en_core_web_sm
```

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │   Express API   │    │  Python Backend │
│   (Port 3000)   │◄──►│   (Port 8000)   │◄──►│   (Port 5000)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  User Interface │    │  File Handling  │    │  NLP Processing │
│  Job Matching   │    │  Rate Limiting  │    │  Resume Parsing │
│  Results Display│    │  CORS & Security│    │  Job Matching   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Key Files

### Frontend
- `src/App.tsx` - Main application component
- `src/pages/Upload/Upload.tsx` - File upload interface
- `src/pages/Results/Results.tsx` - Parsed data display
- `src/pages/Jobs/Jobs.tsx` - Job listings

### API
- `server.js` - Express server setup
- `routes/` - API route handlers (to be created)

### Backend
- `main.py` - Flask application entry point
- `app/parsers/resume_parser.py` - NLP resume parsing
- `app/utils/job_matcher.py` - Job matching algorithm
- `app/models/resume_data.py` - Data models

## Adding New Features

### New Frontend Page
1. Create component in `frontend/src/pages/NewPage/`
2. Add route in `frontend/src/App.tsx`
3. Add navigation link in `Header.tsx`

### New API Endpoint
1. Add route in `api/server.js` or create new route file
2. Handle CORS and validation
3. Connect to Python backend if needed

### New Backend Feature
1. Add new parser in `backend/app/parsers/`
2. Update `resume_parser.py` to use new parser
3. Add new models if needed

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :3000
lsof -i :8000  
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Python Dependencies
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Download spaCy model
python -m spacy download en_core_web_sm
```

### Node Dependencies
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### File Upload Issues
- Check file size (max 16MB)
- Verify file format (PDF, DOC, DOCX only)
- Check API logs for errors

## Performance Tips

### Frontend
- Use React.memo for expensive components
- Implement lazy loading for large job lists
- Optimize bundle size with code splitting

### API
- Implement request caching
- Use compression middleware
- Add request/response logging

### Backend
- Cache spaCy model loading
- Implement async processing for large files
- Add database for persistent storage

## Security Considerations

- File upload validation (type, size)
- Rate limiting for API endpoints
- Input sanitization for user data
- HTTPS in production
- Environment variable security

## Deployment

### Frontend
```bash
cd frontend
npm run build
# Deploy build/ folder to static hosting
```

### API + Backend
```bash
# Use PM2 or similar for process management
pm2 start api/server.js --name "resume-api"
pm2 start backend/main.py --name "resume-backend" --interpreter python3
```

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

**Built with ❤️ by Jessie Borras**  
Website: [jessiedev.xyz](https://jessiedev.xyz)