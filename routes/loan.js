const express = require("express");
const router = express.Router();
const { addLoan, getAllLoans } = require("../controllers/loanController");
const verifyManager = require("../middleware/verifyManager");

router.post("/add-loan", verifyManager, addLoan); // ✅ protected
router.get("/", getAllLoans); // public

module.exports = router;
