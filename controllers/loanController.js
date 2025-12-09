const Loan = require("../models/Loan");

// Add Loan
const addLoan = async (req, res) => {
  try {
    const loan = new Loan(req.body);
    await loan.save();
    res.status(201).json({ message: "Loan added successfully", loan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Loans
const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find();
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Loan by ID
const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: "Loan not found" });
    res.status(200).json(loan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addLoan, getAllLoans, getLoanById };
