import logging
from typing import Dict, Any
from langgraph.graph import StateGraph, END, START
from app.agents.state import RecruitmentState
from app.agents.nodes import (
    parse_resume_node,
    match_candidate_node,
    generate_questions_node,
    evaluate_answers_node
)

logger = logging.getLogger(__name__)

# Build Screening & Matching Graph Pipeline
screening_workflow = StateGraph(RecruitmentState)
screening_workflow.add_node("parse_resume", parse_resume_node)
screening_workflow.add_node("match_candidate", match_candidate_node)
screening_workflow.add_node("generate_questions", generate_questions_node)

screening_workflow.add_edge(START, "parse_resume")
screening_workflow.add_edge("parse_resume", "match_candidate")
screening_workflow.add_edge("match_candidate", "generate_questions")
screening_workflow.add_edge("generate_questions", END)

recruitment_agent_graph = screening_workflow.compile()


# Build Interview Evaluation Graph Pipeline
evaluation_workflow = StateGraph(RecruitmentState)
evaluation_workflow.add_node("evaluate_answers", evaluate_answers_node)
evaluation_workflow.add_edge(START, "evaluate_answers")
evaluation_workflow.add_edge("evaluate_answers", END)

evaluation_agent_graph = evaluation_workflow.compile()


def run_screening_pipeline(initial_state: Dict[str, Any]) -> Dict[str, Any]:
    """Executes the full LangGraph screening and question generation agent pipeline."""
    logger.info(f"Starting LangGraph screening pipeline for candidate_id={initial_state.get('candidate_id')}")
    result = recruitment_agent_graph.invoke(initial_state)
    return result


def run_evaluation_pipeline(initial_state: Dict[str, Any]) -> Dict[str, Any]:
    """Executes the LangGraph interview answer evaluation agent pipeline."""
    logger.info(f"Starting LangGraph evaluation pipeline for candidate_id={initial_state.get('candidate_id')}")
    result = evaluation_agent_graph.invoke(initial_state)
    return result
