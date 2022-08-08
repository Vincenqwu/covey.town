// Reference: https://dev.to/paulasantamaria/testing-node-js-mongoose-with-an-in-memory-database-32np
// tests/db-handler.js

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = new MongoMemoryServer();

/**
 * Connect to the in-memory database.
 */
export async function connect() {
  await mongod.start();

  const uri = await mongod.getUri();
  await mongoose.connect(uri).then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.log(err);
  });
}

/**
 * Drop database, close the connection and stop mongod.
 */
export async function closeDatabase() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
}

/**
 * Remove all the data for all db collections.
 */
export async function clearDatabase() {
  const collections = mongoose.connection.collection;
    
  await Promise.all(Object.values(collections).map(async (collection) => {
    await collection.deleteMany(); 
  }));
}