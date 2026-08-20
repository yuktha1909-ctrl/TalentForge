from typing import TypedDict, List, Dict, Any, Optional


class RecruitmentState(TypedDict):
    candidate_id: int
    job_id: int
    resume_text: str
    job_title: str
    job_requirements: str
    
    # Node 1 Output: Resume Parser
    parsed_skills: List[str]
    experience_years: int
    
    # Node 2 Output: Job Matcher
    match_score: float
    match_reasons: Dict[str, Any]
    
    # Node 3 Output: Question Generator
    interview_questions: List[Dict[str, Any]]
    
    # Node 4 Input & Output: Interview Evaluator
    candidate_answers: List[Dict[str, Any]]
    ai_feedback: str
    overall_rating: float
    
    # System Status
    error: Optional[str]
