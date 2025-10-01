import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  getPublishers,
  getPublisherById,
  createPublisher,
  updatePublisher,
  deletePublisher,
} from "../controllers/PublisherController.js";

const router = express.Router();

// router.use(authenticate);

router.get("/", getPublishers);
router.get("/:id", getPublisherById);
router.post("/", createPublisher);
router.patch("/:id", updatePublisher);
router.delete("/:id", deletePublisher);

export default router;
