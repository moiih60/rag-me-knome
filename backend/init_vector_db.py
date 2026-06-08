import os
from dotenv import load_dotenv
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEndpointEmbeddings
from langchain_community.vectorstores import FAISS

# loading the environment variables
load_dotenv()

def build_fixed_vector_store():

    ## Setting up environment variables
    HF_TOKEN = os.getenv("HF_TOKEN")

    ## setting path for resume/cv document
    fixed_doc_path = "knowledge_base_knome.txt"

    ##
    print("[ - ] Loading fixed document...")
    loader = TextLoader(fixed_doc_path, encoding="utf-8")
    document = loader.load()

    ##
    print("[ - ] Splitting texts into chunks...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=30)
    chunks = text_splitter.split_documents(document)

    ##
    print("[ - ] Initializing embedding model...")
    embeddings = HuggingFaceEndpointEmbeddings(
        model="sentence-transformers/all-MiniLM-L6-v2",
        huggingfacehub_api_token=HF_TOKEN
    )

    ##
    print(f"[ - ] Pushing {len(chunks)} chunks to FIASS vector store...")
    vector_store = FAISS.from_documents(documents=chunks, embedding=embeddings)
    # saving the vector db data locally
    vector_store.save_local("faiss_rag_index")

    ##
    print("[ - ] Getting the local absolute path of the FAISS index...")
    faiss_index_path = os.path.abspath("faiss_rag_index")
    print(f"\tDatabase built successfully at: {faiss_index_path}")


if __name__ == "__main__":
    build_fixed_vector_store()
