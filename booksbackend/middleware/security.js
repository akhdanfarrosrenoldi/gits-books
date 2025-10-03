import helmet from "helmet";
import rateLimit from "express-rate-limit";
import logger from "./logger.js";

// Helmet configuration for security headers
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for API
});

// Rate limiting configuration
export const createRateLimit = (
  windowMs = 15 * 60 * 1000,
  max = 100,
  message = "Too many requests"
) => {
  return rateLimit({
    windowMs, // 15 minutes default
    max, // limit each IP to max requests per windowMs
    message: {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
      logger.warn("Rate limit exceeded", {
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        url: req.url,
        method: req.method,
      });

      res.status(429).json({
        success: false,
        message,
        timestamp: new Date().toISOString(),
      });
    },
  });
};

// General rate limit (1000 requests per 15 minutes )
export const generalRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  1000, // 1000 requests
  "Too many requests from this IP, please try again later"
);

// Rate limit untuk auth endpoints (50 requests per 15 minutes )
export const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  50, // 50 requests
  "Too many authentication attempts, please try again later"
);

// API rate limit (10000 requests per hour untuk authenticated users)
export const apiRateLimit = createRateLimit(
  60 * 60 * 1000, // 1 hour
  10000, // 10000 requests
  "API rate limit exceeded"
);

// IP whitelist middleware (optional)
export const ipWhitelist = (allowedIPs = []) => {
  return (req, res, next) => {
    if (allowedIPs.length === 0) {
      return next(); // No whitelist configured
    }

    const clientIP = req.ip || req.connection.remoteAddress;

    if (!allowedIPs.includes(clientIP)) {
      logger.warn("IP not whitelisted", { ip: clientIP });
      return res.status(403).json({
        success: false,
        message: "Access denied",
        timestamp: new Date().toISOString(),
      });
    }

    next();
  };
};

// Request size limiter
export const requestSizeLimit = (limit = "10mb") => {
  return (req, res, next) => {
    const contentLength = req.get("Content-Length");

    if (contentLength) {
      const sizeInMB = parseInt(contentLength) / (1024 * 1024);
      const limitInMB = parseInt(limit);

      if (sizeInMB > limitInMB) {
        logger.warn("Request size exceeded", {
          size: `${sizeInMB}MB`,
          limit: `${limitInMB}MB`,
          ip: req.ip,
        });

        return res.status(413).json({
          success: false,
          message: "Request entity too large",
          timestamp: new Date().toISOString(),
        });
      }
    }

    next();
  };
};
