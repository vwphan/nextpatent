// pages/index.js
import Head from 'next/head';
import TwilioLoginBox from '../components/TwilioLoginBox';
import RequestAccessForm from '../components/RequestAccessForm'; // <-- Import RequestAccessForm

export default function HomePage() {
  return (
    <div>
      <Head>
        <title>My App - Login / Request Access</title> {/* Updated title */}
        <meta name="description" content="Login or Request Access" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={styles.main}> {/* Added some basic styling */}
        <h1>Welcome!</h1>

        {/* Render the login box component */}
        <div style={styles.componentBox}>
             <p>Please log in using your phone number.</p>
             <TwilioLoginBox />
        </div>


        {/* Add a separator */}
        <hr style={styles.hr} />

        {/* Render the Request Access form component */}
        <div style={styles.componentBox}>
            <RequestAccessForm /> {/* <-- Add the RequestAccessForm component here */}
        </div>

        {/* Other homepage content */}
      </main>

      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
}

// Optional basic styles to separate the boxes
const styles = {
    main: {
        maxWidth: '500px',
        margin: '40px auto',
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'sans-serif'
    },
    componentBox: {
        marginBottom: '30px',
        padding: '20px',
       // border: '1px dashed #eee', // Optional visual separation
       // borderRadius: '8px'
    },
    hr: {
        margin: '40px 0',
        border: 'none',
        borderTop: '1px solid #ccc'
    }
};
