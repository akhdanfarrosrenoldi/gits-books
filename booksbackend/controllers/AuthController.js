import prisma from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse 
} from "../utils/responseFormatter.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import logger from "../middleware/logger.js";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

export const me = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  
  if (!token) {
    return unauthorizedResponse(res, "Authentication required");
  }

  const decoded = jwt.verify(token, JWT_SECRET);
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, role: true, username: true, createdAt: true },
  });

  if (!user) {
    return unauthorizedResponse(res, "User not found");
  }

  logger.info("User profile retrieved", { userId: user.id });

  return successResponse(res, user, "User profile retrieved successfully");
});

export const logout = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  logger.info("User logged out", { userId });

  return successResponse(res, null, "Logout successful");
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await prisma.user.findUnique({ 
    where: { email },
    select: {
      id: true,
      email: true,
      username: true,
      passwordHash: true,
      role: true
    }
  });
  
  if (!user) {
    logger.warn("Login attempt with invalid email", { email, ip: req.ip });
    return unauthorizedResponse(res, "Invalid email or password");
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    logger.warn("Login attempt with invalid password", { 
      userId: user.id, 
      email: user.email, 
      ip: req.ip 
    });
    return unauthorizedResponse(res, "Invalid email or password");
  }

  // Generate JWT token
  const token = jwt.sign(
    { 
      userId: user.id, 
      role: user.role,
      email: user.email 
    }, 
    JWT_SECRET, 
    { expiresIn: "24h" }
  );

  // Set secure cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  logger.info("User logged in successfully", { 
    userId: user.id, 
    email: user.email,
    role: user.role,
    ip: req.ip 
  });

  const userData = {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role
  };

  return successResponse(res, userData, "Login successful");
});
