import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ✅ Get all books (include Author & Publisher)
export const getBooks = async (req, res) => {
  try {
    const response = await prisma.book.findMany({
      include: {
        author: true,
        publisher: true,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✅ Get book by ID
export const getBookById = async (req, res) => {
  try {
    const response = await prisma.book.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        author: true,
        publisher: true,
      },
    });

    if (!response) {
      return res.status(404).json({ msg: "Book not found" });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✅ Create new book
export const createBook = async (req, res) => {
  try {
    const { title, description, publishedYear, authorId, publisherId } =
      req.body;

    const newBook = await prisma.book.create({
      data: {
        title,
        description,
        publishedYear,
        author: { connect: { id: authorId } }, // relasi ke Author
        publisher: { connect: { id: publisherId } }, // relasi ke Publisher
      },
    });

    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✅ Update book
export const updateBook = async (req, res) => {
  try {
    const { title, description, publishedYear, authorId, publisherId } =
      req.body;

    const updatedBook = await prisma.book.update({
      where: { id: Number(req.params.id) },
      data: {
        title,
        description,
        publishedYear,
        author: authorId ? { connect: { id: authorId } } : undefined,
        publisher: publisherId ? { connect: { id: publisherId } } : undefined,
      },
    });

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✅ Delete book
export const deleteBook = async (req, res) => {
  try {
    await prisma.book.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json({ msg: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
