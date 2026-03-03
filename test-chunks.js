import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME || 'intelligence_hub_db';

async function run() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(dbName);

        const counts = await db.collection('material_chunks').aggregate([
            {
                $group: {
                    _id: '$materialId',
                    count: { $sum: 1 },
                    fileName: { $first: '$fileName' }
                }
            }
        ]).toArray();

        console.log("Chunks by file:");
        console.log(JSON.stringify(counts, null, 2));

        const total = await db.collection('material_chunks').countDocuments();
        console.log("Total chunks:", total);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await client.close();
    }
}

run();
