const mongoose = require("mongoose");

const loanApplicationSchema = new mongoose.Schema({
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: "Loan", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  firstName: String,
  lastName: String,
  contactNumber: String,
  nationalId: String,
  incomeSource: String,
  monthlyIncome: Number,
  loanAmount: Number,
  reason: String,
  address: String,
  extraNotes: String,
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  applicationFeeStatus: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
}, { timestamps: true });

module.exports = mongoose.model("LoanApplication", loanApplicationSchema);
