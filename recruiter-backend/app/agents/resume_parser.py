import os
import re
import logging
from typing import List, Optional

logger = logging.getLogger(__name__)

# Predefined target skills list
DEFAULT_SKILLS = [
    "python", "java", "react", "sql", "aws",
    "docker", "fastapi", "langchain", "javascript",
    "node", "kubernetes"
]

_nlp = None


def _get_spacy_nlp():
    """Lazy load spaCy en_core_web_sm pipeline with fallback."""
    global _nlp
    if _nlp is None:
        try:
            import spacy
            try:
                _nlp = spacy.load("en_core_web_sm")
            except OSError:
                logger.warning("spaCy model 'en_core_web_sm' not found. Using blank English model.")
                _nlp = spacy.blank("en")
        except Exception as e:
            logger.warning(f"Failed to load spaCy ({e}). Fallback to token matching.")
            _nlp = None
    return _nlp


def extract_text(file_path: str) -> str:
    """Detects .pdf vs .docx and extracts raw text using pdfplumber or python-docx.
    
    Raises ValueError for unsupported file formats.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".pdf":
        try:
            import pdfplumber
            text_parts = []
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text_parts.append(page_text)
            return "\n".join(text_parts)
        except Exception as e:
            raise RuntimeError(f"Failed to extract text from PDF file: {e}") from e

    elif ext == ".docx":
        try:
            import docx
            doc = docx.Document(file_path)
            text_parts = [p.text for p in doc.paragraphs if p.text.strip()]
            return "\n".join(text_parts)
        except Exception as e:
            raise RuntimeError(f"Failed to extract text from DOCX file: {e}") from e

    else:
        raise ValueError(
            f"Unsupported file format '{ext}'. Only '.pdf' and '.docx' files are supported."
        )


def extract_keywords(text: str, skills_list: Optional[List[str]] = None) -> List[str]:
    """Uses spaCy tokenization & regex matching to find mentions of target skills in text.
    
    Returns a deduplicated list of matched skills (case-insensitive).
    """
    if not text or not text.strip():
        return []

    target_skills = skills_list if skills_list else DEFAULT_SKILLS
    nlp = _get_spacy_nlp()
    
    found_skills = set()
    lowercased_text = text.lower()

    if nlp:
        doc = nlp(lowercased_text)
        token_texts = {token.text for token in doc}
        doc_text = doc.text

        for skill in target_skills:
            skill_lower = skill.lower()
            # Match multi-word or single-word skills via word boundaries
            pattern = r"\b" + re.escape(skill_lower) + r"\b"
            if skill_lower in token_texts or re.search(pattern, doc_text):
                found_skills.add(skill_lower)
    else:
        for skill in target_skills:
            skill_lower = skill.lower()
            pattern = r"\b" + re.escape(skill_lower) + r"\b"
            if re.search(pattern, lowercased_text):
                found_skills.add(skill_lower)

    return sorted(list(found_skills))
