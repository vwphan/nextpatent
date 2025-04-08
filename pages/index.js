// pages/index.js
import { createUser } from '../lib/mongodb';
import Head from 'next/head';
import { useState } from 'react';
import { Verify } from '@twilio/verify';

const LandingPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const handleVerify = async () => {
    const verify = new Verify(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const verification = await verify.createVerification(phoneNumber);
    // ...
  };

  return (
    <div>
      <Head>
        <title>NextPatent</title>
      </Head>
      <h1>Welcome to NextPatent</h1>
      <form>
        <label>Phone Number:</label>
        <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <button onClick={handleVerify}>Verify</button>
      </form>
    </div>
  );
};

export default LandingPage;
