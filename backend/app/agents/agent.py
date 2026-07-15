import os
import warnings
from datetime import datetime, timedelta

# LangGraph & LangChain Imports
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.tools import tool
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from langchain_groq import ChatGroq

# Database & Backend Imports
from app.database.database import SessionLocal
from app.schemas.interaction_schema import InteractionCreate, InteractionUpdate
from app.services.interaction_service import create_interaction, get_interactions, update_interaction

warnings.filterwarnings("ignore")
load_dotenv()

# ==========================================
# 1. DEFINE THE 5 LANGGRAPH TOOLS
# ==========================================

@tool
def log_interaction(hcp_name: str, hospital: str, notes: str) -> str:
    """
    Use this tool to save a new interaction/meeting with a Healthcare Professional (HCP) to the CRM database.
    Requires the HCP's name, the hospital/clinic, and the interaction notes.
    """
    db = SessionLocal()
    try:
        new_interaction = InteractionCreate(
            hcp_name=hcp_name,
            hospital=hospital,
            specialty="General",
            interaction_type="AI Logged",
            notes=notes,
            summary=notes[:100] + "..." if len(notes) > 100 else notes
        )
        saved_record = create_interaction(db, new_interaction)
        return f"Interaction with {hcp_name} has been successfully logged to the CRM with ID: {saved_record.id}."
    except Exception as e:
        return f"Error saving interaction: {str(e)}"
    finally:
        db.close()

@tool
def edit_interaction(interaction_id: int, new_notes: str) -> str:
    """
    Use this tool ONLY to edit or update an existing interaction's notes.
    Requires the interaction_id and the new_notes string.
    """
    db = SessionLocal()
    try:
        update_data = InteractionUpdate(notes=new_notes)
        updated_record = update_interaction(db, interaction_id, update_data)
        if updated_record:
            return f"Successfully updated interaction ID {interaction_id}."
        return f"Interaction ID {interaction_id} not found."
    except Exception as e:
        return f"Error updating interaction: {str(e)}"
    finally:
        db.close()

@tool
def search_history(hcp_name: str) -> str:
    """
    Use this tool to search the CRM database for past interactions with a specific Healthcare Professional (HCP).
    """
    db = SessionLocal()
    try:
        all_interactions = get_interactions(db)
        # Filter manually for the specific HCP name
        history = [i for i in all_interactions if hcp_name.lower() in i.hcp_name.lower()]
        
        if not history:
            return f"No previous interactions found for {hcp_name}."
        
        result_text = f"Found {len(history)} previous interaction(s) for {hcp_name}:\n"
        for idx, item in enumerate(history):
            result_text += f"{idx+1}. Date: {item.date} | Notes: {item.notes}\n"
        return result_text
    except Exception as e:
        return f"Error retrieving history: {str(e)}"
    finally:
        db.close()

@tool
def generate_summary(specialty: str) -> str:
    """
    Use this tool to get a summary of clinical talking points or guidelines for a specific medical specialty (e.g., Cardiology, Oncology).
    """
    summaries = {
        "Cardiology": "Discuss new clinical trial data on blood pressure efficacy and cognitive retention.",
        "Oncology": "Highlight targeted therapies and reduced side-effect profiles.",
        "Neurology": "Focus on neural retention metrics and patient quality of life improvements."
    }
    return summaries.get(specialty, "General talking points: Emphasize patient safety and drug efficacy.")

@tool
def schedule_followup(days_from_now: int) -> str:
    """
    Use this tool to schedule a follow-up reminder. Pass the number of days from today.
    """
    followup_date = datetime.now() + timedelta(days=days_from_now)
    return f"A follow-up meeting has been scheduled for {followup_date.strftime('%Y-%m-%d')}."

# ==========================================
# 2. ASSEMBLE TOOLS & INITIALIZE LLM
# ==========================================

crm_tools = [
    log_interaction,
    edit_interaction,
    search_history,
    generate_summary,
    schedule_followup
]

# Ensure Groq API Key is mapped (Required by assignment)
# If it's in your .env file, load_dotenv() will catch it. 
# Otherwise, uncomment the line below and paste it directly for testing.
# os.environ["GROQ_API_KEY"] = "YOUR_GROQ_API_KEY"

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0
)

# ==========================================
# 3. CONFIGURE AGENT PERSONA
# ==========================================

system_prompt = """
You are an AI-first CRM assistant for life science medical representatives.
Your job is to help reps manage their interactions with Healthcare Professionals (HCPs).
You have access to specific tools to log interactions, edit notes, search history, schedule follow-ups, and get summaries.
Always use the provided tools to fulfill the user's request. If you log an interaction, tell the user the CRM ID.
"""

crm_agent = create_react_agent(llm, tools=crm_tools)

# ==========================================
# 4. TERMINAL TESTING
# ==========================================

if __name__ == "__main__":
    print("Agent booting up...\n")
    
    # --- TEST 1: Log the interaction ---
    user_input_1 = "Please log that I met with Dr. Sarah Jenkins at City General Hospital today. We discussed the new cardiology drug efficacy rates. She seemed interested but wants to see more clinical trial data. Follow up next Tuesday."
    
    print(f"User: {user_input_1}")
    print("Agent is thinking...\n")
    
    messages_1 = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_input_1)
    ]
    result_1 = crm_agent.invoke({"messages": messages_1})
    print(f"Agent: {result_1['messages'][-1].content}\n")
    print("-" * 50, "\n")
    
    # --- TEST 2: Search the history ---
    user_input_2 = "Can you check my history with Dr. Sarah Jenkins?"
    
    print(f"User: {user_input_2}")
    print("Agent is thinking...\n")
    
    messages_2 = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_input_2)
    ]
    result_2 = crm_agent.invoke({"messages": messages_2})
    print(f"Agent: {result_2['messages'][-1].content}")