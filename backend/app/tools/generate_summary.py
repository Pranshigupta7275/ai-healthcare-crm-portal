from langchain_core.tools import tool

@tool
def generate_summary(specialty: str) -> str:
    """
    Use this tool to get a summary of clinical guidelines or key sales points for a specific medical specialty.
    """
    guidelines = {
        "cardiology": "Focus on efficacy rates, blood pressure reduction, and long-term cardiovascular outcomes.",
        "oncology": "Emphasize progression-free survival rates, side effect management, and clinical trial phases.",
        "neurology": "Highlight cognitive retention metrics and safety profiles."
    }
    return guidelines.get(specialty.lower(), "No specific guidelines available for this specialty. Focus on standard product benefits.")