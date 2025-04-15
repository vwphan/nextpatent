// nextpatentcopy/pages/chatbot.js
import React, { useState } from 'react';
import Head from 'next/head';
import Chatbot from '../components/Chatbot';

export default function ChatbotPage() {
  const [files, setFiles] = useState([]);
  const [isChatbotRunning, setIsChatbotRunning] = useState(true);

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleStopChatbot = () => {
    setIsChatbotRunning(false);
  };

  return (
    <div>
      <Head>
        <title>Chatbot</title>
      </Head>
      <h1>Welcome to the Chatbot!</h1>
      {/* Add your primary chatbot component logic here if needed */}
      <p>Your chatbot interface should appear via the widget script.</p>

      {isChatbotRunning && <Chatbot />}

      <input type="file" multiple onChange={handleFileChange} />
 />
