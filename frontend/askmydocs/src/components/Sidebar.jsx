import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "./Sidebar.css";

function Sidebar({ open, onUploadSuccess, chatHistory, user, onSignOut }) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/upload`, formData);
      //const res = await axios.post("http://localhost:8000/upload", formData);
      setUploadedFile({
        name: file.name,
        chunks: res.data.chunks,
        collection: res.data.collection_name,
      });
      onUploadSuccess(res.data.collection_name, file.name);
    } catch (err) {
      alert("Upload failed. Is the backend running?");
    } finally {
      setUploading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  return (
    <div className={`sidebar ${open ? "" : "collapsed"}`}>
        
    
      {/* Logo */}
      <div className="logo-row">
        <div className="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <div className="logo-text">Ask<span>MyDocs</span></div>
      </div>

      <div className="divider" />

      {/* Drop zone */}
      <div className="sidebar-section">
        <div className="sidebar-label">Document</div>
        <div
          {...getRootProps()}
          className={`drop-zone ${isDragActive ? "active" : ""} ${uploading ? "uploading" : ""}`}
        >
          <input {...getInputProps()} />
          <div className="drop-icon">⬆</div>
          {uploading
            ? <p>Uploading…</p>
            : isDragActive
              ? <p>Drop it!</p>
              : <p>Drop PDF here<br />or click to browse</p>
          }
        </div>
      </div>

      {/* Loaded file */}
      {uploadedFile && (
        <div className="sidebar-section">
          <div className="sidebar-label">Loaded</div>
          <div className="file-card">
            <div className="file-dot" />
            <div className="file-info">
              <div className="file-name">{uploadedFile.name}</div>
              <div className="file-chunks">{uploadedFile.chunks} chunks indexed</div>
            </div>
          </div>
        </div>
      )}

      <div className="divider" />

      {/* Chat history */}
      <div className="sidebar-section history-section">
        <div className="sidebar-label">Chat History</div>
        <div className="history-list">
          {chatHistory.length === 0 && (
            <div className="history-empty">No questions yet</div>
          )}
          {chatHistory.map((item, i) => (
            <div key={i} className={`history-item ${i === 0 ? "active" : ""}`}>
              <div className="history-q">{item.question}</div>
              <div className="history-time">{item.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* User row */}
      <div className="user-row">
        <div className="user-avatar">
          {user?.photoURL
            ? <img src={user.photoURL} alt="avatar" className="user-photo" />
            : <span>{user?.email?.[0]?.toUpperCase()}</span>
          }
        </div>
        <div className="user-info">
          <div className="user-name">{user?.displayName || user?.email}</div>
          <div className="user-email" onClick={onSignOut}>Sign out</div>
        </div>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        Powered by LangChain · ChromaDB · Groq
      </div>
    </div>
  );
}

export default Sidebar;