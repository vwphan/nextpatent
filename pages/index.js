// pages/index.js
import Head from 'next/head';
import TwilioLoginBox from '../components/TwilioLoginBox'; // Adjust path if needed

export default function HomePage() {
  return (
    <div>
      <Head>
        <title>My App - Login</title>
        <meta name="description" content="Login using Twilio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome!</h1>
        <p>Please log in using your phone number.</p>

        {/* Render the login box component */}
        <TwilioLoginBox />

        {/* Other homepage content */}
      </main>

      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
}
