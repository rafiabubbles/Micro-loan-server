const verifyToken = require("./verifyToken");

const verifyManager = (req, res, next) => {
  verifyToken(req, res, () => {
    console.log("Decoded JWT:", req.user); // ✅ add this line
    if (req.user.role !== "manager") {
      console.log("Forbidden: User is not manager"); // ✅ add this
      return res.status(403).json({ message: "Forbidden: Manager only" });
    }
    console.log("User is manager, proceeding"); // ✅ add this
    next();
  });
};

module.exports = verifyManager;
