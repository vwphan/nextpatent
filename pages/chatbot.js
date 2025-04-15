// nextpatentcopy/pages/chatbot.js
import React, { useState, useEffect } from'react';

export default function ChatbotPage() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isChatbotRunning, setIsChatbotRunning] = useState(false);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [chatbotResponse, setChatbotResponse] = useState('');

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

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Send the message to the chatbot API
    fetch('https://agent-anez2noensqvrvyswwlwoicn-74ccw.ondigitalocean.app/static/chatbot/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
      setChatbotResponse(data.response);
    })
    .catch(error => {
      console.error(error);
    });
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
          {isChatbotRunning && (
            <div>
              <input
                type="text"
                value={message}
                onChange={handleMessageChange}
                placeholder="Type a message..."
              />
              <button onClick={handleSubmit}>Send</button>
              <p>Chatbot Response: {chatbotResponse}</p>
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
          )}
        </div>
      )}
    </div>
  );
}
