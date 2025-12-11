const LoanApplication = require("../models/LoanApplication");
const User = require("../models/User");

exports.applyLoan = async (req, res) => {
    try {
      // 💡 req.body থেকে সমস্ত প্রয়োজনীয় ডেটা ডিস্ট্রাকচার করুন
      const applicationData = req.body;
      const { loanId, userEmail } = applicationData; 
      
      // ⚠️ req.user.id ব্যবহার করে সেভ করার দরকার নেই, কারণ আপনি front-end এ userEmail পাঠাচ্ছেন
  
      const newApplication = new LoanApplication({
        // user: req.user.id, // ⚠️ এই লাইনটি আর প্রয়োজন নেই
        // loan: loanId, // ⚠️ এই লাইনটি আর প্রয়োজন নেই
        ...applicationData // 💡 সমস্ত ডেটা একবারে সেভ করুন
  
      });
  
      await newApplication.save();
      
      // 💡 Borrower এর User ডকুমেন্ট আপডেট করা (My Loans দেখানোর জন্য)
      const updatedUser = await User.findOneAndUpdate(
          { email: userEmail },
          { $push: { loanApplications: newApplication._id } }, 
          { new: true }
      );
      
      if (!updatedUser) {
           console.warn(`User with email ${userEmail} not found in MongoDB. Application submitted but user profile not updated.`);
      }
  
      res.status(201).json({ message: "Loan application submitted", newApplication });
    } catch (error) {
      console.error("Loan Submission Error:", error);
      res.status(500).json({ message: "Error submitting loan application", error: error.message });
    }
  };


// Get all applications (Admin or Manager)
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await LoanApplication.find()
      .populate("user", "name email")
      .populate("loan", "name interest");

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications", error });
  }
};

// Get user own applications
exports.getMyApplications = async (req, res) => {
  try {
    const apps = await LoanApplication.find({ user: req.user.id })
      .populate("loan", "name interest");

    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your applications", error });
  }
};

// Update application status (Admin or Manager only)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await LoanApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({ message: "Status updated", updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status", error });
  }
};
