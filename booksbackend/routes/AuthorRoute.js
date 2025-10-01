import express from "express";
import {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../controllers/AuthorController.js";

const router = express.Router();

router.get("/", getAuthors);
router.get("/:id", getAuthorById);
router.post("/", createAuthor);
router.patch("/:id", updateAuthor);
router.delete("/:id", deleteAuthor);

export default router;
