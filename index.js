const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const admin = require("firebase-admin");

const app = express();
const port = process.env.PORT || 5000;

// --- 1. Firebase Admin Setup ---
try {
  const serviceAccountKey = process.env.FB_SERVICE_KEY;
  if (!serviceAccountKey) throw new Error("FB_SERVICE_KEY is missing!");
  const serviceAccount = JSON.parse(serviceAccountKey);
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  console.log("✅ Firebase Admin Initialized");
} catch (error) {
  console.error("❌ Firebase Error:", error.message);
}

// --- 2. Middleware & Hardcoded CORS (Fixes Preflight Error) ---
app.use(express.json());

// CORS config array
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://loan-link-client-aky6.vercel.app/" // Apnar live frontend link ekhane din
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Preflight request (OPTIONS) handle kora
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// --- 3. MongoDB Connection ---
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

async function run() {
  try {
    const db = client.db("loanlinkDB");
    const usersCollection = db.collection("users");
    const loansCollection = db.collection("loans");
    const applicationCollection = db.collection("loanapplications");

    // --- 4. Auth Middlewares ---
    const verifyToken = async (req, res, next) => {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).send({ message: "Unauthorized access" });
      }
      const token = authHeader.split(" ")[1];
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.decodedEmail = decodedToken.email;
        next();
      } catch (err) {
        return res.status(401).send({ message: "Invalid Token" });
      }
    };

    // --- 5. API Routes ---
    app.get("/", (req, res) => res.send("LoanLink API is Live"));

    // Get All Loans (With Pagination support as per your error)
    app.get("/loans", async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const result = await loansCollection.find().skip(skip).limit(limit).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Server Error" });
      }
    });

    // Single Loan Details
    app.get("/loans/all-loans/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await loansCollection.findOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        res.status(400).send({ message: "Invalid ID" });
      }
    });

    app.get("/users/role/:email", verifyToken, async (req, res) => {
      const user = await usersCollection.findOne({ email: req.params.email });
      res.send({ role: user?.role || "user" });
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const exists = await usersCollection.findOne({ email: user.email });
      if (exists) return res.send({ message: "Exists" });
      res.send(await usersCollection.insertOne(user));
    });

    app.post("/loanApplication", verifyToken, async (req, res) => {
      res.send(await applicationCollection.insertOne(req.body));
    });

    app.get("/loanApplications", verifyToken, async (req, res) => {
      res.send(await applicationCollection.find().toArray());
    });

    console.log("🎯 Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}
run().catch(console.dir);

app.listen(port, () => console.log(`🚀 Server on port ${port}`));