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

// Get all authors with pagination, search, filter, and sort
export const getAuthors = asyncHandler(async (req, res) => {
  const queryConfig = {
    searchFields: ['name', 'bio'],
    allowedSortFields: ['id', 'name', 'createdAt'],
    allowedFilters: {
      name: { type: 'string' }
    }
  };

  const { page, limit, skip, take, orderBy, where } = buildCompleteQuery(req, queryConfig);

  logger.info("Authors query", { 
    page, 
    limit, 
    search: req.query.search,
    filters: where,
    sort: orderBy,
    userId: req.user?.userId 
  });

  const [authors, totalItems] = await Promise.all([
    prisma.author.findMany({
      skip,
      take,
      where,
      include: {
        books: {
          select: { id: true, title: true, publishedYear: true }
        },
        _count: {
          select: { books: true }
        }
      },
      orderBy,
    }),
    prisma.author.count({ where }),
  ]);

  const pagination = calculatePagination(totalItems, page, limit);

  if (page > pagination.totalPages && totalItems > 0) {
    return notFoundResponse(res, "This page does not exist");
  }

  return successResponseWithPagination(
    res, 
    authors, 
    pagination, 
    `Found ${totalItems} authors`
  );
});

// Get author by ID
export const getAuthorById = asyncHandler(async (req, res) => {
  const authorId = Number(req.params.id);

  if (isNaN(authorId)) {
    return errorResponse(res, "Invalid author ID", 400);
  }

  const author = await prisma.author.findUnique({
    where: { id: authorId },
    include: {
      books: {
        select: {
          id: true,
          title: true,
          description: true,
          publishedYear: true,
          publisher: {
            select: { id: true, name: true }
          }
        }
      },
      _count: {
        select: { books: true }
      }
    },
  });

  if (!author) {
    return notFoundResponse(res, "Author not found");
  }

  logger.info("Author retrieved", { authorId, userId: req.user?.userId });

  return successResponse(res, author, "Author retrieved successfully");
});

// Create new author
export const createAuthor = asyncHandler(async (req, res) => {
  const { name, bio } = req.body;

  // Check if author with same name already exists
  const existingAuthor = await prisma.author.findFirst({
    where: {
      name: {
        equals: name
      }
    }
  });

  if (existingAuthor) {
    return errorResponse(res, "Author with this name already exists", 409);
  }

  const newAuthor = await prisma.author.create({
    data: {
      name,
      bio,
    },
    include: {
      _count: {
        select: { books: true }
      }
    }
  });

  logger.info("Author created", { 
    authorId: newAuthor.id, 
    name: newAuthor.name,
    userId: req.user?.userId 
  });

  return successResponse(res, newAuthor, "Author created successfully", 201);
});

// Update author
export const updateAuthor = asyncHandler(async (req, res) => {
  const authorId = Number(req.params.id);
  const { name, bio } = req.body;

  if (isNaN(authorId)) {
    return errorResponse(res, "Invalid author ID", 400);
  }

  // Check if author exists
  const existingAuthor = await prisma.author.findUnique({ where: { id: authorId } });
  if (!existingAuthor) {
    return notFoundResponse(res, "Author not found");
  }

  // Check if another author with same name exists (excluding current author)
  if (name && name !== existingAuthor.name) {
    const duplicateAuthor = await prisma.author.findFirst({
      where: {
        name: {
          equals: name
        },
        id: {
          not: authorId
        }
      }
    });

    if (duplicateAuthor) {
      return errorResponse(res, "Author with this name already exists", 409);
    }
  }

  const updatedAuthor = await prisma.author.update({
    where: { id: authorId },
    data: { name, bio },
    include: {
      _count: {
        select: { books: true }
      }
    }
  });

  logger.info("Author updated", { 
    authorId, 
    name: updatedAuthor.name,
    userId: req.user?.userId 
  });

  return successResponse(res, updatedAuthor, "Author updated successfully");
});

// Delete author
export const deleteAuthor = asyncHandler(async (req, res) => {
  const authorId = Number(req.params.id);

  if (isNaN(authorId)) {
    return errorResponse(res, "Invalid author ID", 400);
  }

  // Check if author exists and get book count
  const existingAuthor = await prisma.author.findUnique({ 
    where: { id: authorId },
    select: { 
      id: true, 
      name: true,
      _count: {
        select: { books: true }
      }
    }
  });
  
  if (!existingAuthor) {
    return notFoundResponse(res, "Author not found");
  }

  // Check if author has books
  if (existingAuthor._count.books > 0) {
    return errorResponse(
      res, 
      `Cannot delete author. Author has ${existingAuthor._count.books} book(s) associated.`, 
      400
    );
  }

  await prisma.author.delete({
    where: { id: authorId },
  });

  logger.info("Author deleted", { 
    authorId, 
    name: existingAuthor.name,
    userId: req.user?.userId 
  });

  return successResponse(res, null, "Author deleted successfully");
});
