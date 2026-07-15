from sqlalchemy.orm import Session
from app.models.interaction import Interaction
from app.schemas.interaction_schema import InteractionCreate, InteractionUpdate

def get_interactions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Interaction).offset(skip).limit(limit).all()

def get_interaction_by_id(db: Session, interaction_id: int):
    return db.query(Interaction).filter(Interaction.id == interaction_id).first()

def create_interaction(db: Session, interaction_in: InteractionCreate):
    db_interaction = Interaction(**interaction_in.model_dump())
    db.add(db_interaction)
    db.commit()
    db.refresh(db_interaction)
    return db_interaction

def update_interaction(db: Session, interaction_id: int, interaction_in: InteractionUpdate):
    db_interaction = get_interaction_by_id(db, interaction_id)
    if not db_interaction:
        return None
    
    update_data = interaction_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_interaction, key, value)
        
    db.commit()
    db.refresh(db_interaction)
    return db_interaction

def delete_interaction(db: Session, interaction_id: int):
    db_interaction = get_interaction_by_id(db, interaction_id)
    if not db_interaction:
        return False
    db.delete(db_interaction)
    db.commit()
    return True