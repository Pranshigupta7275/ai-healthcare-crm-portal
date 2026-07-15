from langchain_core.tools import tool
from app.services.interaction_service import update_interaction
from app.schemas.interaction_schema import InteractionUpdate
from app.database.database import SessionLocal

@tool
def edit_interaction(interaction_id: int, new_notes: str) -> str:
    """
    Use this tool to modify or add notes to an existing logged interaction.
    Requires the interaction_id (integer) and the new_notes (string) to update.
    """
    db = SessionLocal()
    try:
        update_data = InteractionUpdate(notes=new_notes)
        updated = update_interaction(db, interaction_id, update_data)
        if updated:
            return f"Successfully updated interaction ID {interaction_id} with new notes."
        return f"Interaction ID {interaction_id} not found in the CRM."
    finally:
        db.close()