from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Database imports
from app.database.database import engine
from app.models import interaction as models

# Route imports
from app.routes import interaction_routes

# AI Agent imports
from app.agents.agent import crm_agent, system_prompt
from langchain_core.messages import SystemMessage, HumanMessage
import warnings

warnings.filterwarnings("ignore")

# Initialize Database Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="HCP CRM Enterprise API")

# --- CORS CONFIGURATION ---
# Allows your React app (localhost:3000) to communicate with FastAPI (localhost:8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

# --- TASKS 31, 32, 33: INTERACTION ROUTES ---
# This mounts your GET, POST, and PUT routes from interaction_routes.py
app.include_router(interaction_routes.router, prefix="/api/interactions", tags=["Interactions"])


# --- TASK 34: AI CHAT ROUTE ---
# Defines the expected JSON payload from React
class ChatRequest(BaseModel):
    message: str

@app.post("/api/agent/chat", tags=["AI Agent"])
async def chat_with_agent(request: ChatRequest):
    """
    Receives a message from the React chat screen, passes it to the LangGraph 
    AI Agent, executes any necessary tools (like saving to the DB), and returns the text response.
    """
    try:
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=request.message)
        ]
        
        # Invoke the LangGraph agent
        result = crm_agent.invoke({"messages": messages})
        
        # Extract the final AI response string
        ai_response = result['messages'][-1].content
        
        return {"reply": ai_response}
    except Exception as e:
        return {"reply": f"An error occurred in the AI Agent: {str(e)}"}
    