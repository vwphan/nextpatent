// lib/mongodb.js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db();

export const usersCollection = db.collection('users');

export const createUser = async (user) => {
  const result = await usersCollection.insertOne(user);
  return result.insertedId;
};
