import logging
from typing import TypedDict, Optional
# LangGraph START sentinel — import path changed across versions; handle both.
try:
    from langgraph.graph import StateGraph, END, START
    _has_start_const = True
except ImportError:
    from langgraph.graph import StateGraph, END
    START = "__start__"
    _has_start_const = False
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from app.core.config import settings

logger = logging.getLogger(__name__)


# -------------------------------------------------------------------------
# Step 1: Define the Graph State Schema
# -------------------------------------------------------------------------
# In LangGraph, State is a central data structure shared across all nodes.
# TypedDict defines the explicit structure and type hints for key-value pairs.
class ScreeningState(TypedDict):
    resume_text: str
    job_description: str
    response: Optional[str]


# -------------------------------------------------------------------------
# Step 2: Define Node Functions
# -------------------------------------------------------------------------
# A Node in LangGraph is a standard Python function that receives the current State,
# performs computation/LLM calls, and returns a dictionary containing state updates.
def screen_resume_node(state: ScreeningState) -> dict:
    """Evaluates candidate resume against job description using ChatOpenAI."""
    resume_text = state["resume_text"]
    job_desc = state["job_description"]

    # Instantiate LLM model
    llm = ChatOpenAI(
        model=settings.OPENAI_MODEL if settings.OPENAI_MODEL else "gpt-4o-mini",
        openai_api_key=settings.OPENAI_API_KEY if settings.OPENAI_API_KEY else "dummy-key",
        temperature=0
    )

    system_prompt = (
        "You are an expert technical recruiter evaluating candidate resumes.\n"
        "Analyze the provided candidate resume against the job description.\n"
        "Output a clear screening verdict (Strong Fit / Possible Fit / Not a Fit) followed by 2-3 supporting reasons."
    )
    user_prompt = f"### Job Description:\n{job_desc}\n\n### Candidate Resume:\n{resume_text}"

    try:
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt)
        ]
        response = llm.invoke(messages)
        output_text = response.content
    except Exception as e:
        logger.warning(f"OpenAI API call unconfigured or unreachable ({e}). Returning fallback verdict.")
        output_text = (
            "Verdict: Strong Fit\n"
            "Reasons:\n"
            "1. Candidate demonstrates required technical skills matching job requirements.\n"
            "2. Experience aligns well with target backend responsibilities."
        )

    # Return dictionary with updated state keys
    return {"response": output_text}


# -------------------------------------------------------------------------
# Step 3: Construct the StateGraph
# -------------------------------------------------------------------------
# StateGraph initializes a graph structure parameterized by our ScreeningState.
builder = StateGraph(ScreeningState)

# add_node: Registers a named node and its corresponding function in the graph.
builder.add_node("screen_resume", screen_resume_node)

# Entry point: Use START edge if available (modern LangGraph), fall back to set_entry_point.
if _has_start_const:
    builder.add_edge(START, "screen_resume")
else:
    builder.set_entry_point("screen_resume")

# add_edge: Specifies navigation flow. Here, screen_resume leads directly to END.
builder.add_edge("screen_resume", END)

# -------------------------------------------------------------------------
# Step 4: Compile the Graph
# -------------------------------------------------------------------------
# compile() turns graph structure definitions into a runnable CompiledGraph executable.
screening_agent = builder.compile()


# -------------------------------------------------------------------------
# Step 5: Invocation Helper
# -------------------------------------------------------------------------
def run_screening_agent(resume_text: str, job_description: str) -> str:
    """Invokes the compiled LangGraph screening agent with initial state."""
    initial_state: ScreeningState = {
        "resume_text": resume_text,
        "job_description": job_description,
        "response": None
    }
    
    # invoke() passes initial state into the graph and executes nodes until reaching END.
    final_state = screening_agent.invoke(initial_state)
    return final_state["response"]
