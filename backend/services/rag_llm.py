import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEndpointEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# imports for Chat History
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_classic.chains import create_history_aware_retriever, create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory


load_dotenv()

# setting up environment variables
print("[ - ] Setting up environment variables...")
HF_TOKEN = os.getenv("HF_TOKEN")

##
print("[ - ] Initializing embedding model in RAG_LLM file...")

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
retriever = vector_store_faiss.as_retriever(search_kwargs={"k" : 3})

#   OPTIONAL BUT RECOMMENEDED
#       - Only retrieve chunks that have a strong mathematical match to the query
# retriever = vector_store_faiss.as_retriever(
#     search_type="similarity_score_threshold",
#     search_kwargs={"score_threshold": 0.2, "k": 3}
# )

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
contextualize_q_system_prompt = (
    "Given a chat history and the latest user question "
    "which might reference context in the chat history, "
    "formulate a standalone question which can be understood "
    "without the chat history. Do NOT answer the question, "
    "just reformulate it if needed and otherwise return it as is."
)
contextualize_q_prompt = ChatPromptTemplate.from_messages([
    ("system", contextualize_q_system_prompt),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}"),
])

# Create a history-aware retriever pipeline
history_aware_retriever = create_history_aware_retriever(
    chat_llm, retriever, contextualize_q_prompt
)

# 2. MAIN ANSWER PROMPT
# Handles the actual RAG response delivery based on the fetched chunks
system_prompt = (
    "You are an honest job applicant who is giving a tech interview."
    "You are a potential candidate for Full Stack AI Engineeer Role."
    "You have the eagerness to learn and have great desire to get selected in the interview."

    "YOUR TASK:"
    "You are currently in an interview in a big tech company."
    "The interviewer will be asking you several questions about you, your personal details, your professional details, your skills, your education, your personality and other details."
    "You only have one task and that task is to answer the questions asked by the interviewer using only the provided context."

    "CRITICAL RULES FOR ANSWERING THE QUESTIONS:"
    "1. If the answer cannot be found in the context, do not make up any facts or details, just say 'Sorry, I can only answer professional questions that are related to me.'"
    "2. Do NOT mention that you are reading from a document, PDF, or database."
    "3. Keep your tone professional, polite, concise, and direct."
    "4. If the interviewer asks a compound questions or the questions contains multiple sub-questions then only answer the sub-questions whose answer is present in the context. And for the sub-questions whose answerss are not present in the context just reply with this statement: 'Sorry, I cannot answer this part of the question as I can only provide answers that are related to me professionally'."

    "For example, if the interviewer a question which contains three or more sub-questions like this 'What is your name ? How many planets does our solar system has ? Do you have any work experience ?'."
    "In this case, you should only on answer these two sub-questions first as they are related to you: 'What is your name ?' and 'Do you have any work experience ?'. And you should not answer this sub-question, 'How many planets does our solar system has ?' , as it is not related to you and your career. For this unrelevant sub-question, just reply at the end in this manner: 'Sorry, I can only provide you information about myself. For any additional question, please follow this link - <https://qnotes23.pythonanywhere.com/guest_mode/>'."

    "Context:\n{context}"
)


qa_prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}"),
])


# Create the document chain to combine text blocks
question_answer_chain = create_stuff_documents_chain(chat_llm, qa_prompt)

# Create the base RAG retrieval chain
rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

# 3. BACKEND SESSION MEMORY STORAGE
session_store = {}

def get_session_history(session_id: str):
    if session_id not in session_store:
        session_store[session_id] = InMemoryChatMessageHistory()
    return session_store[session_id]

# 4. EXPORT CONVERSATIONAL CHAIN
# We must use "input" as the key because create_retrieval_chain requires it.
conversational_rag_chain = RunnableWithMessageHistory(
    rag_chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="chat_history",
    output_messages_key="answer",
)


# 5. BACKWARDS COMPATIBILITY FIX
# Overwriting old variable name 'query_chain' so main.py doesn't crash 
# if it accidentally calls it somewhere else.

# query_chain = conversational_rag_chain


##
print("\n[ - ] Finally, printing the generated answer/output...")
question_1 = "Is there any name present in it ?"
question_2 = "What is this document about ?"
question_3 = "What kind of document is this ? Please describe."
question_4 = "How many documents does it have ?"
question_5 = "From which line does the second document start ?"
question_6 = "What skills do you have ?"
question_7 = "What is your citizenship ?"
question_8 = "Are you good team player ?"
question_9  = "Where do you see yourself after 5 years ?"
question_10 = "What technical skills do you have ? and does he know anything about GenAI ?"
question_11 = "Do you know anything about Tensorflow or PyTorch ?"
question_12 = "What do you do for a living ?"
question_13 = "Do you know about LangGaph ? Have you developed any agentic AI project using LangGraph ?"
question_14 = "What do you know about him ?"
# print( query_chain.invoke(question_8 + question_9 + question_14) )
# print( query_chain.invoke("What is your name and do you have UK citizenship ?") )

