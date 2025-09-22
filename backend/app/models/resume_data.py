from dataclasses import dataclass, field
from typing import List, Dict, Optional
from datetime import datetime

@dataclass
class PersonalInfo:
    """Personal information extracted from resume."""
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None

@dataclass
class Experience:
    """Work experience information."""
    company: str
    position: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    duration: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    is_current: bool = False

@dataclass
class Education:
    """Education information."""
    institution: str
    degree: str
    field_of_study: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    gpa: Optional[str] = None
    location: Optional[str] = None

@dataclass
class Certification:
    """Certification information."""
    name: str
    issuing_organization: str
    issue_date: Optional[str] = None
    expiry_date: Optional[str] = None
    credential_id: Optional[str] = None

@dataclass
class ResumeData:
    """Complete structured resume data."""
    personal_info: PersonalInfo = field(default_factory=PersonalInfo)
    summary: Optional[str] = None
    skills: List[str] = field(default_factory=list)
    experience: List[Experience] = field(default_factory=list)
    education: List[Education] = field(default_factory=list)
    certifications: List[Certification] = field(default_factory=list)
    languages: List[str] = field(default_factory=list)
    projects: List[Dict] = field(default_factory=list)
    
    # Metadata
    raw_text: str = ""
    processed_at: datetime = field(default_factory=datetime.utcnow)
    confidence_score: float = 0.0
    
    def to_dict(self) -> Dict:
        """Convert ResumeData to dictionary for JSON serialization."""
        return {
            'personal_info': {
                'name': self.personal_info.name,
                'email': self.personal_info.email,
                'phone': self.personal_info.phone,
                'location': self.personal_info.location,
                'linkedin': self.personal_info.linkedin,
                'github': self.personal_info.github,
                'website': self.personal_info.website,
            },
            'summary': self.summary,
            'skills': self.skills,
            'experience': [
                {
                    'company': exp.company,
                    'position': exp.position,
                    'start_date': exp.start_date,
                    'end_date': exp.end_date,
                    'duration': exp.duration,
                    'description': exp.description,
                    'location': exp.location,
                    'is_current': exp.is_current
                } for exp in self.experience
            ],
            'education': [
                {
                    'institution': edu.institution,
                    'degree': edu.degree,
                    'field_of_study': edu.field_of_study,
                    'start_date': edu.start_date,
                    'end_date': edu.end_date,
                    'gpa': edu.gpa,
                    'location': edu.location
                } for edu in self.education
            ],
            'certifications': [
                {
                    'name': cert.name,
                    'issuing_organization': cert.issuing_organization,
                    'issue_date': cert.issue_date,
                    'expiry_date': cert.expiry_date,
                    'credential_id': cert.credential_id
                } for cert in self.certifications
            ],
            'languages': self.languages,
            'projects': self.projects,
            'processed_at': self.processed_at.isoformat(),
            'confidence_score': self.confidence_score
        }