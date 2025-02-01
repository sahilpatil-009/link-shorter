const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({});

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(404).json({ success: false, message: "Access Denied!" });
  }
  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Login Expired, Please log in again" });
    }
    return res.status(403).json({ success: false, message: "Invalid Token, authentication failed" });
  }
};

module.exports = authMiddleware;
