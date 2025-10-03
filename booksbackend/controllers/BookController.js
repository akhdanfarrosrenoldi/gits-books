import prisma from "../config/database.js";
import { 
  successResponse, 
  successResponseWithPagination, 
  errorResponse, 
  notFoundResponse 
} from "../utils/responseFormatter.js";
import { buildCompleteQuery, calculatePagination } from "../utils/queryHelper.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import logger from "../middleware/logger.js";

// Get all books with pagination, search, filter, and sort
export const getBooks = asyncHandler(async (req, res) => {
  const queryConfig = {
    searchFields: ['title', 'description'],
    allowedSortFields: ['id', 'title', 'publishedYear', 'createdAt'],
    allowedFilters: {
      authorId: { type: 'number' },
      publisherId: { type: 'number' },
      publishedYear: { type: 'range' },
      title: { type: 'string' }
    }
  };

  const { page, limit, skip, take, orderBy, where } = buildCompleteQuery(req, queryConfig);

  logger.info("Books query", { 
    page, 
    limit, 
    search: req.query.search,
    filters: where,
    sort: orderBy,
    userId: req.user?.userId 
  });

  const [books, totalItems] = await Promise.all([
    prisma.book.findMany({
      skip,
      take,
      where,
      include: {
        author: {
          select: { id: true, name: true }
        },
        publisher: {
          select: { id: true, name: true }
        },
      },
      orderBy,
    }),
    prisma.book.count({ where }),
  ]);

  const pagination = calculatePagination(totalItems, page, limit);

  if (page > pagination.totalPages && totalItems > 0) {
    return notFoundResponse(res, "This page does not exist");
  }

  return successResponseWithPagination(
    res, 
    books, 
    pagination, 
    `Found ${totalItems} books`
  );
});

// Get book by ID
export const getBookById = asyncHandler(async (req, res) => {
  const bookId = Number(req.params.id);

  if (isNaN(bookId)) {
    return errorResponse(res, "Invalid book ID", 400);
  }

  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: {
      author: {
        select: { id: true, name: true, bio: true }
      },
      publisher: {
        select: { id: true, name: true, address: true }
      },
    },
  });

  if (!book) {
    return notFoundResponse(res, "Book not found");
  }

  logger.info("Book retrieved", { bookId, userId: req.user?.userId });

  return successResponse(res, book, "Book retrieved successfully");
});

// Create new book
export const createBook = asyncHandler(async (req, res) => {
  const { title, description, publishedYear, authorId, publisherId } = req.body;

  // Verify author and publisher exist
  const [author, publisher] = await Promise.all([
    prisma.author.findUnique({ where: { id: authorId } }),
    prisma.publisher.findUnique({ where: { id: publisherId } })
  ]);

  if (!author) {
    return notFoundResponse(res, "Author not found");
  }

  if (!publisher) {
    return notFoundResponse(res, "Publisher not found");
  }

  const newBook = await prisma.book.create({
    data: {
      title,
      description,
      publishedYear,
      authorId,
      publisherId,
    },
    include: {
      author: {
        select: { id: true, name: true }
      },
      publisher: {
        select: { id: true, name: true }
      },
    },
  });

  logger.info("Book created", { 
    bookId: newBook.id, 
    title: newBook.title,
    userId: req.user?.userId 
  });

  return successResponse(res, newBook, "Book created successfully", 201);
});

// Update book
export const updateBook = asyncHandler(async (req, res) => {
  const bookId = Number(req.params.id);
  const { title, description, publishedYear, authorId, publisherId } = req.body;

  if (isNaN(bookId)) {
    return errorResponse(res, "Invalid book ID", 400);
  }

  // Check if book exists
  const existingBook = await prisma.book.findUnique({ where: { id: bookId } });
  if (!existingBook) {
    return notFoundResponse(res, "Book not found");
  }

  // Verify author and publisher exist if provided
  if (authorId) {
    const author = await prisma.author.findUnique({ where: { id: authorId } });
    if (!author) {
      return notFoundResponse(res, "Author not found");
    }
  }

  if (publisherId) {
    const publisher = await prisma.publisher.findUnique({ where: { id: publisherId } });
    if (!publisher) {
      return notFoundResponse(res, "Publisher not found");
    }
  }

  const updatedBook = await prisma.book.update({
    where: { id: bookId },
    data: {
      title,
      description,
      publishedYear,
      authorId: authorId || existingBook.authorId,
      publisherId: publisherId || existingBook.publisherId,
    },
    include: {
      author: {
        select: { id: true, name: true }
      },
      publisher: {
        select: { id: true, name: true }
      },
    },
  });

  logger.info("Book updated", { 
    bookId, 
    title: updatedBook.title,
    userId: req.user?.userId 
  });

  return successResponse(res, updatedBook, "Book updated successfully");
});

// Delete book
export const deleteBook = asyncHandler(async (req, res) => {
  const bookId = Number(req.params.id);

  if (isNaN(bookId)) {
    return errorResponse(res, "Invalid book ID", 400);
  }

  // Check if book exists
  const existingBook = await prisma.book.findUnique({ 
    where: { id: bookId },
    select: { id: true, title: true }
  });
  
  if (!existingBook) {
    return notFoundResponse(res, "Book not found");
  }

  await prisma.book.delete({
    where: { id: bookId },
  });

  logger.info("Book deleted", { 
    bookId, 
    title: existingBook.title,
    userId: req.user?.userId 
  });

  return successResponse(res, null, "Book deleted successfully");
});
