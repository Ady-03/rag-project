import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./ChatWindow.css";

function ChatWindow({ collectionName, fileName }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (fileName) {
      setMessages([
        {
          role: "ai",
          text: `Document loaded! Ask me anything about ${fileName}`,
          sources: [],
        },
      ]);
    }
  }, [fileName]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !collectionName || loading) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/query", {
        question: input,
        collection_name: collectionName,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: res.data.answer,
          sources: res.data.sources || [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Something went wrong. Try again.", sources: [] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-area">
      <div className="chat-header">
        <div className="chat-header-title">Chat with your document</div>
        <div className="chat-header-sub">
          {fileName ? `${fileName}` : "Upload a PDF to get started"}
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-state">
            Upload a PDF from the left panel to begin
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`msg msg-${msg.role}`}>
            <div className={`bubble bubble-${msg.role}`}>{msg.text}</div>
            {msg.sources?.length > 0 && (
              <div className="sources">
                {msg.sources.map((s, j) => (
                  <div key={j} className="source-pill">
                    Source {j + 1}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="msg msg-ai">
            <div className="bubble bubble-ai typing">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="chat-input-area">
        <input
          className="chat-input"
          placeholder={
            collectionName
              ? "Ask a question about your document..."
              : "Upload a PDF first..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!collectionName || loading}
        />
        <button
          className="send-btn"
          onClick={sendMessage}
          disabled={!collectionName || loading}
        >
          Send →
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;