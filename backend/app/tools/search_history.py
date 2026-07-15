from langchain_core.tools import tool
from app.services.interaction_service import get_interactions
from app.database.database import SessionLocal

@tool
def search_history(hcp_name: str) -> str:
    """
    Use this tool to retrieve a history of past interactions with a specific Healthcare Professional (HCP).
    Pass the HCP's name to see what was discussed previously to prepare for a new meeting.
    """
    db = SessionLocal()
    try:
        all_interactions = get_interactions(db)
        hcp_history = [i for i in all_interactions if hcp_name.lower() in i.hcp_name.lower()]
        
        if not hcp_history:
            return f"No previous CRM records found for {hcp_name}."
            
        history_details = [f"[{i.created_at.date()}] {i.interaction_type}: {i.summary}" for i in hcp_history]
        return f"Found {len(hcp_history)} interactions for {hcp_name}:\n" + "\n".join(history_details)
    finally:
        db.close()