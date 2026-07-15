from langchain_core.tools import tool
from app.agents.extractor import extract_hcp_data
from app.services.interaction_service import create_interaction
from app.schemas.interaction_schema import InteractionCreate
from app.database.database import SessionLocal

@tool
def log_interaction(raw_text: str) -> str:
    """
    Use this tool to capture and log a new interaction with an HCP. 
    It takes raw conversational text, extracts the structured data, and saves it to the CRM database.
    """
    extracted = extract_hcp_data(raw_text)
    
    interaction_data = InteractionCreate(
        hcp_name=extracted.get("hcp_name", "Unknown HCP"),
        hospital=extracted.get("hospital", "Unknown Hospital"),
        specialty="General", 
        interaction_type="Chat Bot Log",
        notes=", ".join(extracted.get("topics", [])),
        summary=extracted.get("summary", "")
    )
    
    db = SessionLocal()
    try:
        created = create_interaction(db, interaction_data)
        return f"Successfully logged interaction! CRM ID: {created.id}. Summary: {created.summary}"
    except Exception as e:
        return f"Error logging interaction: {str(e)}"
    finally:
        db.close()