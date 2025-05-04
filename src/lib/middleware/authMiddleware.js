// // lib/middleware/authMiddleware.js
// import { jwtVerify } from "jose";
// export const authMiddleware = (handler) => async (req, res) => {
//   try {
//     // Works for both Page and App routers
//     const token = req.cookies?.token || req.cookies.get?.("token")?.value;

//     if (!token) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//     const { payload } = await jwtVerify(token, secret);

//     // Attach user to request
//     req.user = payload;

//     return handler(req, res);
//   } catch (error) {
//     console.error("Authentication error:", error);
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };


// lib/middleware/authMiddleware.js
import { jwtVerify } from "jose";

export const authMiddleware = (handler) => async (req, res) => {
  try {
    const token = req.cookies?.token || req.cookies.get?.("token")?.value;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const requestIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const requestUA = req.headers["user-agent"];

    // Compare IP and User-Agent to detect hijacking or replay
    if (payload.ip !== requestIP || payload.ua !== requestUA) {
      return res.status(401).json({ message: "Session hijack detected" });
    }

    req.user = payload;
    return handler(req, res);
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
