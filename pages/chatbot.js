// nextpatentcopy/pages/chatbot.js
import React from 'react';
import Head from 'next/head';
import Script from 'next/script'; // <-- Import the Script component

export default function ChatbotPage() {
  return (
    <div>
      <Head>
        <title>Chatbot</title>
      </Head>
      <h1>Welcome to the Chatbot!</h1>
      {/* Add your primary chatbot component logic here if needed */}
      <p>Your chatbot interface should appear via the widget script.</p>

      {/* Add the chatbot widget script using next/script */}
      <Script
        src="https://agent-anez2noensqvrvyswwlwoicn-74ccw.ondigitalocean.app/static/chatbot/widget.js"
        strategy="lazyOnload" // Load script after page is interactive
        data-agent-id="ab126012-08f0-11f0-bf8f-4e013e2ddde4"
        data-chatbot-id="ggA4WTfX43OCURrAvpWi6stmn-uvENDh"
        data-name="Albert the Examiner"
        data-primary-color="#031B4E"
        data-secondary-color="#E5E8ED"
        data-button-background-color="#0061EB"
        data-starting-message="Hello! How can I help you today?"
        data-logo="/static/chatbot/icons/default-agent.svg"
      />
    </div>
  );
}
