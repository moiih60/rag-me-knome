from pydantic import BaseModel

# For validating the request, other stuff in main.py FatsAPI code
class ChatRequest(BaseModel):
    message: str

