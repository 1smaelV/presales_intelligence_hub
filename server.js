import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME || 'intelligence_hub_db';
const briefCollectionName = process.env.MONGO_COLLECTION_BRIEF || 'brief';
const questionsCollectionName =
  process.env.MONGO_COLLECTION_DISCOVERY_QUESTIONS || 'discovery_questions';
const port = process.env.PORT || 3001;

if (!mongoUri) {
  console.error('Missing MONGO_URI. Ensure it is set in your environment or .env file.');
  process.exit(1);
}

const app = express();
app.use(express.json());

let mongoClient;
let dbPromise;

async function getDb() {
  if (!dbPromise) {
    mongoClient = new MongoClient(mongoUri);
    dbPromise = mongoClient.connect().then(client => client.db(dbName)).catch(error => {
      dbPromise = undefined;
      throw error;
    });
  }
  return dbPromise;
}

app.post('/api/briefs', async (req, res) => {
  const { briefData, generatedBrief } = req.body || {};

  if (!generatedBrief) {
    return res.status(400).json({ error: 'Missing generatedBrief payload' });
  }

  try {
    const db = await getDb();
    const collection = db.collection(briefCollectionName);
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

const normalizeCategoriesByRole = docs => {
  const roleBuckets = new Map();

  docs.forEach(doc => {
    const role = typeof doc?.clientRole === 'string' && doc.clientRole ? doc.clientRole : 'All Roles';
    if (!roleBuckets.has(role)) {
      roleBuckets.set(role, new Map());
    }
    const catMap = roleBuckets.get(role);

    if (Array.isArray(doc.categories)) {
      doc.categories.forEach(cat => {
        const name = typeof cat?.name === 'string' ? cat.name : 'General';
        const questions = Array.isArray(cat?.questions) ? cat.questions.filter(Boolean) : [];
        catMap.set(name, [...(catMap.get(name) || []), ...questions]);
      });
    } else if (doc?.category && Array.isArray(doc?.questions)) {
      const name = typeof doc.category === 'string' ? doc.category : 'General';
      catMap.set(name, [...(catMap.get(name) || []), ...doc.questions.filter(Boolean)]);
    }
  });

  return Array.from(roleBuckets.entries()).map(([role, catMap]) => ({
    role,
    categories: Array.from(catMap.entries()).map(([name, questions]) => ({ name, questions })),
  }));
};

async function getRecentBriefQuestions(db, industry, clientRole) {
  const match = { 'brief.industry': industry };
  if (clientRole) {
    match['brief.clientRole'] = clientRole;
  }

  const recentQuestions = await db
    .collection(briefCollectionName)
    .aggregate([
      { $match: match },
      { $sort: { createdAt: -1 } },
      { $project: { questions: '$brief.discoveryQuestions', role: '$brief.clientRole' } },
      { $unwind: '$questions' },
      {
        $group: {
          _id: { question: '$questions', role: '$role' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 30 },
      { $project: { _id: 0, question: '$_id.question', role: '$_id.role' } },
    ])
    .toArray();

  const roleBuckets = new Map();
  recentQuestions.forEach(item => {
    const role = item.role || 'All Roles';
    if (!roleBuckets.has(role)) {
      roleBuckets.set(role, []);
    }
    if (item.question) {
      roleBuckets.get(role).push(item.question);
    }
  });

  return Array.from(roleBuckets.entries()).map(([role, questions]) => ({
    role,
    categories: [{ name: 'Recent Briefs', questions }],
  }));
}

app.get('/api/questions', async (req, res) => {
  const industry = req.query?.industry;
  const clientRole = req.query?.clientRole;

  if (!industry) {
    return res.status(400).json({ error: 'Missing industry parameter' });
  }

  try {
    const db = await getDb();

    const query = { industry };
    if (clientRole) {
      query.clientRole = clientRole;
    }

    const collection = db.collection(questionsCollectionName);

    const [docs, recentFromBriefs] = await Promise.all([
      collection.find(query).toArray(),
      getRecentBriefQuestions(db, industry, clientRole),
    ]);

    const roleCategories = normalizeCategoriesByRole(docs);

    // merge in recent briefs by role
    const merged = [...roleCategories];
    recentFromBriefs.forEach(recentEntry => {
      const existing = merged.find(rc => rc.role === recentEntry.role);
      if (existing) {
        existing.categories = [...recentEntry.categories, ...existing.categories];
      } else {
        merged.unshift(recentEntry);
      }
    });

    res.json({ roleCategories: merged });
  } catch (error) {
    console.error('Failed to load discovery questions', error);
    res.status(500).json({ error: 'Failed to load discovery questions' });
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
