import jwt from "jsonwebtoken";

const authMiddlware = (req, res, next) => {
  //access token from header
  const authHeader = req.headers.authorization || req.get("authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  //handle Bearer token or plain token
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader.trime();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddlware;
