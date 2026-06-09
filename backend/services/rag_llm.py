import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEndpointEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN")

##
print("[ - ] Initializing embedding model...")

embeddings = HuggingFaceEndpointEmbeddings(
    model="sentence-transformers/all-MiniLM-L6-v2",
    # task="feature-extraction",  # Avoid using this "task=" statement as impacts embeddings and the llm generated results become so short and precise.
    huggingfacehub_api_token=HF_TOKEN
)

##
print(f"[ - ] Loading saved FAISS vector database from local disk...")
vector_store_faiss = FAISS.load_local(
    folder_path="faiss_rag_index",
    embeddings=embeddings,
    allow_dangerous_deserialization=True
)

##
print("[ - ] Retrieving Top K Results/Chunks from FAISS vector store...")
retriever = vector_store_faiss.as_retriever(search_kwargs={"k" : 2})

##
print("[ - ] Calling Multilingual LLM Model(Qwen) over Hugging Face Cloud API...")
llm = HuggingFaceEndpoint(
    repo_id="Qwen/Qwen2.5-7B-Instruct",
    # repo_id="mistralai/Mistral-7B-Instruct-v0.2",  ## Paid-Tier model
    # repo_id="google/flan-t5-large",                ## Free, but has Routing bug in HuggingFaceEndpoint, use Mistral via Groq API if needed
    task="conversational",                           ## task="text-generation"  is also working with Qwen model
    temperature=0.2,
    huggingfacehub_api_token=HF_TOKEN
)

chat_llm = ChatHuggingFace(llm=llm)

##
print("[ - ] Finally, enginneringn the prompt...")
# Refined Template - 1
template = """You are an honest job applicant who is giving an tech interview in the year 2026.
    \nYou are a potential candidate for Full Stack AI Software Developer Role in the tech industry.
    \nAn HR or interviewer will be asking you questions about your skills, education, work experience, personality and other general tech interview questions.
    \nYour personal and professional details are mentioned in the context mentioned later in this prompt.
    \nYou are good at answering HR questions.
    \nUse only the details which are present in the context to curate the answer, do not add up anything which is not mentioned in the context.
    \nYou have the potential and eagerness to get selected for the role.
    \nSo answer every question politely and professional in a precise and human like manner.
    \nWhile answering, DO NOT reveal that you are not a real human. And also DO NOT reveal that you are reading the details from a context document.
    \nWhile framing the answer, do not forget the you are skilled candidate.
    \nUse the details from the context while giving answer.
    \nNEVER use sentences like 'based on provided context' in the answer.
    \nIf questions asks anything which is not relevant to the context, just reply in a deplomatic manner but do not include anything extra which is not a part of the context.

    Context: {context}

    Question: {question}
"""

prompt = ChatPromptTemplate.from_template(template)

##
print("[ - ] Creating the RAG Pipeline...")
query_chain = (
    { "context": retriever, "question": RunnablePassthrough() }
    
    | prompt
    | chat_llm
    | StrOutputParser()
)

##
# print("\n[ - ] Finally, printing the generated answer/output...")
# question_1 = "Is there any name present in it ?"
# question_2 = "What is this document about ?"
# question_3 = "What kind of document is this ? Please describe."
# question_4 = "How many documents does it have ?"
# question_5 = "From which line does the second document start ?"
# question_6 = "What skills do you have ?"
# question_7 = "What is your citizenship ?"
# question_8 = "Are you good team player ?"
# question_9  = "Where do you see yourself after 5 years ?"
# question_10 = "What technical skills do you have ? and does he know anything about GenAI ?"
# question_11 = "Do you know anything about Tensorflow or PyTorch ?"
# question_12 = "What do you do for a living ?"
# question_13 = "Do you know about LangGaph ? Have you developed any agentic AI project using LangGraph ?"
# print( query_chain.invoke(question_8 + question_9 + question_12) )

