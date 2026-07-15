# 🚀 AI Healthcare CRM Portal

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-Agentic_AI-black?style=for-the-badge)
![Groq](https://img.shields.io/badge/Meta_Llama_3.1-Groq-f37b58?style=for-the-badge)

An enterprise-grade, full-stack CRM application featuring an autonomous **LangGraph AI Agent** that automates database workflows through natural language processing. 

Built to eliminate manual data entry for Medical Representatives tracking Healthcare Professional (HCP) interactions, this portal bridges the gap between robust, traditional web architecture and next-generation LLM tool-calling capabilities.

---

## 🧠 System Architecture & AI Workflow

Instead of a traditional form-based entry system, users input conversational meeting summaries. The backend utilizes a directed acyclic graph (via LangGraph) to orchestrate the LLM, parse the unstructured text, and execute database operations autonomously.

```mermaid
graph TD
    %% Define Nodes
    UI[🖥️ React UI / Redux]
    API[⚙️ FastAPI Router]
    Graph{🧠 LangGraph Orchestrator}
    LLM[⚡ Groq API / Llama 3.1]
    Tools[🔧 Python Tool Nodes]
    DB[(🗄️ PostgreSQL)]

    %% Define Flow
    UI -->|1. Natural Language Chat| API
    API -->|2. Pass Context| Graph
    Graph -->|3. Analyze Intent| LLM
    LLM -.->|4. Request Tool Call| Graph
    Graph -->|5. Extract Entities| Tools
    Tools -->|6. Validate Pydantic Schema| DB
    DB -->|7. Confirm Insertion| Tools
    Tools -->|8. Formulate Response| LLM
    LLM -->|9. Final Output| UI
    
    %% Styling
    classDef frontend fill:#20232A,stroke:#61DAFB,stroke-width:2px,color:#fff;
    classDef backend fill:#005571,stroke:#059669,stroke-width:2px,color:#fff;
    classDef ai fill:#2d3748,stroke:#f37b58,stroke-width:2px,color:#fff;
    classDef database fill:#316192,stroke:#fff,stroke-width:2px,color:#fff;

    class UI frontend;
    class API,Tools backend;
    class Graph,LLM ai;
    class DB database;
✨ Key Engineering FeaturesAgentic Tool Calling: Implemented a LangGraph state machine that maps unstructured clinical chat inputs to strictly typed database insertion tools.Low-Latency LLM Inference: Integrated the Groq API running Meta's Llama 3.1 to ensure the AI interactions feel real-time and conversational.Predictable State Management: Utilized Redux Toolkit to ensure the UI dashboard instantly reflects database changes triggered by the AI agent without requiring manual page refreshes.Scalable API Architecture: Built with FastAPI, featuring asynchronous endpoints, dependency injection, and strict Pydantic models for high-performance data validation.Relational Data Integrity: Engineered utilizing SQLAlchemy ORM to securely manage and link HCP interaction logs within a PostgreSQL database.💻 Tech StackDomainTechnologies UsedFrontendReact.js, Redux Toolkit, Tailwind CSS, AxiosBackendPython, FastAPI, SQLAlchemy, UvicornAI / NLPLangChain, LangGraph, Groq API (Llama 3.1)DatabasePostgreSQL🚀 Getting Started (Local Development)1. Clone the RepositoryBashgit clone [https://github.com/Pranshigupta7275/ai-healthcare-crm-portal.git](https://github.com/Pranshigupta7275/ai-healthcare-crm-portal.git)
cd ai-healthcare-crm-portal
2. Environment VariablesCreate a .env file in the backend/ directory and add your credentials (see backend/.env.example for reference):Code snippetDATABASE_URL=postgresql://user:password@localhost:5432/yourdb
GROQ_API_KEY=your_groq_api_key_here
3. Start the FastAPI BackendBashcd backend
python -m venv venv
source venv/Scripts/activate  # On Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
The API will be available at http://localhost:8000/docs4. Start the React FrontendBashcd frontend
npm install
npm start
The UI will be available at http://localhost:3000Developed for modern healthcare workflow optimization.
