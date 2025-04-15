// nextpatentcopy/components/Chatbot.js
import React, { useEffect, useState } from 'react';

const Chatbot = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://agent-anez2noensqvrvyswwlwoicn-74ccw.ondigitalocean.app/static/chatbot/widget.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    setIsLoaded(true);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      {isLoaded && (
        <div
          dangerouslySetInnerHTML={{
            __html: '<div id="chatbot-widget"></div>',
          }}
        />
      )}
    </div>
  );
};

export default Chatbot;
