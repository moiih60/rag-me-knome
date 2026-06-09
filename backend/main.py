from fastapi import FastAPI, HTTPException
from validators.api_validator import ChatRequest
from services.rag_llm import query_chain


app = FastAPI(title='Rag-Me-Knowme API Endpoint', description='API Endpoint for Rag-Me AI Web App')


@app.post('/api/chat')
async def chat_endpoint(request: ChatRequest):
    try:

        print("[ - ] User response received at API endpoint...\t")
        print("Pydantic object: ", request, end="\n\t")
        print("Dictionary data: ", request.model_dump())

        print("[ - ] Finallly printing the LLM response from FastAPI function...")
        llm_response = query_chain.invoke("Tell me about yourself.")
        return llm_response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__=="__main__":
    import uvicorn
    uvicorn.run("main.py:app", host="0.0.0.0", port=8000, reload=True)