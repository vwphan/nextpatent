// nextpatentcopy/pages/chatbot.js
import React, { useState, useEffect } from'react';

export default function ChatbotPage() {
  const [files, setFiles] = useState([]);
  const [isChatbotRunning, setIsChatbotRunning] = useState(true);

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleStopChatbot = () => {
    setIsChatbotRunning(false);
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://agent-anez2noensqvrvyswwlwoicn-74ccw.ondigitalocean.app/static/chatbot/widget.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <h1>Welcome to the Chatbot!</h1>
      {isChatbotRunning && <div id="chatbot-widget" />}
      <input type="file" multiple onChange={handleFileChange} />
      <ul>
        {files.length > 0 &&
          Array.from(files).map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
      </ul>
      <button onClick={handleStopChatbot}>Stop Chatbot</button>
      {!isChatbotRunning && <p>Chatbot stopped.</p>}
    </div>
  );
}
