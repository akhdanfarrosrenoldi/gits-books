import jwt from "jsonwebtoken";
import { unauthorizedResponse } from "../utils/responseFormatter.js";
import logger from "./logger.js";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey123";

export const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    logger.warn("Authentication failed: No token provided", {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url
    });
    return unauthorizedResponse(res, "Authentication required");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    
    logger.debug("Authentication successful", {
      userId: decoded.userId,
      role: decoded.role,
      url: req.url
    });
    
    next();
  } catch (err) {
    logger.warn("Authentication failed: Invalid token", {
      error: err.message,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url
    });
    
    if (err.name === 'TokenExpiredError') {
      return unauthorizedResponse(res, "Token has expired");
    } else if (err.name === 'JsonWebTokenError') {
      return unauthorizedResponse(res, "Invalid token");
    } else {
      return unauthorizedResponse(res, "Authentication failed");
    }
  }
};

// Role-based authorization middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return unauthorizedResponse(res, "Authentication required");
    }

    if (!roles.includes(req.user.role)) {
      logger.warn("Authorization failed: Insufficient permissions", {
        userId: req.user.userId,
        userRole: req.user.role,
        requiredRoles: roles,
        url: req.url
      });
      
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
        timestamp: new Date().toISOString(),
      });
    }

    next();
  };
};
