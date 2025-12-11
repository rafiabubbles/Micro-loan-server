
// models/LoanApplication.js
const mongoose = require("mongoose");

const loanApplicationSchema = new mongoose.Schema({
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: "Loan", required: true },
// userId থেকে userEmail এ পরিবর্তন করা হলো
// 💡 কারণ ফ্রন্টএন্ডে আপনি user.email পাঠাচ্ছেন, user.id নয়।
  // যেহেতু আপনি req.user.id ব্যবহার করছেন না, তাই এটি ObjectId হিসেবে না রাখাই ভালো।
  userEmail: { type: String, required: true }, 

firstName: { type: String, required: true }, // 💡 required যুক্ত করুন
lastName: { type: String, required: true }, // 💡 required যুক্ত করুন
contactNumber: { type: String, required: true }, // 💡 required যুক্ত করুন
nationalId: { type: String, required: true }, // 💡 required যুক্ত করুন
incomeSource: { type: String, required: true }, // 💡 required যুক্ত করুন
monthlyIncome: { type: Number, required: true }, // 💡 required যুক্ত করুন
loanAmount: { type: Number, required: true }, // 💡 required যুক্ত করুন

  // reason থেকে reasonForLoan-এ পরিবর্তন করা হলো
  reasonForLoan: { type: String, required: true }, 

address: { type: String, required: true }, // 💡 required যুক্ত করুন
extraNotes: String,
  
  // 💡 ফ্রন্টএন্ড থেকে আসা এই ফিল্ডগুলিও যোগ করুন
  loanTitle: { type: String, required: true },
  interestRate: { type: Number, required: true },

status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
applicationFeeStatus: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
}, { timestamps: true });

module.exports = mongoose.model("LoanApplication", loanApplicationSchema);






