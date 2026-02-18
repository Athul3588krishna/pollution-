import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: "JWT secret is not configured" });
    }

    const authHeader = req.header("Authorization") || req.header("authorization");

    if (!authHeader) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.match(/^Bearer\s+(.+)$/i)?.[1] || authHeader;

    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: verified.userId, userId: verified.userId };

    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default authMiddleware;
