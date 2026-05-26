from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()
CHROMA_PATH = "chroma_db"
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def query_pdf(question: str, collection_name: str):
    embeddings = GoogleGenerativeAIEmbeddings(
        google_api_key=os.getenv("GOOGLE_API_KEY"),
        model="models/embedding-001"
    )

    vectorstore = Chroma(
        collection_name=collection_name,
        embedding_function=embeddings,
        persist_directory=CHROMA_PATH
    )

    chunks = vectorstore.similarity_search(question, k=4)
    context = "\n\n".join([c.page_content for c in chunks])

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