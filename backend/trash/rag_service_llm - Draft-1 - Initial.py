import os
from dotenv import load_dotenv
# from langchain_community.document_loaders import PyPDFLoader
from langchain_community.document_loaders import TextLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings, HuggingFaceEndpoint
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
# from langchain_pinecone import PineconeSparseVectorStore
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser


load_dotenv()

def initialize_fixed_document():
    
    # setting path for resume/cv document
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
    embeddings = HuggingFaceEmbeddings(model_name='sentence-transformer/all-MiniLM-L6-v2')

    ##
    print(f"[ - ] Pushing {len(chunks)} chunks to FIASS vector store...")
    faiss_vector_store = FAISS.from_texts(texts=chunks, embedding=embeddings)

    ##
    print("[ - ] Retrieving Top K Results/Chunks from FAISS vector store...")
    retriever = faiss_vector_store.as_retriever(search_kwargs={"k" : 2})

    ##
    print("[ - ] Calling Multilingual LLM(Qwen) over Hugging Face Cloud API...")
    llm = HuggingFaceEndpoint(
        repo_id="Qwen/Qwen2.5-1.5B-Instruct",
        task="text-generation",
        temperature=0.1,
        huggingfacehub_api_token=os.getenv("HF_TOKEN")
    )

    ##
    print("[ - ] Finally, enginneringn the prompt...")
    template = """You are a helpful assistant. Answer the questions based only on the context provided below:
    {context}

    Question: {question}
    """

    prompt = ChatPromptTemplate.from_template(template)
    
    ##
    print("[ - ] Creating the RAG Pipeline...")
    rag_chain = (
        { "context": retriever, "question": RunnablePassthrough() }
        
        | prompt
        | llm
        | StrOutputParser
    )

    ##
    print("\n[ - ] Finally, printing the generated answer/output...")
    print(rag_chain.invoke("What kind of document is this ?"))


initialize_fixed_document()


# if __name__ == "__main__":
#     initialize_fixed_document()

