import { rateLimit } from "express-rate-limit";
import { db } from "@/lib/config/firebaseConfig";
import SecurityLogModel from "@/lib/modals/SecurityLogModal";

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  handler: async (req, res) => {
    try {
      const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      
      await SecurityLogModel.create(db, {
        eventType: "RATE_LIMIT_EXCEEDED",
        ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
        userAgent: req.headers["user-agent"] || null,
        metadata: { 
          path: req.path,
          method: req.method 
        },
      });

      res.status(429).json({
        success: false,
        message: "Too many requests, please try again later",
        retryAfter: "15 minutes",
      });
    } catch (error) {
      console.error("Failed to log rate limit event:", error);
      res.status(429).json({
        success: false,
        message: "Too many requests, please try again later",
      });
    }
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipFailedRequests: false, // Count failed requests (like 4xx, 5xx)
  skipSuccessfulRequests: false, // Count successful requests
});