import pytest
from app.agents.resume_parser import extract_keywords, extract_text


def test_extract_keywords_sample_1():
    sample_text = """
    John Doe — Senior Backend Developer
    Experienced software engineer with 5 years building microservices in Python using FastAPI.
    Proficient in SQL database optimization, Docker containerization, and AWS deployment.
    """
    keywords = extract_keywords(sample_text)
    assert "python" in keywords
    assert "fastapi" in keywords
    assert "sql" in keywords
    assert "docker" in keywords
    assert "aws" in keywords
    assert "java" not in keywords
    assert "react" not in keywords


def test_extract_keywords_sample_2():
    sample_text = """
    Jane Smith — Full Stack Developer
    Specialized in React, JavaScript, and Node.js applications.
    Hands-on experience managing cluster deployments with Kubernetes and LangChain integrations.
    """
    keywords = extract_keywords(sample_text)
    assert "react" in keywords
    assert "javascript" in keywords
    assert "kubernetes" in keywords
    assert "langchain" in keywords
    assert "python" not in keywords


def test_extract_keywords_case_insensitive():
    sample_text = "Skills: PyThOn, JaVa, FASTAPI, and ReAcT."
    keywords = extract_keywords(sample_text)
    assert keywords == ["fastapi", "java", "python", "react"]


def test_extract_text_unsupported_format(tmp_path):
    invalid_file = tmp_path / "resume.txt"
    invalid_file.write_text("Sample resume content")

    with pytest.raises(ValueError) as exc_info:
        extract_text(str(invalid_file))

    assert "Unsupported file format '.txt'" in str(exc_info.value)
