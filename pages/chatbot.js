// nextpatentcopy/pages/chatbot.js
import React, { useState, useEffect } from'react';

export default function ChatbotPage() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isChatbotRunning, setIsChatbotRunning] = useState(false);
  const [files, setFiles] = useState([]);

  const handleOpenChatbot = () => {
    setIsChatbotOpen(true);
    setIsChatbotRunning(true);
  };

  const handleStopChatbot = () => {
    setIsChatbotRunning(false);
  };

  const handleFileChange = (event) => {
    setFiles(event.target.files);
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
      {!isChatbotOpen && (
        <button onClick={handleOpenChatbot}>Open Chatbot</button>
      )}
      {isChatbotOpen && (
        <div>
          {isChatbotRunning && <div id="chatbot-widget" />}
 />}
