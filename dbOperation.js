const { MongoClient, ObjectId } = require('mongodb');

const connectionUrl = "mongodb://localhost:27017";
const databaseName = "my_blog";
const collectionName = "posts";

// Function to establish a database connection
async function connectToDatabase() {
  const client = new MongoClient(connectionUrl);
  await client.connect();
  const database = client.db(databaseName);
  const collection = database.collection(collectionName);
  return { client, collection };
}

// Create a document
async function createDocument(document) {
  const { client, collection } = await connectToDatabase();
  const result = await collection.insertOne(document);
  client.close();
  return result.insertedId;
}

// Find a single document by ID
async function findOneDocument(documentId) {
    const { client, collection } = await connectToDatabase();
    const document = await collection.findOne({ _id: ObjectId(documentId) });
    client.close();
    return document;
  }
  
  // Find multiple documents
  async function findManyDocuments(query) {
    const { client, collection } = await connectToDatabase();
    const documents = await collection.find(query).toArray();
    client.close();
    return documents;
  }

// Update a document
async function updateDocument(documentId, updatedFields) {
  const { client, collection } = await connectToDatabase();
  const result = await collection.updateOne(
    { _id: ObjectId(documentId) },
    { $set: updatedFields }
  );
  client.close();
  return result.modifiedCount;
}

// Delete a document
async function deleteDocument(documentId) {
  const { client, collection } = await connectToDatabase();
  const result = await collection.deleteOne({ _id: ObjectId(documentId) });
  client.close();
  return result.deletedCount;
}

module.exports = {
  createDocument,
  findOneDocument,
  findManyDocuments,
  updateDocument,
  deleteDocument,
};