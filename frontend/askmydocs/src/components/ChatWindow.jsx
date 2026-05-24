import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./ChatWindow.css";

function ChatWindow({ collectionName, fileName, onToggleSidebar, onNewMessage, onNewChat, onDeleteChat }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (fileName) {
      setMessages([{
        role: "ai",
        text: `Document loaded! Ask me anything about ${fileName}`,
        sources: [],
      }]);
    }
  }, [fileName]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
    onToggleSidebar();
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    if (onNewChat) onNewChat();
  };

  const handleDeleteChat = () => {
    if (messages.length === 0) return;
    const confirmed = window.confirm("Delete this chat? This cannot be undone.");
    if (!confirmed) return;
    setMessages([]);
    setInput("");
    if (onDeleteChat) onDeleteChat();
  };

  const sendMessage = async () => {
    if (!input.trim() || !collectionName || loading) return;
    const question = input;
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);
    onNewMessage(question);

    try {
      const res = await axios.post("http://127.0.0.1:8000/query", {
        question,
        collection_name: collectionName,
      });
      setMessages((prev) => [...prev, {
        role: "ai",
        text: res.data.answer,
        sources: res.data.sources || [],
      }]);
    } catch {
      setMessages((prev) => [...prev, {
        role: "ai",
        text: "Something went wrong. Try again.",
        sources: [],
      }]);
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

        {/* Hamburger toggle */}
        <button
          className={`toggle-btn ${sidebarOpen ? "open" : ""}`}
          onClick={handleToggleSidebar}
          title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <span className="ham-line" />
          <span className="ham-line" />
          <span className="ham-line" />
        </button>

        {/* Title block */}
        <div className="chat-header-mid">
          <div className="chat-header-title">Chat with your document</div>
          <div className="chat-header-sub">
            {fileName ? `${fileName}` : "Upload a PDF to get started"}
          </div>
        </div>

        {/* New Chat + Delete Chat buttons */}
        <div className="chat-header-actions">
          <button
            className="header-action-btn"
            onClick={handleNewChat}
            title="New chat"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="10" y1="11" x2="14" y2="11"/>
            </svg>
            <span className="btn-label">New</span>
          </button>

          <button
            className="header-action-btn danger"
            onClick={handleDeleteChat}
            title="Delete chat"
            disabled={messages.length === 0}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/>
              <path d="M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
            <span className="btn-label">Delete</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="36" height="36">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            Upload a PDF from the left panel to begin
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`msg msg-${msg.role}`}>
            {msg.role === "ai" ? (
              <div className="ai-row">
                <div className="ai-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M6 20v-2a6 6 0 0 1 12 0v2"/>
                  </svg>
                </div>
                <div className="bubble bubble-ai">{msg.text}</div>
              </div>
            ) : (
              <div className="bubble bubble-user">{msg.text}</div>
            )}
            {msg.sources?.length > 0 && (
              <div className="sources">
                {msg.sources.map((s, j) => (
                  <div key={j} className="source-pill">Source {j + 1}</div>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="msg msg-ai">
            <div className="ai-row">
              <div className="ai-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M6 20v-2a6 6 0 0 1 12 0v2"/>
                </svg>
              </div>
              <div className="bubble bubble-ai typing">
                <span className="dot"/><span className="dot"/><span className="dot"/>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <input
          className="chat-input"
          placeholder={collectionName ? "Ask a question about your document..." : "Upload a PDF first..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!collectionName || loading}
        />
        <button className="send-btn" onClick={sendMessage} disabled={!collectionName || loading}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;