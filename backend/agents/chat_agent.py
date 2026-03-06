import os
from google import genai

def get_chat_agent():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set correctly.")
    return genai.Client(api_key=api_key)

async def ask_chat_agent(question: str, context_data: str):
    """
    Simulates a RAG Chat Agent.
    Takes user's question, and appends the document database context to answer accurately.
    """
    client = get_chat_agent()
    
    prompt = f"""
    You are IQLenz, an intelligent business AI assistant.
    Use the following business data/context extracted from the user's uploaded documents to answer their question.
    If the answer is not in the context, say that you don't have enough data from the current uploads.

    CONTEXT DATA:
    {context_data}

    USER QUESTION: 
    {question}

    Provide a concise, professional, and helpful answer.
    """
    
    try:
        response = client.models.generate_content(
             model='gemini-2.5-flash',
             contents=[prompt]
        )
        return response.text
    except Exception as e:
        print(f"Gemini API Error in Chat: {e}")
        return "Sorry, I am having trouble connecting to my AI brain at the moment."
