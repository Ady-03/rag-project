import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import "./App.css";

function App() {
  const [collectionName, setCollectionName] = useState(null);
  const [fileName, setFileName] = useState(null);

  return (
    <div className="app-container">
      <Sidebar
        onUploadSuccess={(col, name) => {
          setCollectionName(col);
          setFileName(name);
        }}
      />
      <ChatWindow collectionName={collectionName} fileName={fileName} />
    </div>
  );
}

export default App;
