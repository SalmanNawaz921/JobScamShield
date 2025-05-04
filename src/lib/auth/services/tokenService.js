import { jwtVerify, SignJWT } from "jose";
import { db } from "@/lib/config/firebaseConfig";
import SecurityLogModel from "@/lib/modals/SecurityLogModal";

export const generateToken = async (user, req) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket.remoteAddress;

  const token = new SignJWT({
    id: user.id,
    email: user.email,
    username: user.username,
    ip,
    ua: req.headers["user-agent"],
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
  console.log("Token generated:", token);
  return token;
};

export const verifyToken = async (token, req) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);

  // Log token verification
  await SecurityLogModel.create(db, {
    userId: payload.id,
    eventType: "TOKEN_VERIFICATION",
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  });

  return payload;
};
