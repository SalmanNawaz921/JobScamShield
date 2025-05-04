import { rateLimit } from "express-rate-limit";
import { db } from "@/lib/config/firebaseConfig";
import SecurityLogModel from "@/lib/modals/SecurityLogModal";

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  handler: async (req, res) => {
    await SecurityLogModel.create(db, {
      eventType: "RATE_LIMIT_EXCEEDED",
      ipAddress: req.ip || req.headers["x-forwarded-for"] || req,
      remoteAddress,
      userAgent: req.headers["user-agent"],
      metadata: { path: req.path },
    });

    res.status(429).json({
      message: "Too many requests, please try again later",
      retryAfter: "15 minutes",
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});
