const LoanApplication = require("../models/LoanApplication");

// Create new loan application
exports.applyLoan = async (req, res) => {
  try {
    const { loanId, amount, documents } = req.body;

    const newApplication = new LoanApplication({
      user: req.user.id,
      loan: loanId,
      amount,
      documents
    });

    await newApplication.save();

    res.status(201).json({ message: "Loan application submitted", newApplication });
  } catch (error) {
    res.status(500).json({ message: "Error submitting loan application", error });
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
