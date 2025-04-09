// pages/api/request-access.js
import { MongoClient } from 'mongodb'; // Or import your specific connection logic

// --- Database Connection Setup (Adapt from lib/mongodb.js) ---
// You might want to centralize the connection logic more robustly
// Ensure MONGODB_URI is set in your environment variables
const MONGODB_URI = process.env.MONGODB_URI;
let client;
let db;
let accessRequestsCollection; // Define collection variable

async function connectToDatabase() {
  if (db && client && client.topology && client.topology.isConnected()) {
    console.log('Using existing database connection');
    accessRequestsCollection = db.collection('access_requests'); // Ensure collection is set
    return;
  }
   if (!MONGODB_URI) {
       throw new Error('MONGODB_URI environment variable not set.');
   }
  console.log('Connecting to database...');
  client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    db = client.db(); // Assumes database name is part of the URI
    accessRequestsCollection = db.collection('access_requests'); // Use a dedicated collection
    console.log('Database connected successfully');
  } catch (error) {
     console.error('Database connection failed:', error);
     // Properly close the client if connection fails partially
     if (client) {
        await client.close();
     }
     throw error; // Rethrow error to be caught by the handler
  }
}
// --- End Database Connection Setup ---


export default async function handler(req, res) {
   if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
   }

    const { identifier } = req.body; // Get email/phone from request

    if (!identifier) {
        return res.status(400).json({ success: false, message: 'Identifier (email or phone) is required.' });
    }

    try {
        await connectToDatabase(); // Ensure connection

        if (!accessRequestsCollection) {
            throw new Error("Database collection not initialized.");
        }

        // Store the request (consider adding a timestamp, status, etc.)
        const result = await accessRequestsCollection.insertOne({
            identifier: identifier,
            requestedAt: new Date(),
            status: 'pending' // Example status
        });

        console.log(`Access request stored with ID: ${result.insertedId}`);

        res.status(200).json({ success: true, message: 'Request submitted successfully!' });

    } catch (error) {
        console.error('Error processing access request:', error);
        res.status(500).json({ success: false, message: 'Failed to submit request. Please try again later.' });
    }
     // Consider closing the client connection if your app doesn't maintain persistent connections
     // await client.close(); // This depends on your hosting environment and connection strategy
}
