const router = require("express").Router();
const LoanApplication = require("../models/LoanApplication");
const verifyToken = require("../middleware/verifyToken");
const verifyManager = require("../middleware/verifyManager");

// Apply for loan (borrower)
// router.post("/", verifyToken, async (req, res) => {
//   try {
//     const newApp = new LoanApplication({ ...req.body, userId: req.user.id });
//     await newApp.save();
//     res.status(201).json(newApp);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

router.post("/", verifyToken, async (req, res) => {
  try {
    const newApp = new LoanApplication({ ...req.body, userId: req.user.id,loanId: req.body.loanId });
    await newApp.save();
    res.status(201).json(newApp);
   } catch (err) {
    console.error("Loan Application Submission Error:", err);
    // এরর হলে পরিষ্কার মেসেজ দিন
    res.status(500).json({ message: "Failed to submit loan application.", error: err.message });
  }
});

// Get my loans (borrower)
router.get("/my-loans", verifyToken, async (req, res) => {
  try {
    const apps = await LoanApplication.find({ userId: req.user.id });
    res.status(200).json(apps);
  } catch (err) {
    res.status(500).json(err);
  }
});
// Get all loan applications (manager/admin)
router.get("/", verifyManager, async (req, res) => {
  try {
    const apps = await LoanApplication.find()
      .populate("userId", "name email role")
      .populate("loanId", "title interest");
      
    res.status(200).json(apps);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Approve/reject loan (manager/admin)
router.put("/:id/status", verifyManager, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedApp = await LoanApplication.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json(updatedApp);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
