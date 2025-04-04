import jwt from "jsonwebtoken";

// Middleware to protect routes (requires a valid token)
export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId, role: decoded.role };

    next();
  } catch (error) {
    console.error("Authorization error:", error); // Debugging log
    res.status(401).json({ message: "Not authorized" });
  }
};

// Middleware to check user roles
export const roleCheck = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied, insufficient permissions" });
  }
  next();
};