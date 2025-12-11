// models/usesr.js (সঠিক করা হয়েছে)
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["borrower", "manager", "admin"], default: "borrower" },
  photoURL: { type: String },
  
  // 💡 এই লাইনটি যোগ করুন
  loanApplications: [{ type: mongoose.Schema.Types.ObjectId, ref: "LoanApplication" }]
  
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);