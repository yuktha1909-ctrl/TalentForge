import pytest
from app.agents.scoring import score_candidate


def test_score_candidate_full_match():
    cand = ["python", "fastapi", "docker"]
    req = ["python", "fastapi", "docker"]
    assert score_candidate(cand, req) == 100.00


def test_score_candidate_partial_match():
    cand = ["python", "fastapi"]
    req = ["python", "fastapi", "sql"]
    # 2 / 3 = 66.6666... -> rounded to 66.67
    assert score_candidate(cand, req) == 66.67


def test_score_candidate_case_insensitive():
    cand = ["PyThOn", "FASTAPI", "Docker"]
    req = ["python", "fastapi", "docker", "aws"]
    # 3 / 4 = 75.00
    assert score_candidate(cand, req) == 75.00


def test_score_candidate_empty_candidate():
    cand = []
    req = ["python", "sql"]
    assert score_candidate(cand, req) == 0.00


def test_score_candidate_empty_required():
    cand = ["python", "sql"]
    req = []
    # Must handle without ZeroDivisionError
    assert score_candidate(cand, req) == 0.00


def test_score_candidate_both_empty():
    assert score_candidate([], []) == 0.00
