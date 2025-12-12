import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME || 'intelligence_hub_db';
const collectionName = process.env.MONGO_COLLECTION_BRIEF || 'brief';
const port = process.env.PORT || 3001;

if (!mongoUri) {
  console.error('Missing MONGO_URI. Ensure it is set in your environment or .env file.');
  process.exit(1);
}

const app = express();
app.use(express.json());

let mongoClient;
let collectionPromise;

async function getCollection() {
  if (!collectionPromise) {
    mongoClient = new MongoClient(mongoUri);
    collectionPromise = mongoClient
      .connect()
      .then(client => client.db(dbName).collection(collectionName))
      .catch(error => {
        collectionPromise = undefined;
        throw error;
      });
  }
  return collectionPromise;
}

app.post('/api/briefs', async (req, res) => {
  const { briefData, generatedBrief } = req.body || {};

  if (!generatedBrief) {
    return res.status(400).json({ error: 'Missing generatedBrief payload' });
  }

  try {
    const collection = await getCollection();
    const payload = {
      input: briefData || null,
      brief: generatedBrief,
      createdAt: new Date(),
    };
    const result = await collection.insertOne(payload);
    res.status(201).json({ id: result.insertedId });
  } catch (error) {
    console.error('Failed to persist brief', error);
    res.status(500).json({ error: 'Failed to save brief' });
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, 'dist');

app.use(express.static(distPath));
app.get('*', (_, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
