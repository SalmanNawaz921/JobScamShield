// import jwt from "jsonwebtoken";

// export const generateToken = (userData) => {
//   try {
//     // Ensure JWT_SECRET is available (should be in your environment variables)
//     if (!process.env.JWT_SECRET) {
//       throw new Error("JWT_SECRET is not defined in environment variables");
//     }
//     // Create token payload (don't include sensitive data)
//     const payload = {
//       ...userData,
//     };
//     // Generate token with expiration (e.g., 1 day)
//     const token = jwt.sign(payload, process.env.JWT_SECRET, {
//       expiresIn: process.env.JWT_EXPIRE || "1d",
//     });
//     return token;
//   } catch (error) {
//     console.error("Error generating token:", error);
//     throw error; // Or handle it as per your error handling strategy
//   }
// };


// lib/utils/generateToken.js
import { SignJWT } from "jose";

export function generateToken(user, req) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  return new SignJWT({
    id: user.id,
    email: user.email,
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    ua: req.headers["user-agent"],
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}
