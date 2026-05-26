from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
from ingest import ingest_pdf
from query import query_pdf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    question: str
    collection_name: str

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    file_path = f"uploads/{file.filename}"
    os.makedirs("uploads", exist_ok=True)

    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    collection_name = file.filename.replace(".pdf", "")
    chunks = ingest_pdf(file_path, collection_name)

    return {"message": "File uploaded", "collection_name": collection_name, "chunks": chunks}

@app.post("/query")
async def query(request: QueryRequest):
    result = query_pdf(request.question, request.collection_name)
    return result

@app.get("/")
@app.head("/")
def root():
    return {"status": "AskMyDocs backend running"}