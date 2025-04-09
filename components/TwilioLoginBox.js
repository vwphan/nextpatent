// components/TwilioLoginBox.js
import React, { useState } from 'react';

export default function TwilioLoginBox() {
  // State variables
  const [phoneNumber, setPhoneNumber] = useState(''); // Input for phone number
  const [otpCode, setOtpCode] = useState('');       // Input for OTP code
  const [step, setStep] = useState('enterPhone');   // 'enterPhone' or 'enterOtp' or 'loggedIn'
  const [isLoading, setIsLoading] = useState(false); // Loading state for API calls
  const [errorMessage, setErrorMessage] = useState(''); // To display errors
  const [successMessage, setSuccessMessage] = useState(''); // To display success messages

  // Handler for submitting the phone number
  const handlePhoneSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    // ---> Log the phone number state just before sending it <---
    console.log('Frontend phone number state before fetch:', phoneNumber);

    try {
      const response = await fetch('/api/auth/start-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber }), // Send the phone number state
      });

      const data = await response.json();

      if (!response.ok) {
        // Use message from backend if available, otherwise a default
        throw new Error(data.message || 'Failed to send verification code.');
      }

      // If successful, move to OTP step
      setSuccessMessage(data.message || `Verification code sent to ${phoneNumber}`);
      setStep('enterOtp');

    } catch (error) {
      console.error('Phone Submission Error:', error);
      // Display the specific error message caught
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
        headers: {
          'Content-Type': 'application/json',
        },
        // Send both the original phone number and the entered OTP code
        body: JSON.stringify({ phone: phoneNumber, code: otpCode }),
      });

      const data = await response.json();

      // Check for non-OK response OR explicit success: false from backend
      if (!response.ok || !data.success) {
         throw new Error(data.message || 'Invalid verification code.');
      }

      // Verification successful!
      setSuccessMessage(data.message || 'Login Successful!');
      // TODO: Implement actual login logic here (e.g., set session, redirect)
      // For now, just move to a 'loggedIn' state
       setStep('loggedIn'); // Or redirect, clear form etc.

    } catch (error) {
      console.error('OTP Submission Error:', error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render Logic ---

  return (
    <div style={styles.container}>
      <h2>Login with Phone</h2>

      {/* Display Messages */}
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      {successMessage && <p style={styles.success}>{successMessage}</p>}

      {/* Phone Number Input Form */}
      {step === 'enterPhone' && (
        <form onSubmit={handlePhoneSubmit}>
          <div style={styles.inputGroup}>
            <label htmlFor="phone-number" style={styles.label}>Phone Number:</label>
            <input
              type="tel" // Use type="tel" for phone numbers
              id="phone-number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1xxxxxxxxxx" // Example format
              required
              style={styles.input}
              disabled={isLoading} // Disable input while loading
            />
          </div>
          <button type="submit" disabled={isLoading} style={styles.button}>
            {isLoading ? 'Sending...' : 'Send Code'}
          </button>
        </form>
      )}

      {/* OTP Code Input Form */}
      {step === 'enterOtp' && (
        <form onSubmit={handleOtpSubmit}>
          <p>Enter the code sent to {phoneNumber}</p>
          <div style={styles.inputGroup}>
            <label htmlFor="otp-code" style={styles.label}>Verification Code:</label>
            <input
              type="text" // Can use "number" but "text" allows more flexibility
              inputMode="numeric" // Hint for mobile keyboards
              pattern="\d{6}" // Example: Enforce 6 digits (adjust if needed)
              id="otp-code"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              required
              maxLength={6} // Match pattern if possible
              style={styles.input}
              disabled={isLoading} // Disable input while loading
            />
          </div>
          <button type="submit" disabled={isLoading} style={styles.button}>
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>
           {/* Button to go back to phone entry step */}
           <button
             type="button"
             onClick={() => {
               setStep('enterPhone');
               setErrorMessage('');
               setSuccessMessage('');
               setOtpCode(''); // Clear OTP code if going back
               // Optionally clear phoneNumber too: setPhoneNumber('');
             }}
             style={styles.linkButton}
             disabled={isLoading} // Disable while loading
           >
             Change Phone Number
          </button>
        </form>
      )}

       {/* Placeholder for successful login state */}
      {step === 'loggedIn' && (
         <div>
             <p style={styles.success}>Successfully logged in!</p>
             {/* Add logout button or redirect logic here */}
             {/* Example: <button onClick={() => setStep('enterPhone')}>Log Out</button> */}
         </div>
      )}
    </div>
  );
}

// Basic inline styles (consider using CSS Modules or a UI library)
const styles = {
  container: {
    border: '1px solid #ccc',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '400px',
    margin: '20px auto',
    fontFamily: 'sans-serif',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box', // Prevent padding from increasing width
  },
  button: {
    width: '100%',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#0070f3',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '10px',
    opacity: 1, // Default opacity
  },
  // Example for disabled button style (optional)
  // button:disabled: {
  //   opacity: 0.5,
  //   cursor: 'not-allowed',
  // },
   linkButton: {
      background: 'none',
      border: 'none',
      color: '#0070f3',
      textDecoration: 'underline',
      cursor: 'pointer',
      padding: '5px 0',
      display: 'block',
      textAlign: 'center',
      marginTop: '10px', // Add some space above the link button
  },
  error: {
    color: 'red',
    marginBottom: '10px',
    fontSize: '0.9em',
  },
  success: {
    color: 'green',
    marginBottom: '10px',
    fontSize: '0.9em',
  },
};
