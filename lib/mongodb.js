// lib/mongodb.js
import { MongoClient, ObjectId } from 'mongodb'; // Import ObjectId for updates/deletes by ID

const MONGODB_URI = process.env.MONGODB_URI;
let client;
let db;

// Improved connection function
async function connectToDatabase() {
    if (db && client && client.topology && client.topology.isConnected()) {
        // console.log('Using existing database connection'); // Optional logging
        return { db, client };
    }
    if (!MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable');
    }
    // console.log('Connecting to database...'); // Optional logging
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(); // Assumes DB name is in the URI, or specify client.db("yourDbName")
    // console.log('Database connected successfully'); // Optional logging
    return { db, client };
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
    const result = await collection.updateOne(
        { _id: new ObjectId(requestId) }, // Find by MongoDB ObjectId
        { $set: { status: newStatus, updatedAt: new Date() } } // Set new status and update timestamp
    );
    return result; // Contains acknowledged: true/false, modifiedCount: 1/0 etc.
}

// Add similar functions for other operations or collections (e.g., getUsers, deleteRequest)

// --- Original User Function (Keep or adapt as needed) ---
export async function createUser(user) {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    const result = await usersCollection.insertOne(user);
    return result.insertedId;
}

// You might also export the connect function or db object if needed elsewhere
// export { connectToDatabase };
