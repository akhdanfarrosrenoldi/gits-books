import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../controllers/AuthorController.js";

const router = express.Router();

// router.use(authenticate);

router.get("/", getAuthors);
router.get("/:id", getAuthorById);
router.post("/", createAuthor);
router.patch("/:id", updateAuthor);
router.delete("/:id", deleteAuthor);

export default router;
