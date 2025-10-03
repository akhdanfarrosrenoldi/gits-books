import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get all publishers with pagination
export const getPublishers = async (req, res) => {
  try {
    // ambil query params ?page=1&limit=5
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const [publishers, totalItems] = await Promise.all([
      prisma.publisher.findMany({
        skip,
        take: limit,
        include: {
          books: true,
        },
      }),
      prisma.publisher.count(), // total data publisher
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      data: publishers,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
    });
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
