const express = require("express");
const router = express.Router();
const { addLoan, getAllLoans, getLoanById } = require("../controllers/loanController");
const verifyManager = require("../middleware/verifyManager");

// Route to add a new loan (Protected by Manager Middleware)
router.post("/add-loan", verifyManager, addLoan); 

// Route to get all available loans (Public)
router.get("/", getAllLoans); 

// Route to get a specific loan by ID (Public, for LoanDetails page)
router.get("/:id", getLoanById); 

module.exports = router;