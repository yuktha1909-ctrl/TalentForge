"""Candidate Keyword Match Scoring Module.

NOTE: This is a baseline rule-based keyword overlap scoring function that will later 
be replaced with embedding-based semantic similarity scoring (e.g., pgvector / OpenAI embeddings) 
in the Week 3-4 milestone.
"""

from typing import List


def score_candidate(candidate_keywords: List[str], required_keywords: List[str]) -> float:
    """Calculates percentage overlap between candidate keywords and required job keywords.
    
    Args:
        candidate_keywords: List of skills/keywords extracted from candidate resume.
        required_keywords: List of required skills specified in job posting.
        
    Returns:
        float: Percentage overlap score between 0.00 and 100.00, rounded to 2 decimal places.
        
    Note:
        This is a baseline keyword overlap implementation that will later be replaced 
        with embedding-based similarity scoring in the Week 3-4 milestone.
    """
    if not required_keywords:
        return 0.00

    # Normalize keywords to lowercase set for case-insensitive matching
    cand_set = {k.strip().lower() for k in candidate_keywords if k and k.strip()}
    req_set = {k.strip().lower() for k in required_keywords if k and k.strip()}

    if not req_set:
        return 0.00

    overlap_count = len(cand_set.intersection(req_set))
    percentage = (overlap_count / len(req_set)) * 100.0

    return round(percentage, 2)
