from fastapi import FastAPI, HTTPException
from validators.api_validator import ChatRequest
from services.rag_llm import query_chain


app = FastAPI(title='Rag-Me-Knowme API Endpoint', description='API Endpoint for Rag-Me AI Web App')

# Function for saving/append the LLM responses to a text file for analysis
def save_llm_response_to_disk(question: str, response: str):
    with open("LLM_Response_Store_File.txt", "a", encoding="utf-8") as f:
        temp = "## " + question
        f.write(temp)
        cleaned_response = response.replace("\n\n", "\n\t   ")
        temp = "\n\t - " + response
        f.write(temp)
        f.write("\n\n\n")


# Chat API end-point 
@app.post('/api/chat')
async def chat_endpoint(request: ChatRequest):
   
    try:
        print("[ - ] User response received at API endpoint...", end="\n\t")
        print("Request RAW data: ", request, end="\n\t")
        print("Extracted Question from API REQUEST: ", request.question, end="\n\t")
        print("Dictionary format: ", request.model_dump())

        print("[ - ] Finallly printing the LLM response from FastAPI function...")
        # llm_response = query_chain.invoke("Tell me about yourself.")
        llm_response = query_chain.invoke(str(request.question))

        # saving the llm response to a text file locally
        try:
            user_question = request.question
            llm_answer = llm_response
            save_llm_response_to_disk(user_question, llm_answer)
        except Exception as err:
            print("Error in saving LLm response to disk: ", str(err))

        ## finally returning the response to frontend
        return llm_response


    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# Entry-point code here
if __name__=="__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)