// components/RequestAccessForm.js
import React, { useState } from 'react';

// Re-use or adapt styles from TwilioLoginBox if desired
const styles = { /* ... copy relevant styles ... */ };

export default function RequestAccessForm() {
  const [identifier, setIdentifier] = useState(''); // e.g., email or phone
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/request-access', { // New API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier: identifier }), // Send email/phone
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit request.');
      }

      setSuccessMessage(data.message || 'Access request submitted successfully!');
      setIdentifier(''); // Clear input on success

    } catch (error) {
      console.error('Request Access Error:', error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Request Access</h2>
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      {successMessage && <p style={styles.success}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div style={styles.inputGroup}>
          <label htmlFor="identifier" style={styles.label}>Email or Phone:</label>
          <input
            type="text" // Use "email" or "tel" if you want specific types
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter your email or phone"
            required
            style={styles.input}
          />
        </div>
        <button type="submit" disabled={isLoading} style={styles.button}>
          {isLoading ? 'Submitting...' : 'Request Access'}
        </button>
      </form>
    </div>
  );
}
