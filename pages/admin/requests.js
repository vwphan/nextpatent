// pages/admin/requests.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';

// Basic styles (adapt or use your existing CSS)
const styles = {
  container: { padding: '20px', fontFamily: 'sans-serif' },
  list: { listStyle: 'none', padding: 0 },
  listItem: { border: '1px solid #eee', marginBottom: '10px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  identifier: { fontWeight: 'bold', marginRight: '15px' },
  date: { fontSize: '0.9em', color: '#666', marginRight: '15px' },
  actions: { display: 'flex', gap: '10px' },
  button: { padding: '5px 10px', cursor: 'pointer' },
  approveButton: { backgroundColor: 'lightgreen', border: 'none' },
  rejectButton: { backgroundColor: 'lightcoral', border: 'none' },
  loading: { fontStyle: 'italic' },
  error: { color: 'red' },
  message: { marginTop: '10px', fontStyle: 'italic'},
};

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(''); // For success/error after button click
  const [actionLoading, setActionLoading] = useState(null); // Track which request ID is being processed

  // Function to fetch pending requests
  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/requests'); // Use the GET endpoint
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.requests)) {
        setRequests(data.requests);
      } else {
         throw new Error('Invalid data format received from API.');
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setRequests([]); // Clear requests on error
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch requests when the component mounts
  useEffect(() => {
    // !!! IMPORTANT: Add frontend authentication check here!
    // You should verify the user is an admin *before* fetching data.
    // e.g., if (!isAdminLoggedIn()) { router.push('/login'); return; }
    fetchRequests();
  }, []); // Empty dependency array means this runs once on mount

  // Function to handle approving or rejecting a request
  const handleUpdateRequest = async (requestId, newStatus) => {
    setActionMessage(''); // Clear previous messages
    setActionLoading(requestId); // Set loading for this specific request
    setError(null); // Clear general fetch errors

    try {
        // Use the PUT endpoint for the specific request ID
      const response = await fetch(`/api/admin/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }), // Send the new status
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to update status to ${newStatus}`);
      }

      setActionMessage(data.message || `Request ${newStatus} successfully.`);

      // Refresh the list after successful update
      fetchRequests(); // Re-fetch to remove the processed item

    } catch (err) {
      console.error(`Update error for ${requestId}:`, err);
      setActionMessage(`Error: ${err.message}`); // Show action-specific error
    } finally {
       setActionLoading(null); // Clear loading state for this request
    }
  };


  return (
    <div style={styles.container}>
      <Head>
        <title>Admin - Access Requests</title>
      </Head>
      <h1>Pending Access Requests</h1>

      {/* Display general loading or error messages */}
      {isLoading && <p style={styles.loading}>Loading requests...</p>}
      {error && <p style={styles.error}>Error loading requests: {error}</p>}
      {actionMessage && <p style={styles.message}>{actionMessage}</p>}

      {/* Display the list of requests */}
      {!isLoading && !error && (
        <ul style={styles.list}>
          {requests.length === 0 ? (
            <p>No pending requests found.</p>
          ) : (
            requests.map((req) => (
              <li key={req._id} style={styles.listItem}>
                <div>
                  <span style={styles.identifier}>{req.identifier}</span>
                  <span style={styles.date}>
                    Requested: {new Date(req.requestedAt).toLocaleString()}
                  </span>
                </div>
                <div style={styles.actions}>
                  <button
                    style={{ ...styles.button, ...styles.approveButton }}
                    onClick={() => handleUpdateRequest(req._id, 'approved')}
                    disabled={actionLoading === req._id} // Disable button while this request is loading
                  >
                    {actionLoading === req._id ? '...' : 'Approve'}
                  </button>
                  <button
                    style={{ ...styles.button, ...styles.rejectButton }}
                    onClick={() => handleUpdateRequest(req._id, 'rejected')}
                     disabled={actionLoading === req._id} // Disable button while this request is loading
                  >
                     {actionLoading === req._id ? '...' : 'Reject'}
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
