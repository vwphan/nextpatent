// nextpatentcopy/components/Chatbot.js
import Script from 'next/script';

const Chatbot = () => {
  return (
    <Script
      src="https://agent-anez2noensqvrvyswwlwoicn-74ccw.ondigitalocean.app/static/chatbot/widget.js"
      strategy="lazyOnload" // Load script after page is interactive
      data-agent-id="ab126012-08f0-11f0-bf8f-4e013e2ddde4"
      data-chatbot-id="ggA4WTfX43OCURrAvpWi6stmn-uvENDh"
      data-name="Albert the Examiner"
      data-primary-color="#031B4E"
      data-secondary-color="#E5E8ED"
      data-button-background-color="#0061EB"
    />
  );
};

export default Chatbot;
