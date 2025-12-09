const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  interest: Number,
  maxLimit: Number,
  EMI: [Number],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  showOnHome: { type: Boolean, default: false },
  images: [String]
}, { timestamps: true });

module.exports = mongoose.model("Loan", loanSchema);
