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

// Get all publishers with pagination, search, filter, and sort
export const getPublishers = asyncHandler(async (req, res) => {
  const queryConfig = {
    searchFields: ['name', 'address'],
    allowedSortFields: ['id', 'name', 'createdAt'],
    allowedFilters: {
      name: { type: 'string' },
      address: { type: 'string' }
    }
  };

  const { page, limit, skip, take, orderBy, where } = buildCompleteQuery(req, queryConfig);

  logger.info("Publishers query", { 
    page, 
    limit, 
    search: req.query.search,
    filters: where,
    sort: orderBy,
    userId: req.user?.userId 
  });

  const [publishers, totalItems] = await Promise.all([
    prisma.publisher.findMany({
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
    prisma.publisher.count({ where }),
  ]);

  const pagination = calculatePagination(totalItems, page, limit);

  if (page > pagination.totalPages && totalItems > 0) {
    return notFoundResponse(res, "This page does not exist");
  }

  return successResponseWithPagination(
    res, 
    publishers, 
    pagination, 
    `Found ${totalItems} publishers`
  );
});

// Get publisher by ID
export const getPublisherById = asyncHandler(async (req, res) => {
  const publisherId = Number(req.params.id);

  if (isNaN(publisherId)) {
    return errorResponse(res, "Invalid publisher ID", 400);
  }

  const publisher = await prisma.publisher.findUnique({
    where: { id: publisherId },
    include: {
      books: {
        select: {
          id: true,
          title: true,
          description: true,
          publishedYear: true,
          author: {
            select: { id: true, name: true }
          }
        }
      },
      _count: {
        select: { books: true }
      }
    },
  });

  if (!publisher) {
    return notFoundResponse(res, "Publisher not found");
  }

  logger.info("Publisher retrieved", { publisherId, userId: req.user?.userId });

  return successResponse(res, publisher, "Publisher retrieved successfully");
});

// Create new publisher
export const createPublisher = asyncHandler(async (req, res) => {
  const { name, address } = req.body;

  // Check if publisher with same name already exists
  const existingPublisher = await prisma.publisher.findFirst({
    where: {
      name: {
        equals: name
      }
    }
  });

  if (existingPublisher) {
    return errorResponse(res, "Publisher with this name already exists", 409);
  }

  const newPublisher = await prisma.publisher.create({
    data: {
      name,
      address,
    },
    include: {
      _count: {
        select: { books: true }
      }
    }
  });

  logger.info("Publisher created", { 
    publisherId: newPublisher.id, 
    name: newPublisher.name,
    userId: req.user?.userId 
  });

  return successResponse(res, newPublisher, "Publisher created successfully", 201);
});

// Update publisher
export const updatePublisher = asyncHandler(async (req, res) => {
  const publisherId = Number(req.params.id);
  const { name, address } = req.body;

  if (isNaN(publisherId)) {
    return errorResponse(res, "Invalid publisher ID", 400);
  }

  // Check if publisher exists
  const existingPublisher = await prisma.publisher.findUnique({ where: { id: publisherId } });
  if (!existingPublisher) {
    return notFoundResponse(res, "Publisher not found");
  }

  // Check if another publisher with same name exists (excluding current publisher)
  if (name && name !== existingPublisher.name) {
    const duplicatePublisher = await prisma.publisher.findFirst({
      where: {
        name: {
          equals: name
        },
        id: {
          not: publisherId
        }
      }
    });

    if (duplicatePublisher) {
      return errorResponse(res, "Publisher with this name already exists", 409);
    }
  }

  const updatedPublisher = await prisma.publisher.update({
    where: { id: publisherId },
    data: { name, address },
    include: {
      _count: {
        select: { books: true }
      }
    }
  });

  logger.info("Publisher updated", { 
    publisherId, 
    name: updatedPublisher.name,
    userId: req.user?.userId 
  });

  return successResponse(res, updatedPublisher, "Publisher updated successfully");
});

// Delete publisher
export const deletePublisher = asyncHandler(async (req, res) => {
  const publisherId = Number(req.params.id);

  if (isNaN(publisherId)) {
    return errorResponse(res, "Invalid publisher ID", 400);
  }

  // Check if publisher exists and get book count
  const existingPublisher = await prisma.publisher.findUnique({ 
    where: { id: publisherId },
    select: { 
      id: true, 
      name: true,
      _count: {
        select: { books: true }
      }
    }
  });
  
  if (!existingPublisher) {
    return notFoundResponse(res, "Publisher not found");
  }

  // Check if publisher has books
  if (existingPublisher._count.books > 0) {
    return errorResponse(
      res, 
      `Cannot delete publisher. Publisher has ${existingPublisher._count.books} book(s) associated.`, 
      400
    );
  }

  await prisma.publisher.delete({
    where: { id: publisherId },
  });

  logger.info("Publisher deleted", { 
    publisherId, 
    name: existingPublisher.name,
    userId: req.user?.userId 
  });

  return successResponse(res, null, "Publisher deleted successfully");
});
