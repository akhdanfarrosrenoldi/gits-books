import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import dotenv from "dotenv";

// Import routes
import BookRoute from "./routes/BookRoute.js";
import AuthorRoute from "./routes/AuthorRoute.js";
import PublisherRoute from "./routes/PublisherRoute.js";
import AuthRoute from "./routes/AuthRoute.js";

// Import middleware
import { morganMiddleware, requestLogger } from "./middleware/logger.js";
import { globalErrorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { 
  helmetConfig, 
  generalRateLimit, 
  authRateLimit, 
  apiRateLimit 
} from "./middleware/security.js";
import logger from "./middleware/logger.js";

dotenv.config();

const app = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Security middleware
app.use(helmetConfig);
app.use(generalRateLimit);

// Compression middleware
app.use(compression());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging middleware
app.use(morganMiddleware);
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes with rate limiting
app.use("/auth", authRateLimit, AuthRoute);
app.use("/books", apiRateLimit, BookRoute);
app.use("/authors", apiRateLimit, AuthorRoute);
app.use("/publishers", apiRateLimit, PublisherRoute);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 5000;

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
});
