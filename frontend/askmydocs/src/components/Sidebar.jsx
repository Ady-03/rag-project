import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "./Sidebar.css";

function Sidebar({ onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://127.0.0.1:8000/upload", formData);
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
    <div className="sidebar">
      <div className="sidebar-logo">
        Ask<span>MyDocs</span>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Document</div>
        <div
          {...getRootProps()}
          className={`drop-zone ${isDragActive ? "active" : ""} ${uploading ? "uploading" : ""}`}
        >
          <input {...getInputProps()} />
          <div className="drop-icon">⬆</div>
          {uploading
            ? <p>Uploading...</p>
            : isDragActive
            ? <p>Drop it!</p>
            : <p>Drop PDF here<br />or click to browse</p>
          }
        </div>
      </div>

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

      <div className="sidebar-footer">
        Powered by LangChain · ChromaDB · Groq
      </div>
    </div>
  );
}

export default Sidebar;