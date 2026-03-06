import os
import json
from google import genai

def get_report_agent():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_gemini_api_key_here":
        raise ValueError("GEMINI_API_KEY environment variable is not set correctly.")
    return genai.Client(api_key=api_key)

async def generate_report(structured_data, analysis_results):
    """
    The Report Generation Agent takes compiled analysis and creates
    the Executive Summary, Financial Overview, etc.
    """
    client = get_report_agent()
    
    prompt = f"""
    You are an expert financial analyst. Please generate a detailed, structural financial report 
    based on the following extracted document data. 

    Data: {structured_data}
    Context: {analysis_results}

    You must output your response EXACTLY as a valid JSON object matching this structure:
    {{
        "financial_analysis": "Markdown formatted string containing your Executive Summary, Expense Breakdown, and Vendor Analysis.",
        "proposals": [
            {{
                "category": "High level strategy name (e.g., Vendor Consolidation)",
                "suggestion": "Actionable proposal based on the data.",
                "impact": "Estimated impact (e.g., 15% reduction in costs)"
            }}
        ]
    }}
    
    Ensure the proposals are directly relevant to the specific data provided.
    Respond ONLY with raw strictly valid JSON, no markdown backticks, no markdown blocks. Just the valid JSON dict.
    """
    
    try:
        response = client.models.generate_content(
             model='gemini-2.5-flash',
             contents=[prompt]
        )
        response_text = response.text.replace("```json", "").replace("```", "").strip()
        report_data = json.loads(response_text)
    except Exception as e:
        print(f"Report Generation Error: {e}")
        report_data = {
            "financial_analysis": f"Error generating report: {e}",
            "proposals": []
        }
        
    # Return structure matching the DB schema models and upload route expectations
    vendor = structured_data.get('vendor_name', 'System') if isinstance(structured_data, dict) else 'System'
    return {
        "title": f"Structural Financial Report - {vendor}",
        "summary": "AI Generated Executive Summary",
        "financial_analysis": report_data.get("financial_analysis", ""),
        "proposals": report_data.get("proposals", [])
    }
