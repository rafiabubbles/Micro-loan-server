const router = require("express").Router();
// ⚠️ LoanApplication মডেলটি ইমপোর্ট করতে হবে, না হলে LoanApplication.find() কাজ করবে না।
const LoanApplication = require("../models/LoanApplication"); 
const { applyLoan, getAllApplications, getMyApplications, updateStatus } = require("../controllers/loanApplicationController"); 
const verifyToken = require("../middleware/verifyToken");
const verifyManager = require("../middleware/verifyManager");


// --- 1. POST /api/loan-applications/apply রুটটি সেট করা ---

// ⚠️ এখানে apply রুটটি '/apply' হিসেবে সেট করা হচ্ছে, যাতে ফ্রন্টএন্ডের কলটি (api.post('/api/loan-applications/apply')) কাজ করে।
// 💡 আপনার দেওয়া কোডে router.post("/") রুটটি দুইবার ডিফাইন করা ছিল।
router.post("/apply", verifyToken, applyLoan); 


// --- 2. GET /api/loan-applications/my-loans রুটটি সেট করা ---

// ⚠️ আপনার দেওয়া কোডে GET /my-loans রুটটিও দুবার ডিফাইন করা ছিল। 
router.get("/my-loans", verifyToken, async (req, res) => {
  try {
    // 💡 যেহেতু কন্ট্রোলারে userEmail ব্যবহার করার কথা, তাই এখানেও userEmail দিয়ে ফিল্টার করা হচ্ছে।
    const apps = await LoanApplication.find({ userEmail: req.user.email }) 
      .populate("loanId", "title interest"); // ⚠️ নিশ্চিত করুন যে Loan মডেলে title এবং interest ফিল্ড আছে।
    
    res.status(200).json(apps);
  } catch (err) {
    console.error("Error fetching user loans:", err); // 💡 ডিবাগিং-এর জন্য এরর মেসেজ
    res.status(500).json({ message: "Failed to fetch user loans", error: err.message });
  }
});


// --- 3. ম্যানেজার এবং অন্যান্য রুট ---

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