const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const admin = require("firebase-admin");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const app = express();
const port = process.env.PORT || 5000;

// --- 1. Firebase Admin Setup ---
try {
  const serviceAccountKey = process.env.FB_SERVICE_KEY;
  if (!serviceAccountKey) throw new Error("FB_SERVICE_KEY is missing!");

  const serviceAccount = JSON.parse(serviceAccountKey);
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase Admin Initialized");
} catch (error) {
  console.error("❌ Firebase Error:", error.message);
}

// --- 2. Middleware ---
app.use(cors());
app.use(express.json());

// --- 3. MongoDB Connection ---
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

async function run() {
  try {
    // DB Name Match with your Atlas
    const db = client.db("loanlinkDB"); 
    
    // Collection Names strictly matching your Atlas
    const usersCollection = db.collection("users");
    const loansCollection = db.collection("loans");
    const applicationCollection = db.collection("loanapplications"); // Fixed name
    const paymentInfoCollection = db.collection("payment_info");

    // --- 4. Auth Middlewares ---
    const verifyToken = async (req, res, next) => {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) return res.status(401).send({ message: "Unauthorized" });
      const token = authHeader.split(" ")[1];
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.decodedEmail = decodedToken.email;
        next();
      } catch (err) {
        return res.status(401).send({ message: "Invalid Token" });
      }
    };

    const verifyAdmin = async (req, res, next) => {
      const user = await usersCollection.findOne({ email: req.decodedEmail });
      if (user?.role !== "admin") return res.status(403).send({ message: "Forbidden" });
      next();
    };

    // --- 5. API Routes ---
    app.get("/", (req, res) => res.send("LoanLink API is Live"));

    // Available Loans for Everyone
    app.get("/loans", async (req, res) => {
      try {
        const result = await loansCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send(error);
      }
    });

    // Role Checking API
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

    // Loan Application
    app.post("/loanApplication", verifyToken, async (req, res) => {
      res.send(await applicationCollection.insertOne(req.body));
    });

    // Manager/Admin: Get All Applications
    app.get("/loanApplications", verifyToken, async (req, res) => {
      res.send(await applicationCollection.find().toArray());
    });

    console.log("🎯 Connect to MongoDB");
  } finally {
    // Keep connection alive
  }
}
run().catch(console.dir);

app.listen(port, () => console.log(`🚀 Server on port ${port}`));