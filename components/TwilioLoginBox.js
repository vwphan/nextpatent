// components/TwilioLoginBox.js
import React, { useState } from 'react';
import { useRouter } from 'next/router'; // <-- 1. Import useRouter

export default function TwilioLoginBox() {
  // State variables
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState('enterPhone');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const router = useRouter(); // <-- 2. Initialize router

  // Handler for submitting the phone number (no changes needed here)
  const handlePhoneSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    console.log('Frontend phone number state before fetch:', phoneNumber);
    try {
      const response = await fetch('/api/auth/start-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ phone: phoneNumber }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send verification code.');
      }
      setSuccessMessage(data.message || `Verification code sent to ${phoneNumber}`);
      setStep('enterOtp');
    } catch (error) {
      console.error('Phone Submission Error:', error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for submitting the OTP code
  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const response = await fetch('/api/auth/check-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ phone: phoneNumber, code: otpCode }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
         throw new Error(data.message || 'Invalid verification code.');
      }

      // --- > 3. Redirect on Success <---
      setSuccessMessage(data.message || 'Login Successful! Redirecting...'); // Optional message update
      router.push('/chatbot'); // Redirect to chatbot page
      // No need to setStep('loggedIn') if redirecting immediately

    } catch (error) {
      console.error('OTP Submission Error:', error);
      setErrorMessage(error.message);
      setIsLoading(false); // Ensure loading is turned off on error
    }
    // Don't set isLoading to false here if redirecting, page will change
  };

  // --- Render Logic ---
  // (Keep the existing render logic below)
  return (
    <div style={styles.container}>
      <h2>Login with Phone</h2>

      {/* Display Messages */}
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      {successMessage && <p style={styles.success}>{successMessage}</p>}

      {/* Phone Number Input Form */}
      {step === 'enterPhone' && (
        <form onSubmit={handlePhoneSubmit}>
           {/* ... form content ... */}
            <input
              type="tel"
              id="phone-number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1xxxxxxxxxx"
              required
              style={styles.input}
              disabled={isLoading}
            />
           {/* ... button ... */}
           <button type="submit" disabled={isLoading} style={styles.button}>
             {isLoading ? 'Sending...' : 'Send Code'}
           </button>
        </form>
      )}

      {/* OTP Code Input Form */}
      {step === 'enterOtp' && (
        <form onSubmit={handleOtpSubmit}>
           {/* ... form content ... */}
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              id="otp-code"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              required
              maxLength={6}
              style={styles.input}
              disabled={isLoading}
            />
           {/* ... buttons ... */}
           <button type="submit" disabled={isLoading} style={styles.button}>
             {isLoading ? 'Verifying...' : 'Verify Code'}
           </button>
           <button
             type="button"
             onClick={() => {
               setStep('enterPhone');
               setErrorMessage('');
               setSuccessMessage('');
               setOtpCode('');
             }}
             style={styles.linkButton}
             disabled={isLoading}
           >
             Change Phone Number
          </button>
        </form>
      )}

       {/* This 'loggedIn' state might not be reached if redirecting immediately */}
      {step === 'loggedIn' && (
         <div>
             <p style={styles.success}>Successfully logged in!</p>
         </div>
      )}
    </div>
  );
}

// Styles (Keep existing styles)
const styles = { /* ... */ };
