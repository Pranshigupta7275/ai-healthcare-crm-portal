from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_groq import ChatGroq
from pydantic import BaseModel, Field
from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

# TASK 14: Create Parser (Pydantic Schema defines the JSON structure)
class InteractionExtraction(BaseModel):
    hcp_name: str = Field(description="Name of the Healthcare Professional (HCP)")
    hospital: str = Field(description="Hospital or clinic name")
    topics: List[str] = Field(description="List of medical or sales topics discussed")
    follow_up: Optional[str] = Field(description="Follow-up date or action, if mentioned")
    summary: str = Field(description="Brief 2-3 sentence summary of the interaction")

# Initialize the parser
parser = JsonOutputParser(pydantic_object=InteractionExtraction)

# TASK 13: Create Prompt
extraction_prompt = PromptTemplate(
    template="""
    You are an AI assistant for life science medical representatives. 
    Extract the required information from the following interaction log.
    
    {format_instructions}
    
    Interaction Log:
    {interaction_text}
    """,
    input_variables=["interaction_text"],
    partial_variables={"format_instructions": parser.get_format_instructions()},
)

# Initialize LLM with the active Groq model
llm = ChatGroq(
    temperature=0,
    model_name="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY")
)

# Combine into a LangChain runnable chain (Prompt -> LLM -> Parser)
extraction_chain = extraction_prompt | llm | parser

def extract_hcp_data(text: str) -> dict:
    """
    Takes raw conversational text and returns a structured Python dictionary.
    """
    result = extraction_chain.invoke({"interaction_text": text})
    return result

# --- Quick Test ---
if __name__ == "__main__":
    sample_text = "Met with Dr. Sarah Jenkins at City General Hospital today. We discussed the new cardiology drug efficacy rates. She seemed interested but wants to see more clinical trial data. Need to follow up with her next week on Tuesday with the PDF reports."
    
    print("Extracting data via Llama-3.3-70b-versatile...")
    parsed_data = extract_hcp_data(sample_text)
    
    print("\n--- Parsed Python Dictionary ---")
    print(parsed_data)
    print(f"\nType: {type(parsed_data)}")