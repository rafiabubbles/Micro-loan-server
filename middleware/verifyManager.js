const verifyToken = require("./verifyToken");

const verifyManager = (req, res, next) => {
  verifyToken(req, res, () => {
    console.log("Decoded JWT:", req.user); 
    if (req.user.role !== "manager") {
      console.log("Forbidden: User is not manager"); 
      return res.status(403).json({ message: "Forbidden: Manager only" });
    }
    console.log("User is manager, proceeding"); 
    next();
  });
};

module.exports = verifyManager;
