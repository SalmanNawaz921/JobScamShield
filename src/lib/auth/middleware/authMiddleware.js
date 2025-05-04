import { verifyToken } from "@/lib/auth/services/tokenService";
import { db } from "@/lib/config/firebaseConfig";
import SecurityLogModel from "@/lib/modals/SecurityLogModal";
import { authRateLimiter } from "./rateLimiter";

export const authMiddleware = (handler) => async (req, res) => {
  try {
    // Apply rate limiting
    // await authRateLimiter(req, res);

    const token =
      req.cookies?.token || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      await SecurityLogModel.create(db, {
        eventType: "AUTH_FAILURE",
        ipAddress: req.ip,
        metadata: { reason: "Missing token" },
      });
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = await verifyToken(token, req);
    req.user = payload;

    return handler(req, res);
  } catch (error) {
    await SecurityLogModel.create(db, {
      eventType: "AUTH_FAILURE",
      ipAddress: req.ip,
      metadata: {
        reason: error.message,
        stack: error.stack,
      },
    });

    return res.status(401).json({
      message: "Authentication failed",
      action: "Please login again",
    });
  }
};
