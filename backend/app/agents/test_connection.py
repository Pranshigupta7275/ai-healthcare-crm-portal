import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

# Load environment variables

load_dotenv()

def test_groq():
    print("Connecting to Groq...")
    
    # Initialize the LLM with the required model
    llm = ChatGroq(
        temperature=0,
        model_name="llama-3.3-70b-versatile",
        api_key=os.getenv("GROQ_API_KEY")
    )
    
    # Test the connection
    response = llm.invoke("Say exactly 'Hello' and nothing else.")
    print(f"AI Response: {response.content}")

if __name__ == "__main__":
    test_groq()