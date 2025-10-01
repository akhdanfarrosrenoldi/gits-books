import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get all publishers (include books)
export const getPublishers = async (req, res) => {
  try {
    const response = await prisma.publisher.findMany({
      include: {
        books: true, // karena 1 publisher punya banyak buku
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get publisher by ID
export const getPublisherById = async (req, res) => {
  try {
    const response = await prisma.publisher.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        books: true,
      },
    });

    if (!response) {
      return res.status(404).json({ msg: "Publisher not found" });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Create new publisher
export const createPublisher = async (req, res) => {
  try {
    const { name, address } = req.body;

    const newPublisher = await prisma.publisher.create({
      data: {
        name,
        address,
      },
    });

    res.status(201).json(newPublisher);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Update publisher
export const updatePublisher = async (req, res) => {
  try {
    const { name, address } = req.body;

    const updatedPublisher = await prisma.publisher.update({
      where: { id: Number(req.params.id) },
      data: { name, address },
    });

    res.status(200).json(updatedPublisher);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete publisher
export const deletePublisher = async (req, res) => {
  try {
    await prisma.publisher.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json({ msg: "Publisher deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
