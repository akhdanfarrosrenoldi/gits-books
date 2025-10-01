import express from "express";
import {
  getPublishers,
  getPublisherById,
  createPublisher,
  updatePublisher,
  deletePublisher,
} from "../controllers/PublisherController.js";

const router = express.Router();

router.get("/", getPublishers);
router.get("/:id", getPublisherById);
router.post("/", createPublisher);
router.patch("/:id", updatePublisher);
router.delete("/:id", deletePublisher);

export default router;
