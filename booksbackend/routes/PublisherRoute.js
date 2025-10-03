import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  getPublishers,
  getPublisherById,
  createPublisher,
  updatePublisher,
  deletePublisher,
} from "../controllers/PublisherController.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  createPublisherSchema,
  updatePublisherSchema,
} from "../validations/publisherValidation.js";

const router = express.Router();

// Apply authentication to all publisher routes
router.use(authenticate);

// Publisher routes with validation
router.get("/", getPublishers);
router.get("/:id", getPublisherById);
router.post("/", validateRequest(createPublisherSchema), createPublisher);
router.patch("/:id", validateRequest(updatePublisherSchema), updatePublisher);
router.delete("/:id", deletePublisher);

export default router;
