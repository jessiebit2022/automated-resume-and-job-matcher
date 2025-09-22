import logging
from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from ..models.resume_data import ResumeData

logger = logging.getLogger(__name__)

class JobMatcher:
    """Match resumes to relevant job opportunities."""
    
    def __init__(self):
        self.jobs_database = self._load_mock_jobs()
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2)
        )
    
    def _load_mock_jobs(self) -> List[Dict[str, Any]]:
        """Load mock job data. In production, this would connect to a job board API."""
        return [
            {
                'id': '1',
                'title': 'Senior React Developer',
                'company': 'Innovation Labs',
                'location': 'San Francisco, CA',
                'type': 'Full-time',
                'salary': '$120k - $150k',
                'description': 'We are looking for an experienced React developer to join our frontend team. You will be responsible for building modern web applications using React, TypeScript, and other cutting-edge technologies.',
                'requirements': [
                    '5+ years of React experience',
                    'Strong JavaScript and TypeScript skills',
                    'Experience with Redux or similar state management',
                    'Knowledge of modern build tools',
                    'Experience with RESTful APIs',
                    'Git version control'
                ],
                'skills': ['React', 'JavaScript', 'TypeScript', 'Redux', 'HTML', 'CSS', 'Git', 'REST APIs'],
                'remote_friendly': False,
                'experience_level': 'Senior'
            },
            {
                'id': '2',
                'title': 'Full Stack Engineer',
                'company': 'Growth Solutions',
                'location': 'Remote',
                'type': 'Full-time',
                'salary': '$100k - $130k',
                'description': 'Join our dynamic team to build scalable web applications. We work with modern technologies across the full stack including React, Node.js, and cloud platforms.',
                'requirements': [
                    '3+ years of full-stack development',
                    'Proficiency in React and Node.js',
                    'Database design experience',
                    'Cloud platform knowledge (AWS/Azure)',
                    'API design and development',
                    'Agile development experience'
                ],
                'skills': ['React', 'Node.js', 'JavaScript', 'MongoDB', 'AWS', 'Docker', 'REST APIs'],
                'remote_friendly': True,
                'experience_level': 'Mid'
            },
            {
                'id': '3',
                'title': 'Frontend Developer',
                'company': 'Creative Agency',
                'location': 'New York, NY',
                'type': 'Full-time',
                'salary': '$80k - $110k',
                'description': 'Create beautiful and functional user interfaces for our clients. You will work closely with designers to implement pixel-perfect designs using modern frontend technologies.',
                'requirements': [
                    '2+ years of frontend development',
                    'Strong HTML, CSS, and JavaScript skills',
                    'Experience with React or Vue.js',
                    'Responsive design expertise',
                    'Cross-browser compatibility knowledge',
                    'Version control with Git'
                ],
                'skills': ['HTML', 'CSS', 'JavaScript', 'React', 'SASS', 'Responsive Design', 'Git'],
                'remote_friendly': False,
                'experience_level': 'Mid'
            },
            {
                'id': '4',
                'title': 'Python Developer',
                'company': 'Data Solutions Inc',
                'location': 'Austin, TX',
                'type': 'Full-time',
                'salary': '$90k - $120k',
                'description': 'Develop data processing applications and APIs using Python. You will work on machine learning pipelines, data analysis, and backend services.',
                'requirements': [
                    '3+ years of Python development',
                    'Experience with Django or Flask',
                    'Database knowledge (PostgreSQL, MongoDB)',
                    'RESTful API development',
                    'Data processing and analysis',
                    'Machine learning libraries knowledge'
                ],
                'skills': ['Python', 'Django', 'Flask', 'PostgreSQL', 'MongoDB', 'Machine Learning', 'Pandas', 'NumPy'],
                'remote_friendly': True,
                'experience_level': 'Mid'
            },
            {
                'id': '5',
                'title': 'DevOps Engineer',
                'company': 'Cloud Systems',
                'location': 'Seattle, WA',
                'type': 'Full-time',
                'salary': '$110k - $140k',
                'description': 'Manage infrastructure and deployment pipelines for large-scale applications. You will work with containerization, orchestration, and cloud platforms.',
                'requirements': [
                    '4+ years of DevOps experience',
                    'Strong knowledge of AWS or Azure',
                    'Experience with Docker and Kubernetes',
                    'CI/CD pipeline management',
                    'Infrastructure as Code (Terraform)',
                    'Monitoring and logging systems'
                ],
                'skills': ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Linux', 'Python', 'Bash'],
                'remote_friendly': True,
                'experience_level': 'Senior'
            }
        ]
    
    def find_matches(self, resume_data: ResumeData) -> List[Dict[str, Any]]:
        """Find job matches for a given resume."""
        try:
            # Create text representation of resume for matching
            resume_text = self._create_resume_text(resume_data)
            
            # Create text representations of all jobs
            job_texts = [self._create_job_text(job) for job in self.jobs_database]
            
            # Add resume text to the corpus for vectorization
            all_texts = job_texts + [resume_text]
            
            # Vectorize texts
            tfidf_matrix = self.vectorizer.fit_transform(all_texts)
            
            # Calculate similarity between resume and each job
            resume_vector = tfidf_matrix[-1]  # Resume is the last item
            job_vectors = tfidf_matrix[:-1]   # All job vectors
            
            similarities = cosine_similarity(resume_vector, job_vectors).flatten()
            
            # Create match results with similarity scores
            matches = []
            for i, similarity_score in enumerate(similarities):
                job = self.jobs_database[i].copy()
                
                # Calculate match percentage (0-100)
                match_percentage = min(100, int(similarity_score * 100 * 1.5))  # Boost for better UX
                
                # Add skill overlap bonus
                skill_bonus = self._calculate_skill_overlap(resume_data.skills, job['skills'])
                match_percentage = min(100, match_percentage + skill_bonus)
                
                job['match_percentage'] = match_percentage
                job['similarity_score'] = float(similarity_score)
                
                matches.append(job)
            
            # Sort by match percentage (descending)
            matches.sort(key=lambda x: x['match_percentage'], reverse=True)
            
            # Return top matches
            return matches[:10]
            
        except Exception as e:
            logger.error(f"Error finding job matches: {str(e)}")
            return []
    
    def _create_resume_text(self, resume_data: ResumeData) -> str:
        """Create a text representation of the resume for matching."""
        text_parts = []
        
        # Add skills
        if resume_data.skills:
            text_parts.append(' '.join(resume_data.skills))
        
        # Add experience descriptions
        for exp in resume_data.experience:
            if exp.description:
                text_parts.append(exp.description)
            text_parts.append(exp.position)
        
        # Add education
        for edu in resume_data.education:
            text_parts.append(edu.degree)
            if edu.field_of_study:
                text_parts.append(edu.field_of_study)
        
        # Add summary
        if resume_data.summary:
            text_parts.append(resume_data.summary)
        
        return ' '.join(text_parts).lower()
    
    def _create_job_text(self, job: Dict[str, Any]) -> str:
        """Create a text representation of the job for matching."""
        text_parts = [
            job['title'],
            job['description'],
            ' '.join(job['requirements']),
            ' '.join(job['skills'])
        ]
        return ' '.join(text_parts).lower()
    
    def _calculate_skill_overlap(self, resume_skills: List[str], job_skills: List[str]) -> int:
        """Calculate skill overlap bonus (0-20 points)."""
        if not resume_skills or not job_skills:
            return 0
        
        resume_skills_lower = {skill.lower() for skill in resume_skills}
        job_skills_lower = {skill.lower() for skill in job_skills}
        
        overlap = len(resume_skills_lower.intersection(job_skills_lower))
        total_job_skills = len(job_skills_lower)
        
        if total_job_skills == 0:
            return 0
        
        overlap_percentage = overlap / total_job_skills
        return min(20, int(overlap_percentage * 20))
    
    def get_all_jobs(self) -> List[Dict[str, Any]]:
        """Get all available jobs."""
        return self.jobs_database
    
    def search_jobs(self, search_criteria: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search jobs based on criteria."""
        filtered_jobs = self.jobs_database.copy()
        
        # Filter by location
        if search_criteria.get('location'):
            location = search_criteria['location'].lower()
            filtered_jobs = [
                job for job in filtered_jobs 
                if location in job['location'].lower() or 
                (location == 'remote' and job.get('remote_friendly', False))
            ]
        
        # Filter by experience level
        if search_criteria.get('experience_level'):
            level = search_criteria['experience_level'].lower()
            filtered_jobs = [
                job for job in filtered_jobs 
                if job.get('experience_level', '').lower() == level
            ]
        
        # Filter by skills
        if search_criteria.get('skills'):
            required_skills = [skill.lower() for skill in search_criteria['skills']]
            filtered_jobs = [
                job for job in filtered_jobs
                if any(skill.lower() in [j_skill.lower() for j_skill in job['skills']] 
                      for skill in required_skills)
            ]
        
        return filtered_jobs