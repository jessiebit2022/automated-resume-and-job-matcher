# Automated Resume Parser & Job Matcher

**Author:** Jessie Borras  
**Website:** [jessiedev.xyz](https://jessiedev.xyz)

## Description

A web application where users can upload their resumes, which are then parsed to extract key information (skills, experience). The app then matches them to relevant jobs based on the extracted data.

## Features

- **Resume Upload**: Users can upload PDF/DOCX resume files
- **Intelligent Parsing**: Extracts skills, experience, education, and contact information
- **Job Matching**: Matches users to relevant job opportunities based on their profile
- **User Dashboard**: Clean interface to view parsed information and job matches
- **Real-time Processing**: Fast resume analysis and job recommendations

## Tech Stack

### Frontend
- **React** - Modern JavaScript library for building user interfaces
- **CSS3/SCSS** - Styling and responsive design
- **Axios** - HTTP client for API communication

### Backend (Python)
- **Python** - Core backend language
- **spaCy** - Natural language processing for resume parsing
- **NLTK** - Additional text processing capabilities
- **Flask/FastAPI** - Python web framework
- **PyPDF2/pdfplumber** - PDF text extraction
- **python-docx** - DOCX file processing

### API Layer
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for API endpoints
- **Multer** - File upload handling
- **Cors** - Cross-origin resource sharing

### Additional Tools
- **Git** - Version control
- **npm/yarn** - Package management

## Project Structure

```
Automated Resume & Job Matcher/
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   └── package.json
├── backend/                  # Python resume parser
│   ├── app/
│   │   ├── parsers/
│   │   ├── models/
│   │   └── utils/
│   ├── requirements.txt
│   └── main.py
├── api/                      # Node.js/Express API
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   └── package.json
├── docs/                     # Documentation
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Automated Resume & Job Matcher"
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```
The React app will run on `http://localhost:3000`

### 3. Python Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python main.py
```
The Python service will run on `http://localhost:5000`

### 4. API Setup
```bash
cd api
npm install
npm start
```
The Express API will run on `http://localhost:8000`

## Usage

1. **Upload Resume**: Navigate to the web application and upload your resume (PDF or DOCX format)
2. **View Parsed Data**: Review the extracted information including skills, experience, and education
3. **Job Matching**: Browse through matched job opportunities based on your profile
4. **Apply/Save**: Save interesting positions or get redirected to apply

## API Endpoints

### Resume Processing
- `POST /api/upload` - Upload resume file
- `GET /api/parse/:id` - Get parsed resume data
- `GET /api/matches/:id` - Get job matches for resume

### Job Management
- `GET /api/jobs` - List available jobs
- `GET /api/jobs/:id` - Get specific job details
- `POST /api/jobs/search` - Search jobs with filters

## Development

### Running in Development Mode

1. Start the Python backend:
```bash
cd backend && python main.py
```

2. Start the Express API:
```bash
cd api && npm run dev
```

3. Start the React frontend:
```bash
cd frontend && npm start
```

### Testing
```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && python -m pytest

# API tests
cd api && npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [ ] Advanced skill matching algorithms
- [ ] Integration with popular job boards (Indeed, LinkedIn)
- [ ] Email notifications for new matches
- [ ] Resume improvement suggestions
- [ ] Multi-language support
- [ ] Mobile application
- [ ] Company profiles and direct applications

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

**Jessie Borras**
- Website: [jessiedev.xyz](https://jessiedev.xyz)
- GitHub: [@jessieborras](https://github.com/jessieborras)

---

*Built with ❤️ using React, Python, and Node.js*