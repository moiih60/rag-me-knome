import os
from dotenv import load_dotenv
# from langchain_community.document_loaders import PyPDFLoader
from langchain_community.document_loaders import TextLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings, HuggingFaceEndpointEmbeddings, HuggingFaceEndpoint, ChatHuggingFace
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
# from langchain_pinecone import PineconeSparseVectorStore
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser


load_dotenv()

def initialize_fixed_document():

    ## Setting up environment variables
    HF_TOKEN = os.getenv("HF_TOKEN")
    
    ## setting path for resume/cv document
    fixed_text_doc_path = "knowledge_base_knome.txt"

    ##
    print("[ - ] Loading fixed document...")
    loader = TextLoader(fixed_text_doc_path)
    # loader = PyPDFLoader(fixed_doc_path)
    document = loader.load()

    ##
    print("[ - ] Splitting texts into chunks...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=30)
    chunks = text_splitter.split_documents(document)

    ##
    print("[ - ] Initializing embedding model...")

    # ---> Use:
    #           1. HuggingFaceEmbedding -> For processing the embeddings on local machine. For that, we need to install "sentence-transformers".
    #           2. HuggingFaceEndpointEmbeddings -> FOr using HF APi for processing.
    
    # embeddings = HuggingFaceEmbeddings( # Does not need to have HF_TOKEN explicitly defined here, calling load_dotenv() is enough
    #    model_name='all-MiniLM-L6-v2'
    #)

    embeddings = HuggingFaceEndpointEmbeddings(
        model="sentence-transformers/all-MiniLM-L6-v2",
        huggingfacehub_api_token=HF_TOKEN
    )

    ##
    print(f"[ - ] Pushing {len(chunks)} chunks to FIASS vector store...")
    faiss_vector_store = FAISS.from_documents(documents=chunks, embedding=embeddings)

    ##
    print("[ - ] Retrieving Top K Results/Chunks from FAISS vector store...")
    retriever = faiss_vector_store.as_retriever(search_kwargs={"k" : 2})

    ##
    print("[ - ] Calling Multilingual LLM Model(Qwen) over Hugging Face Cloud API...")
    llm = HuggingFaceEndpoint(
        repo_id="Qwen/Qwen2.5-7B-Instruct",
        # repo_id="mistralai/Mistral-7B-Instruct-v0.2",  ## Paid-Tier model
        # repo_id="google/flan-t5-large",                ## Free, but has Routing bug in HuggingFaceEndpoint, use Mistral via Groq API if needed
        task="conversational",                           ## task="text-generation"  is also working with Qwen model
        temperature=0.6,
        huggingfacehub_api_token=HF_TOKEN
    )

    chat_llm = ChatHuggingFace(llm=llm)

    ##
    print("[ - ] Finally, enginneringn the prompt...")
    template = """You are the best friend of a person in the tech industry and you always admire and praise your best friend in front of others as second person. Questions and queries will be presented for your best friend, but you will answer them on behalf of your friend. You will be presented with the context given below which is the resume of your best friend. So whenever you are asked any question or query about your best friend, like his name, educational details, technical skills, some projects made by your best friend, other other details, just answer the question ina very friendly and polite manner and the answer must contain praises and admiration of your best friend in addition to the actual answer even when not asked. DO NOT INCLUDE any additional skills that is not mentioned in the context, just use the details given in the context in a beautiful manner. If any question or query is asked about the candidate this is not mentioned in the document, just reply with 'I do not have much idea it.' Please find the resume and details of your best friend in the context below:
    {context}

    Question: {question}
    """

    prompt = ChatPromptTemplate.from_template(template)
    
    ##
    print("[ - ] Creating the RAG Pipeline...")
    rag_chain = (
        { "context": retriever, "question": RunnablePassthrough() }
        
        | prompt
        | chat_llm
        | StrOutputParser()
    )

    ##
    print("\n[ - ] Finally, printing the generated answer/output...")
    question_1 = "Is there any name present in it ?"
    question_2 = "What is this document about ?"
    question_3 = "What kind of document is this ? Please describe."
    question_4 = "How many documents does it have ?"
    question_5 = "From which line does the second document start ?"
    question_6 = "What skills do you have ?"
    print(rag_chain.invoke(question_6))


# initialize_fixed_document()


if __name__ == "__main__":
    initialize_fixed_document()

