// db.js
const { MongoClient } = require('mongodb');

// MongoDB connection URL
const uri = "mongodb://localhost:27017";

// Database name
const dbName = "AGSS_BV";

// List of collections to create
const collections = [
    "students",
    "whitelist",
    "occasional_visitors",
    "blacklist",
    "approvals",
    "vehicles"
];

async function setupDatabase() {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db(dbName);

        for (let col of collections) {
            const exists = await db.listCollections({ name: col }).hasNext();
            if (!exists) {
                await db.createCollection(col);
                console.log(`Collection created: ${col}`);
            } else {
                console.log(`Collection already exists: ${col}`);
            }
        }

        client.close();
        console.log("Database setup completed!");
    } catch (err) {
        console.error(err);
    }
}

setupDatabase();
