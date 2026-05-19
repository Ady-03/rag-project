from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from groq import Groq
import os
from dotenv import load_dotenv
load_dotenv()

CHROMA_PATH = "chroma_db"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def query_pdf(question: str, collection_name: str):
    # 1. Embed the question
    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
    vectorstore = Chroma(
        collection_name=collection_name,
        embedding_function=embeddings,
        persist_directory=CHROMA_PATH
    )

    # 2. Find top 4 relevant chunks
    chunks = vectorstore.similarity_search(question, k=4)
    context = "\n\n".join([c.page_content for c in chunks])

    # 3. Ask Groq
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "Answer using only the context provided. If answer is not in context, say so."},
            {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {question}"}
        ]
    )

    return {
        "answer": response.choices[0].message.content,
        "sources": [c.page_content[:200] for c in chunks]
    }