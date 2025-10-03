import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/BookController.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  createBookSchema,
  updateBookSchema,
} from "../validations/bookValidation.js";

const router = express.Router();

// Apply authentication to all book routes
router.use(authenticate);

// Book routes with validation
router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", validateRequest(createBookSchema), createBook);
router.patch("/:id", validateRequest(updateBookSchema), updateBook);
router.delete("/:id", deleteBook);

export default router;
