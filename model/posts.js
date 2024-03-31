const { MongoClient, ObjectId } = require('mongodb');

const connectionUrl = process.env.DB_CONNECT_STRING;
const databaseName = "mydb";
const collectionName = "blog";

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
  return result;
}

// Find a single document by ID
async function findOneDocument(documentId) {
  const { client, collection } = await connectToDatabase();
  const document = await collection.findOne({ _id: new ObjectId(documentId) });
  client.close();
  return document;
}

// Find a single document by ID
async function searchDocumentByKeyword(keyword) {
  console.log('⭐',keyword)
  const { client, collection } = await connectToDatabase();
  const document = await collection.find({content: {$regex:keyword}}).toArray();
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
    { _id: new ObjectId(documentId) },
    { $set: updatedFields }
  );
  client.close();
  return result;
}

// Delete a document
async function deleteDocument(documentId) {
  const { client, collection } = await connectToDatabase();
  const result = await collection.deleteOne({ _id: new ObjectId(documentId) });
  client.close();
  return result.deletedCount;
}

async function fetchDataWithPagination(page, limit) {
    const { client, collection } = await connectToDatabase();
    const skip = (page - 1) * limit;
    const data = await collection.find().skip(skip).limit(limit).toArray();
    client.close();
    return data;
}

module.exports = {
  connectToDatabase,
  createDocument,
  findOneDocument,
  findManyDocuments,
  updateDocument,
  deleteDocument,
  fetchDataWithPagination,
  searchDocumentByKeyword
};