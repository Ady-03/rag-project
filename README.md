# 🤖 AskMyDocs — AI-Powered Document Q&A System

> Upload any PDF. Ask anything. Get precise answers with source references — powered by RAG + LLaMA 3.

![AskMyDocs Banner](https://img.shields.io/badge/AskMyDocs-RAG%20Powered-7c3aed?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTE0IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY4eiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjODE4Y2Y4IiBzdHJva2Utd2lkdGg9IjEuOCIvPjwvc3ZnPg==)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

---

## 🌐 Live Demo

| Service        | URL                                                                                    |
| -------------- | -------------------------------------------------------------------------------------- |
| 🖥️ Frontend    | [rag-project-ebon.vercel.app](https://rag-project-ebon.vercel.app)                     |
| ⚙️ Backend API | [rag-project-backend-6u50.onrender.com](https://rag-project-backend-6u50.onrender.com) |

---

## ✨ What is AskMyDocs?

**AskMyDocs** is a full-stack AI application that lets you chat with your documents. Upload any PDF and ask questions in plain English — the system finds the most relevant passages and generates accurate answers with source references.

No hallucinations. No guessing. Just facts from your files.

---

## 🧠 How It Works — RAG Pipeline

```
📄 PDF Upload
      ↓
✂️  Text Chunking (800 tokens, 100 overlap)
      ↓
🔢  Embedding Generation (Google Gemini API)
      ↓
🗄️  Vector Storage (ChromaDB)
      ↓
❓  User Question
      ↓
🔍  Semantic Search (cosine similarity)
      ↓
📋  Top 4 Relevant Chunks Retrieved
      ↓
🤖  LLM Generation (Groq + LLaMA 3.3 70B)
      ↓
💬  Answer + Source References
```

### Key AI/ML Concepts Used

| Concept                      | What it does                                                  | Tool used      |
| ---------------------------- | ------------------------------------------------------------- | -------------- |
| **Embeddings**               | Converts text to vectors (numbers representing meaning)       | Google Gemini  |
| **Vector Similarity Search** | Finds chunks closest in meaning to your question              | ChromaDB       |
| **RAG**                      | Retrieval-Augmented Generation — grounds LLM in your document | LangChain      |
| **LLM**                      | Generates fluent answers from retrieved context               | Groq / LLaMA 3 |

---

## 📚 Core Concepts Explained

### What is RAG?

**Retrieval-Augmented Generation** is an AI architecture that combines:

1. **Retrieval** — finding relevant information from a knowledge base
2. **Generation** — using an LLM to generate answers based on retrieved context

Instead of relying on the LLM's training data (which may be outdated or hallucinated), RAG grounds the model in your actual documents.

### What are Embeddings?

Embeddings convert text into vectors — lists of numbers that represent semantic meaning. Similar sentences have similar vectors. This allows mathematical comparison of meaning using cosine similarity.

### Why ChromaDB?

ChromaDB is a lightweight vector database that stores embeddings and enables fast similarity search. When you ask a question, ChromaDB finds the stored chunks whose vectors are closest to your question vector.

---

## 🏗️ Project Structure

```
RAG_project/
├── backend/                    # Python FastAPI backend
│   ├── main.py                 # FastAPI app — /upload and /query endpoints
│   ├── ingest.py               # PDF → chunks → embeddings → ChromaDB
│   ├── query.py                # Question → semantic search → Groq → answer
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # API keys (not committed)
│   └── chroma_db/              # Local vector store (auto-created)
│
└── frontend/
    └── askmydocs/              # React frontend
        ├── public/
        │   ├── index.html      # App title + favicon
        │   └── favicon.svg     # Custom logo
        ├── src/
        │   ├── App.js          # Root — handles auth state
        │   ├── firebase.js     # Firebase config
        │   ├── pages/
        │   │   ├── LandingPage.jsx   # Auth page with neural logo animation
        │   │   └── LandingPage.css
        │   └── components/
        │       ├── Sidebar.jsx       # PDF upload + chat history
        │       ├── Sidebar.css
        │       ├── ChatWindow.jsx    # Chat interface
        │       └── ChatWindow.css
        ├── .env                # Environment variables (not committed)
        └── package.json
```

---

## 🛠️ Tech Stack

### Backend

| Tool                 | Purpose                          |
| -------------------- | -------------------------------- |
| **Python 3.11**      | Core language                    |
| **FastAPI**          | REST API framework               |
| **LangChain**        | RAG pipeline orchestration       |
| **ChromaDB**         | Vector database                  |
| **Google Gemini**    | Embedding model (text → vectors) |
| **Groq + LLaMA 3.3** | LLM for answer generation        |
| **PyPDF**            | PDF text extraction              |

### Frontend

| Tool               | Purpose                       |
| ------------------ | ----------------------------- |
| **React 18**       | UI framework                  |
| **Firebase Auth**  | Google + Email authentication |
| **Axios**          | HTTP requests to backend      |
| **React Dropzone** | Drag & drop file upload       |
| **Canvas API**     | Neural logo animation         |

### Deployment

| Service      | What's deployed |
| ------------ | --------------- |
| **Vercel**   | React frontend  |
| **Render**   | FastAPI backend |
| **Firebase** | Authentication  |

---

## 🚀 Getting Started — Local Development

### Prerequisites

- Python 3.11+
- Node.js 18+
- Git

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/rag-project.git
cd rag-project
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate
# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Add your API keys to .env
```

### 3. Backend Environment Variables

Create `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key
GOOGLE_API_KEY=your_gemini_api_key
```

### 4. Run Backend

```bash
uvicorn main:app --reload
# API running at http://localhost:8000
```

### 5. Frontend Setup

```bash
cd frontend/askmydocs

# Install dependencies
npm install

# Create .env file
```

### 6. Frontend Environment Variables

Create `frontend/askmydocs/.env`:

```env
REACT_APP_BACKEND_URL=http://127.0.0.1:8000
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 7. Run Frontend

```bash
npm start
# App running at http://localhost:3000
```

---

## 🔑 API Keys Required

| Key                | Where to get                                                       | Free tier |
| ------------------ | ------------------------------------------------------------------ | --------- |
| **GROQ_API_KEY**   | [console.groq.com](https://console.groq.com)                       | ✅ Free   |
| **GOOGLE_API_KEY** | [aistudio.google.com](https://aistudio.google.com)                 | ✅ Free   |
| **Firebase**       | [console.firebase.google.com](https://console.firebase.google.com) | ✅ Free   |

---

## 📡 API Endpoints

### `POST /upload`

Upload a PDF document for ingestion.

**Request:** `multipart/form-data`

```
file: <PDF file>
```

**Response:**

```json
{
  "message": "File uploaded",
  "collection_name": "document_name",
  "chunks": 42
}
```

### `POST /query`

Ask a question about an uploaded document.

**Request:**

```json
{
  "question": "What is this document about?",
  "collection_name": "document_name"
}
```

**Response:**

```json
{
  "answer": "This document is about...",
  "sources": ["chunk text 1...", "chunk text 2..."]
}
```

### `GET /`

Health check.

**Response:**

```json
{ "status": "AskMyDocs backend running" }
```

---

## 🚢 Deployment

### Backend → Render

1. Connect GitHub repo to [render.com](https://render.com)
2. Set root directory: `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables: `GROQ_API_KEY`, `GOOGLE_API_KEY`

### Frontend → Vercel

1. Connect GitHub repo to [vercel.com](https://vercel.com)
2. Set root directory: `frontend/askmydocs`
3. Framework: Create React App
4. Add all `REACT_APP_*` environment variables

---

## 👥 Team & Collaboration

This project was built collaboratively using Git:

- **Backend** (`backend/`) — Python, FastAPI, RAG pipeline
- **Frontend** (`frontend/`) — React, Firebase Auth, UI

### Branch Strategy

```
main
├── feature/backend-rag-pipeline
├── feature/frontend-ui
└── feature/auth-integration
```

---

## 📄 License

MIT License — feel free to use, modify and distribute.

---

## 🙏 Acknowledgements

- [LangChain](https://langchain.com) — RAG pipeline framework
- [Groq](https://groq.com) — Ultra-fast LLM inference
- [ChromaDB](https://trychroma.com) — Vector database
- [Google Gemini](https://aistudio.google.com) — Embedding model
- [Firebase](https://firebase.google.com) — Authentication

---

<p align="center">Built with ❤️ using RAG + LLaMA 3</p>
