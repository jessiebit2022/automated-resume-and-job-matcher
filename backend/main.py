from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import uuid
from datetime import datetime
import logging

from app.parsers.resume_parser import ResumeParser
from app.models.resume_data import ResumeData
from app.utils.file_handler import FileHandler
from app.utils.job_matcher import JobMatcher

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'pdf', 'doc', 'docx'}

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize components
file_handler = FileHandler()
resume_parser = ResumeParser()
job_matcher = JobMatcher()

def allowed_file(filename):
    """Check if file extension is allowed."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'service': 'resume-parser-backend'
    })

@app.route('/parse', methods=['POST'])
def parse_resume():
    """Parse uploaded resume and return extracted data."""
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Validate file type
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Only PDF, DOC, and DOCX are allowed.'}), 400
        
        # Generate unique filename and save file
        file_id = str(uuid.uuid4())
        filename = secure_filename(file.filename)
        file_extension = filename.rsplit('.', 1)[1].lower()
        saved_filename = f"{file_id}.{file_extension}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], saved_filename)
        
        file.save(file_path)
        logger.info(f"File saved: {file_path}")
        
        # Extract text from file
        text_content = file_handler.extract_text(file_path, file_extension)
        if not text_content:
            return jsonify({'error': 'Unable to extract text from file'}), 400
        
        # Parse resume data
        parsed_data = resume_parser.parse(text_content)
        
        # Find job matches
        job_matches = job_matcher.find_matches(parsed_data)
        
        # Create response
        result = {
            'id': file_id,
            'filename': filename,
            'parsed_at': datetime.utcnow().isoformat(),
            'personal_info': parsed_data.personal_info,
            'skills': parsed_data.skills,
            'experience': parsed_data.experience,
            'education': parsed_data.education,
            'job_matches': job_matches
        }
        
        logger.info(f"Resume parsed successfully: {file_id}")
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error parsing resume: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500
    
    finally:
        # Clean up uploaded file
        try:
            if 'file_path' in locals() and os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            logger.warning(f"Failed to cleanup file {file_path}: {str(e)}")

@app.route('/jobs', methods=['GET'])
def get_jobs():
    """Get available job listings."""
    try:
        jobs = job_matcher.get_all_jobs()
        return jsonify({
            'jobs': jobs,
            'total': len(jobs),
            'timestamp': datetime.utcnow().isoformat()
        })
    except Exception as e:
        logger.error(f"Error fetching jobs: {str(e)}")
        return jsonify({'error': 'Failed to fetch jobs'}), 500

@app.route('/jobs/search', methods=['POST'])
def search_jobs():
    """Search jobs based on criteria."""
    try:
        search_data = request.get_json()
        if not search_data:
            return jsonify({'error': 'No search criteria provided'}), 400
        
        jobs = job_matcher.search_jobs(search_data)
        return jsonify({
            'jobs': jobs,
            'total': len(jobs),
            'timestamp': datetime.utcnow().isoformat()
        })
    except Exception as e:
        logger.error(f"Error searching jobs: {str(e)}")
        return jsonify({'error': 'Failed to search jobs'}), 500

@app.errorhandler(413)
def request_entity_too_large(error):
    """Handle file too large error."""
    return jsonify({'error': 'File too large. Maximum size is 16MB.'}), 413

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Load spaCy model on startup
    try:
        resume_parser.load_model()
        logger.info("spaCy model loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load spaCy model: {str(e)}")
        logger.info("Please run: python -m spacy download en_core_web_sm")
    
    # Start the Flask application
    app.run(host='0.0.0.0', port=5000, debug=True)