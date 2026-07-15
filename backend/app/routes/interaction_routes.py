from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.schemas import interaction_schema
from app.services import interaction_service

router = APIRouter()

# Task 32: POST - Create Interaction
@router.post("/", response_model=interaction_schema.InteractionResponse)
def create_interaction(interaction: interaction_schema.InteractionCreate, db: Session = Depends(get_db)):
    return interaction_service.create_interaction(db=db, interaction_in=interaction)

# Task 31: GET - Show Interactions
@router.get("/", response_model=List[interaction_schema.InteractionResponse])
def read_interactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return interaction_service.get_interactions(db=db, skip=skip, limit=limit)

# Task 33: PUT - Edit Interaction
@router.put("/{interaction_id}", response_model=interaction_schema.InteractionResponse)
def update_interaction(interaction_id: int, interaction: interaction_schema.InteractionUpdate, db: Session = Depends(get_db)):
    updated = interaction_service.update_interaction(db=db, interaction_id=interaction_id, update_data=interaction)
    if not updated:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return updated