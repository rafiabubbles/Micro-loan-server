const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // 1️⃣ Header বা cookie থেকে token
  let token;
  if (req.headers["authorization"]) {
    token = req.headers["authorization"].split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) return res.status(401).json({ message: "Unauthorized: No token" });

  // 2️⃣ JWT verify
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden: Invalid token" });

    console.log("Decoded JWT:", decoded); // ✅ debug
    req.user = decoded; // attach decoded token
    next();
  });
};

module.exports = verifyToken;
