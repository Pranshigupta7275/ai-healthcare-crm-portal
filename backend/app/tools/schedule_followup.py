from langchain_core.tools import tool

@tool
def schedule_followup(hcp_name: str, days_from_now: int) -> str:
    """
    Use this tool to set a reminder to follow up with an HCP a certain number of days from today.
    """
    return f"Follow-up successfully scheduled for {hcp_name}, {days_from_now} days from today."