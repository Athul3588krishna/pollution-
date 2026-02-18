// import dotenv from 'dotenv';
// import pkg from 'jsonwebtoken';
// const { verify } = pkg;

// dotenv.config();

// export default function Auth(req, res, next) {
//     try {
//         const key = req.headers.authorization
//         if (!key) {
//             return res.status(404).send("unauthorized access")
//         }
//         const token = key.split(" ")[1]
//         const auth = verify(token, process.env.JWT_SECRET)
//         req.user = auth
//         next()
//     }
//     catch (error) {
//         return res.status(500).send(error)
//     }
// }


import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
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
