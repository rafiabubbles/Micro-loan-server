// middleware/verifyToken.js

// ⚠️ নিশ্চিত করুন যে আপনার Firebase Admin SDK কনফিগারেশন ফাইলটি ../config/firebaseAdmin
// পাথে আছে। যদি অন্য কোথাও থাকে, তবে পাথটি পরিবর্তন করুন।
const admin = require("../config/firebaseAdmin"); 

const verifyToken = async (req, res, next) => {
    // 1️⃣ Header থেকে Token সংগ্রহ
    let token;
    // টোকেনটি 'Bearer <token>' ফরম্যাটে Authorization হেডারে থাকে
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    } 
    // যদি ফ্রন্টএন্ড থেকে কুকিতে টোকেন পাঠানো হয় (যদি আপনি Firebase Auth এর সাথে কাস্টম কুকি ব্যবহার করেন)
    // else if (req.cookies.token) {
    //     token = req.cookies.token;
    // }

    if (!token) {
        // যদি টোকেন না পাওয়া যায়, তবে 401 Unauthorized
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        // 2️⃣ Firebase Admin SDK দিয়ে টোকেন যাচাই ও ডিকোড
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        // 3️⃣ req.user এ ডেটা সংযুক্ত
        // decodedToken এ uid, email, এবং অন্যান্য ক্লেইম থাকে।
        req.user = decodedToken; 
        
        // 💡 যদি আপনার অন্যান্য রুটে (যেমন /my-loans) শুধুমাত্র req.user.email প্রয়োজন হয়, 
        // তবে এটি নিশ্চিত করে যে email প্রোপার্টিটি সহজেই পাওয়া যাচ্ছে।
        req.user.email = decodedToken.email;
        req.user.id = decodedToken.uid; // বা Firebase UID 
        
        // সব ঠিক থাকলে পরের মিডলওয়্যার/কন্ট্রোলারে যান
        next();
    } catch (err) {
        // টোকেন Invalid, Expired, বা অন্য কোনো সমস্যা হলে 403 Forbidden
        console.error("Firebase Token Verification Failed:", err.message);
        return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
};

module.exports = verifyToken;