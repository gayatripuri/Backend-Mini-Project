const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  try {
    console.log('Token:', token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, { algorithms: ['HS256'] });
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

module.exports = authenticateUser;
