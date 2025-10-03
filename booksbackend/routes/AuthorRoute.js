import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../controllers/AuthorController.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  createAuthorSchema,
  updateAuthorSchema,
} from "../validations/authorValidation.js";

const router = express.Router();

// Apply authentication to all author routes
router.use(authenticate);

// Author routes with validation
router.get("/", getAuthors);
router.get("/:id", getAuthorById);
router.post("/", validateRequest(createAuthorSchema), createAuthor);
router.patch("/:id", validateRequest(updateAuthorSchema), updateAuthor);
router.delete("/:id", deleteAuthor);

export default router;
