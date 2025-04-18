// lib/mongodb.js
import { MongoClient, ObjectId } from 'mongodb'; // Ensure ObjectId is imported

const MONGODB_URI = process.env.MONGODB_URI;
let client;
let db;

// Improved connection function
async function connectToDatabase() {
    // Check if connection already exists or is connecting
    if (db && client && client.topology && client.topology.isConnected()) {
        // console.log('Using existing database connection'); // Optional
        return { db, client };
    }
    // Check if URI is defined
    if (!MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable inside .env.local or your deployment settings');
    }

    // console.log('Connecting to database...'); // Optional
    client = new MongoClient(MONGODB_URI); // Removed deprecated options

    try {
        await client.connect();
        db = client.db(); // Assumes DB name is in the URI, or specify client.db("yourDbName")
        // console.log('Database connected successfully'); // Optional
        return { db, client };
    } catch (error) {
        console.error('Database connection failed:', error);
        // Attempt to close client if connection partially failed or threw error
        if (client) {
           await client.close();
        }
        throw error; // Re-throw the error to be handled by the caller
    }
}

// --- Access Requests Collection Helpers ---

// Function to get all pending access requests
export async function getPendingAccessRequests() {
    const { db } = await connectToDatabase();
    const collection = db.collection('access_requests'); // Use the collection name you chose
    // Find requests where status is 'pending', sort by request date
    const requests = await collection.find({ status: 'pending' }).sort({ requestedAt: 1 }).toArray();
    return requests;
}

// Function to update the status of an access request by its ID
export async function updateAccessRequestStatus(requestId, newStatus) {
    const { db } = await connectToDatabase();
    const collection = db.collection('access_requests');

    // Validate the ID format before querying
    if (!ObjectId.isValid(requestId)) {
        throw new Error('Invalid ObjectId format for request ID.');
    }

    const result = await collection.updateOne(
        { _id: new ObjectId(requestId) }, // Find by MongoDB ObjectId
        { $set: { status: newStatus, updatedAt: new Date() } } // Set new status and update timestamp
    );
    return result; // Contains acknowledged: true/false, matchedCount, modifiedCount etc.
}

// --- Original User Function (Keep or adapt as needed) ---
// Assuming 'users' collection might be for approved/verified users?
export async function createUser(user) {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    const result = await usersCollection.insertOne(user);
    return result.insertedId;
}

// You might also export the connect function if needed directly
