import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut, getRedirectResult } from "firebase/auth";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import LandingPage from "./pages/LandingPage";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [collectionName, setCollectionName] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
        }
      })
      .catch((err) => console.error("Redirect error:", err));

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const addToHistory = (question) => {
    setChatHistory((prev) => [
      { question, time: "Just now" },
      ...prev.slice(0, 9),
    ]);
  };

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          background: "#07070f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#818cf8",
          fontSize: "14px",
        }}
      >
        Loading...
      </div>
    );

  if (!user) return <LandingPage />;

  return (
    <div className="app-container">
      <Sidebar
        open={sidebarOpen}
        chatHistory={chatHistory}
        user={user}
        onSignOut={() => signOut(auth)}
        onUploadSuccess={(col, name) => {
          setCollectionName(col);
          setFileName(name);
        }}
      />
      <ChatWindow
        collectionName={collectionName}
        fileName={fileName}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onNewMessage={addToHistory}
        onNewChat={() => {
          setCollectionName(null);
          setFileName(null);
        }}
        onDeleteChat={() => {
          setChatHistory([]);
        }}
      />
    </div>
  );
}

export default App;
