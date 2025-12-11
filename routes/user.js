// routes/user.js
const router = require("express").Router();
const User = require("../models/User"); // আপনার ইউজার মডেলটি ইম্পোর্ট করুন

// Get user profile by email (used by AuthContext to fetch role)
router.get("/profile/:email", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // role সহ প্রয়োজনীয় ডেটা পাঠান
        res.status(200).json({ 
            id: user._id, 
            email: user.email, 
            role: user.role || 'borrower', // ডিফল্ট রোল দিন
            name: user.name 
        });
    } catch (err) {
        res.status(500).json(err);
    }
});
router.post("/apply", async (req, res) => {
    try {
        const { email, name } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "Email is required for syncing." });
        }

        // চেক করুন ইউজার আগে থেকেই আছে কিনা
        let user = await User.findOne({ email });

        if (!user) {
            // যদি না থাকে, নতুন ইউজার তৈরি করুন (ডিফল্ট রোল 'borrower')
            user = new User({ 
                email, 
                name: name || 'User', // নাম না থাকলে 'User' সেট করুন
                role: 'borrower', // ডিফল্ট রোল
                loanApplications: [] //
            });
            await user.save();
        }

        // ইউজার ডেটা ফেরত দিন (রোল সহ)
        res.status(200).json(user);
    } catch (err) {
        console.error("User Sync Error:", err);
        res.status(500).json({ message: "Failed to sync user data to MongoDB." });
    }
});


module.exports = router;