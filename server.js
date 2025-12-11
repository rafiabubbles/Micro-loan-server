// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
const authRoutes = require("./routes/auth");
const loanRoutes = require("./routes/loan");
const loanApplicationRoutes = require("./routes/loanApplication");
const userRoutes = require("./routes/user"); 

app.use("/api/auth", authRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/loan-applications", loanApplicationRoutes);
app.use("/api/user", userRoutes);

// Test route
app.get("/", (req, res) => res.send("Server running"));

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.log("MongoDB connection error:", err));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
