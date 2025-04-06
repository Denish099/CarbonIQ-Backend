import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();
export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies["token"];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded info to req
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
