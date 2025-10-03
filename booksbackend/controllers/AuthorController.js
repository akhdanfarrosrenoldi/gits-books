import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get all authors with pagination
export const getAuthors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [authors, totalItems] = await Promise.all([
      prisma.author.findMany({
        skip,
        take: limit,
        include: {
          books: true,
        },
        orderBy: { id: "asc" },
      }),
      prisma.author.count(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    if (page > totalPages && totalItems > 0) {
      return res.status(404).json({ msg: "This page does not exist" });
    }

    res.status(200).json({
      data: authors,
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

// Get author by ID
export const getAuthorById = async (req, res) => {
  try {
    const response = await prisma.author.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        books: true,
      },
    });

    if (!response) {
      return res.status(404).json({ msg: "Author not found" });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Create new author
export const createAuthor = async (req, res) => {
  try {
    const { name, bio } = req.body;

    const newAuthor = await prisma.author.create({
      data: {
        name,
        bio,
      },
    });

    res.status(201).json(newAuthor);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Update author
export const updateAuthor = async (req, res) => {
  try {
    const { name, bio } = req.body;

    const updatedAuthor = await prisma.author.update({
      where: { id: Number(req.params.id) },
      data: { name, bio },
    });

    res.status(200).json(updatedAuthor);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete author
export const deleteAuthor = async (req, res) => {
  try {
    await prisma.author.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json({ msg: "Author deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
