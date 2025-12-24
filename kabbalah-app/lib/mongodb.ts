import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

function getClientPromise(): Promise<MongoClient> {
    if (!uri) {
        throw new Error('Please add your MongoDB URI to environment variables');
    }

    if (clientPromise) {
        return clientPromise;
    }

    if (process.env.NODE_ENV === 'development') {
        // In development mode, use a global variable to preserve the connection across module reloads
        let globalWithMongo = global as typeof globalThis & {
            _mongoClientPromise?: Promise<MongoClient>;
        };

        if (!globalWithMongo._mongoClientPromise) {
            client = new MongoClient(uri, options);
            globalWithMongo._mongoClientPromise = client.connect();
        }
        clientPromise = globalWithMongo._mongoClientPromise;
    } else {
        // In production mode, create a new client
        client = new MongoClient(uri, options);
        clientPromise = client.connect();
    }

    return clientPromise;
}

export default getClientPromise;

// Helper to get database
export async function getDatabase(): Promise<Db> {
    const client = await getClientPromise();
    return client.db('kabbalah_app');
}
