const Loan = require("../models/Loan");
const mongoose = require("mongoose"); 

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

// Get Loan by ID (Detailed View)
const getLoanById = async (req, res) => {
    try {
        const { id } = req.params;

       
        if (!mongoose.Types.ObjectId.isValid(id)) {
            // if id not fount it will show this
            return res.status(404).json({ message: "Loan not found (Invalid ID format)" });
        }

        // 2. use id to find out loan
        const loan = await Loan.findById(id);

        // 3. if loan dont found on database
        if (!loan) {
            return res.status(404).json({ message: "Loan details not found." });
        }

        // 4. when success
        res.status(200).json(loan);
    } catch (error) {
        // 5. when get error
        console.error("Error fetching loan by ID:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

module.exports = { addLoan, getAllLoans, getLoanById };