import logger from "./logger.js";
import { errorResponse } from "../utils/responseFormatter.js";

// Global error handler middleware
export const globalErrorHandler = (err, req, res, next) => {
  // Log error details
  logger.error("Global Error Handler", {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.userId || null
  });

  // Prisma errors
  if (err.code && err.code.startsWith('P')) {
    return handlePrismaError(err, res);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, "Invalid token", 401);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, "Token expired", 401);
  }

  // Validation errors (Joi)
  if (err.isJoi) {
    const errors = err.details.map(detail => ({
      field: detail.path[0],
      message: detail.message.replace(/['"]/g, "")
    }));
    
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
      timestamp: new Date().toISOString()
    });
  }

  // Prisma ORM errors (MySQL database)
  if (err.name === 'PrismaClientKnownRequestError') {
    return handlePrismaError(err, res);
  }

  // Prisma connection/initialization errors
  if (err.name === 'PrismaClientInitializationError' || err.name === 'PrismaClientUnknownRequestError') {
    logger.error("Prisma connection error", { error: err.message });
    return errorResponse(res, "Database connection error", 503);
  }

  // MySQL/Network connection errors
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    logger.error("MySQL connection error", { error: err.message, code: err.code });
    return errorResponse(res, "Database connection failed", 503);
  }

  // Default error response
  const statusCode = err.statusCode || err.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal Server Error' 
    : err.message;

  return errorResponse(res, message, statusCode);
};

// Handle Prisma-specific errors
const handlePrismaError = (err, res) => {
  switch (err.code) {
    case 'P2002':
      // Unique constraint violation
      const field = err.meta?.target?.[0] || 'field';
      return errorResponse(res, `${field} already exists`, 409);
    
    case 'P2025':
      // Record not found
      return errorResponse(res, "Record not found", 404);
    
    case 'P2003':
      // Foreign key constraint violation
      return errorResponse(res, "Related record not found", 400);
    
    case 'P2014':
      // Required relation violation
      return errorResponse(res, "Required relation missing", 400);
    
    case 'P2021':
      // Table does not exist
      return errorResponse(res, "Database table not found", 500);
    
    case 'P2022':
      // Column does not exist
      return errorResponse(res, "Database column not found", 500);
    
    default:
      logger.error("Unhandled Prisma Error", { code: err.code, message: err.message });
      return errorResponse(res, "Database operation failed", 500);
  }
};

// 404 handler for undefined routes
export const notFoundHandler = (req, res) => {
  return errorResponse(res, `Route ${req.method} ${req.url} not found`, 404);
};

// Async error wrapper
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
