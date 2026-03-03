import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { PDFParse } from 'pdf-parse';
import { parseOffice } from 'officeparser';
import mammoth from 'mammoth';
import * as xlsx from 'xlsx';
import { OpenAI } from 'openai';

dotenv.config();

const mongoUri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME || 'intelligence_hub_db';
const briefCollectionName = process.env.MONGO_COLLECTION_BRIEF || 'brief';
const questionsCollectionName =
  process.env.MONGO_COLLECTION_DISCOVERY_QUESTIONS || 'discovery_questions';
const projectsCollectionName = 'projects';
const projectMaterialsCollectionName = 'project_materials';
const chatSessionsCollectionName = 'chat_sessions';
const materialChunksCollectionName = 'material_chunks';
const port = process.env.PORT || 3001;

if (!mongoUri) {
  console.error('Missing MONGO_URI. Ensure it is set in your environment or .env file.');
  process.exit(1);
}

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

let mongoClient;
let dbPromise;

async function getDb() {
  if (!dbPromise) {
    mongoClient = new MongoClient(mongoUri);
    // Node.js >= 17 on Windows often defaults to IPv6, causing local DNS to fail on SRV records.
    // Forcing family: 4 to prioritize IPv4 resolves the ECONNREFUSED error.
    dbPromise = mongoClient.connect({ family: 4 }).then(client => client.db(dbName)).catch(error => {
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

/**
 * Shapes a brief document into a UI-friendly payload.
 * Guards against missing fields and limits the returned content.
 */
const mapBriefListItem = doc => {
  const brief = doc?.brief || {};
  const id =
    doc?._id && typeof doc._id === 'object' && typeof doc._id.toString === 'function'
      ? doc._id.toString()
      : doc?._id || '';
  return {
    id,
    industry: brief.industry || 'Unknown',
    meetingType: brief.meetingType || 'General Meeting',
    clientRole: brief.clientRole || 'All Roles',
    createdAt: doc?.createdAt || null,
    elevatorPitch: typeof brief.elevatorPitch === 'string' ? brief.elevatorPitch : '',
    discoveryQuestions: Array.isArray(brief.discoveryQuestions)
      ? brief.discoveryQuestions.filter(Boolean).slice(0, 20)
      : [],
    industryInsights: Array.isArray(brief.industryInsights)
      ? brief.industryInsights.filter(Boolean).slice(0, 10)
      : [],
    positioning: Array.isArray(brief.positioning)
      ? brief.positioning.filter(Boolean).slice(0, 10)
      : [],
    caseStudy: typeof brief.caseStudy === 'object' && brief.caseStudy !== null
      ? {
        title: brief.caseStudy.title || 'Case study',
        summary: brief.caseStudy.summary || '',
        metrics: Array.isArray(brief.caseStudy.metrics)
          ? brief.caseStudy.metrics.filter(Boolean).slice(0, 10)
          : [],
      }
      : null,
    context: typeof brief.context === 'string' ? brief.context : '',
  };
};

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

app.get('/api/briefs', async (req, res) => {
  try {
    const db = await getDb();
    const collection = db.collection(briefCollectionName);

    const match = {};
    if (req.query?.industry) match['brief.industry'] = req.query.industry;
    if (req.query?.clientRole) match['brief.clientRole'] = req.query.clientRole;

    const docs = await collection
      .find(match)
      .sort({ createdAt: -1 })
      .limit(25)
      .toArray();

    res.json({ briefs: docs.map(mapBriefListItem) });
  } catch (error) {
    console.error('Failed to load briefs', error);
    res.status(500).json({ error: 'Failed to load briefs' });
  }
});

// Projects Endpoints
app.post('/api/projects', async (req, res) => {
  try {
    const db = await getDb();
    const collection = db.collection(projectsCollectionName);
    const project = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        materialCount: 0,
        lastActivityAt: new Date()
      }
    };
    const result = await collection.insertOne(project);
    res.status(201).json({ ...project, _id: result.insertedId });
  } catch (error) {
    console.error('Failed to create project', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const { search, industry, stage } = req.query;
    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (industry) query.industry = industry;
    if (stage) query.salesCycleStage = stage;

    const db = await getDb();
    const docs = await db.collection(projectsCollectionName)
      .find(query)
      .sort({ updatedAt: -1 })
      .toArray();
    res.json(docs);
  } catch (error) {
    console.error('Failed to fetch projects', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const { ObjectId } = await import('mongodb');
    const db = await getDb();
    const doc = await db.collection(projectsCollectionName).findOne({ _id: new ObjectId(req.params.id) });
    if (!doc) return res.status(404).json({ error: 'Project not found' });
    res.json(doc);
  } catch (error) {
    console.error('Failed to fetch project', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const { ObjectId } = await import('mongodb');
    const db = await getDb();
    const update = { ...req.body, updatedAt: new Date() };
    delete update._id;
    await db.collection(projectsCollectionName).updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: update }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to update project', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { ObjectId } = await import('mongodb');
    const id = new ObjectId(req.params.id);
    const db = await getDb();

    // Cascade delete
    await db.collection(projectsCollectionName).deleteOne({ _id: id });
    await db.collection(projectMaterialsCollectionName).deleteMany({ projectId: id });
    await db.collection(materialChunksCollectionName).deleteMany({ projectId: id });
    await db.collection(chatSessionsCollectionName).deleteMany({ projectId: id });

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete project', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Materials Endpoints
app.post('/api/projects/:projectId/materials', upload.single('file'), async (req, res) => {
  try {
    const { projectId } = req.params;
    const { ObjectId } = await import('mongodb');
    const db = await getDb();

    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const material = {
      projectId: new ObjectId(projectId),
      fileName: req.file.originalname,
      fileType: path.extname(req.file.originalname).toLowerCase(),
      fileSize: req.file.size,
      uploadedAt: new Date(),
      processingStatus: 'pending'
    };

    const result = await db.collection(projectMaterialsCollectionName).insertOne(material);
    const materialId = result.insertedId;

    // Trigger async processing
    processMaterial(materialId, req.file.buffer, new ObjectId(projectId));

    // Update project metadata
    await db.collection(projectsCollectionName).updateOne(
      { _id: new ObjectId(projectId) },
      {
        $inc: { 'metadata.materialCount': 1 },
        $set: { 'metadata.lastActivityAt': new Date() }
      }
    );

    res.status(201).json({ ...material, _id: materialId });
  } catch (error) {
    console.error('Failed to upload material', error);
    res.status(500).json({ error: 'Failed to upload material' });
  }
});

app.get('/api/projects/:projectId/materials', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { ObjectId } = await import('mongodb');
    const db = await getDb();
    const docs = await db.collection(projectMaterialsCollectionName)
      .find({ projectId: new ObjectId(projectId) })
      .sort({ uploadedAt: -1 })
      .toArray();
    res.json(docs);
  } catch (error) {
    console.error('Failed to fetch materials', error);
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
});

app.delete('/api/materials/:materialId', async (req, res) => {
  try {
    const { materialId } = req.params;
    const { ObjectId } = await import('mongodb');
    const db = await getDb();

    const material = await db.collection(projectMaterialsCollectionName).findOne({ _id: new ObjectId(materialId) });
    if (!material) return res.status(404).json({ error: 'Material not found' });

    await db.collection(projectMaterialsCollectionName).deleteOne({ _id: new ObjectId(materialId) });
    await db.collection(materialChunksCollectionName).deleteMany({ materialId: new ObjectId(materialId) });

    // Update project metadata
    await db.collection(projectsCollectionName).updateOne(
      { _id: material.projectId },
      {
        $inc: { 'metadata.materialCount': -1 },
        $set: { 'metadata.lastActivityAt': new Date() }
      }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete material', error);
    res.status(500).json({ error: 'Failed to delete material' });
  }
});

// Chat Endpoints
app.get('/api/projects/:projectId/chat', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { ObjectId } = await import('mongodb');
    const db = await getDb();
    const session = await db.collection(chatSessionsCollectionName).findOne({ projectId: new ObjectId(projectId) });
    res.json(session ? session.messages : []);
  } catch (error) {
    console.error('Failed to fetch chat history', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

app.post('/api/projects/:projectId/chat', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { messages } = req.body;
    const { ObjectId } = await import('mongodb');
    const db = await getDb();

    await db.collection(chatSessionsCollectionName).updateOne(
      { projectId: new ObjectId(projectId) },
      {
        $set: {
          messages,
          updatedAt: new Date()
        },
        $setOnInsert: {
          projectId: new ObjectId(projectId),
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    // Update project last activity
    await db.collection(projectsCollectionName).updateOne(
      { _id: new ObjectId(projectId) },
      { $set: { 'metadata.lastActivityAt': new Date() } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to save chat', error);
    res.status(500).json({ error: 'Failed to save chat' });
  }
});

app.delete('/api/projects/:projectId/chat', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { ObjectId } = await import('mongodb');
    const db = await getDb();
    await db.collection(chatSessionsCollectionName).deleteOne({ projectId: new ObjectId(projectId) });
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to clear chat', error);
    res.status(500).json({ error: 'Failed to clear chat' });
  }
});

// RAG Endpoints
app.post('/api/projects/:projectId/query', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { query, topK = 5 } = req.body;
    const { ObjectId } = await import('mongodb');
    const db = await getDb();

    // 1. Generate query embedding
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });
    const queryEmbedding = response.data[0].embedding;

    // 2. Fetch all chunks for the project
    const chunks = await db.collection(materialChunksCollectionName)
      .find({ projectId: new ObjectId(projectId) })
      .toArray();

    if (chunks.length === 0) return res.json([]);

    // 3. Calculate similarity
    const scoredChunks = chunks.map(chunk => ({
      materialId: chunk.materialId,
      fileName: chunk.fileName,
      snippet: chunk.content,
      score: cosineSimilarity(queryEmbedding, chunk.embedding)
    }));

    // 4. Sort and return top K
    const results = scoredChunks
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    res.json(results);
  } catch (error) {
    console.error('RAG Query failed', error);
    res.status(500).json({ error: 'RAG Query failed' });
  }
});

// Helper functions for RAG
async function processMaterial(materialId, buffer, projectId) {
  const { ObjectId } = await import('mongodb');
  try {
    const db = await getDb();
    const material = await db.collection(projectMaterialsCollectionName).findOne({ _id: materialId });

    await db.collection(projectMaterialsCollectionName).updateOne(
      { _id: materialId },
      { $set: { processingStatus: 'processing' } }
    );

    let text = '';
    const ext = material.fileType;

    if (ext === '.pdf') {
      const pdf = new PDFParse({ data: buffer });
      const data = await pdf.getText();
      text = data.text;
    } else if (ext === '.docx') {
      const data = await mammoth.extractRawText({ buffer });
      text = data.value;
    } else if (ext === '.pptx') {
      // Use officeparser for PowerPoint files
      text = await parseOffice(buffer);
    } else if (ext === '.xlsx') {
      const workbook = xlsx.read(buffer, { type: 'buffer' });
      workbook.SheetNames.forEach(name => {
        const sheet = workbook.Sheets[name];
        text += xlsx.utils.sheet_to_txt(sheet) + '\n';
      });
    } else {
      // txt, md, json, csv
      text = buffer.toString('utf-8');
    }

    // Chunking
    const chunks = chunkText(text, 500, 50);

    // Embeddings
    const materialChunks = [];
    for (let i = 0; i < chunks.length; i++) {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: chunks[i],
      });
      materialChunks.push({
        projectId: projectId,
        materialId: materialId,
        fileName: material.fileName,
        chunkIndex: i,
        content: chunks[i],
        embedding: response.data[0].embedding
      });
    }

    if (materialChunks.length > 0) {
      await db.collection(materialChunksCollectionName).insertMany(materialChunks);
    }

    await db.collection(projectMaterialsCollectionName).updateOne(
      { _id: materialId },
      {
        $set: {
          processingStatus: 'ready',
          chunkCount: materialChunks.length
        }
      }
    );

  } catch (error) {
    console.error('Material processing failed', error);
    const db = await getDb();
    await db.collection(projectMaterialsCollectionName).updateOne(
      { _id: materialId },
      {
        $set: {
          processingStatus: 'failed',
          processingError: error.message
        }
      }
    );
  }
}

function chunkText(text, size, overlap) {
  if (typeof text !== 'string') {
    text = String(text || '');
  }
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += (size - overlap)) {
    chunks.push(words.slice(i, i + size).join(' '));
    if (i + size >= words.length) break;
  }
  return chunks;
}

function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let mA = 0;
  let mB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += (vecA[i] * vecB[i]);
    mA += (vecA[i] * vecA[i]);
    mB += (vecB[i] * vecB[i]);
  }
  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  return dotProduct / (mA * mB);
}

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
