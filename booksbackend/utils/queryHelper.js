/**
 * Query Helper Utilities for filtering, sorting, and pagination
 */

import logger from "../middleware/logger.js";

/**
 * Build pagination parameters
 */
export const buildPagination = (req, defaultLimit = 10) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || defaultLimit));
  const skip = (page - 1) * limit;
  const take = limit;

  return { page, limit, skip, take };
};

/**
 * Build sorting parameters
 */
export const buildSorting = (req, allowedFields = ['id']) => {
  const sortBy = req.query.sortBy || 'id';
  const sortOrder = req.query.sortOrder?.toLowerCase() === "desc" ? "desc" : "asc";

  if (!sortBy || !allowedFields.includes(sortBy)) {
    return { id: "asc" }; // Default sorting
  }

  return { [sortBy]: sortOrder };
};

/**
 * Build search query
 */
export const buildSearchQuery = (req, searchFields = []) => {
  const search = req.query.search?.trim();
  
  if (!search || searchFields.length === 0) {
    return {};
  }

  // Build search conditions (MySQL doesn't support mode: 'insensitive')
  return {
    OR: searchFields.map(field => ({
      [field]: {
        contains: search
      }
    }))
  };
};

/**
 * Build filter conditions
 */
export const buildFilters = (req, allowedFilters = {}) => {
  const filters = {};

  Object.keys(allowedFilters).forEach(key => {
    const value = req.query[key];
    if (value !== undefined && value !== null && value !== "") {
      const filterConfig = allowedFilters[key];
      
      if (filterConfig.type === "number") {
        const numValue = parseInt(value);
        if (!isNaN(numValue)) {
          filters[key] = numValue;
        }
      } else if (filterConfig.type === "string") {
        filters[key] = {
          contains: value
        };
      } else if (filterConfig.type === "range") {
        // Handle range filters like "2000,2020"
        if (typeof value === "string" && value.includes(",")) {
          const [min, max] = value.split(",").map(v => v.trim());
          const rangeFilter = {};
          
          if (min && !isNaN(parseInt(min))) {
            rangeFilter.gte = parseInt(min);
          }
          if (max && !isNaN(parseInt(max))) {
            rangeFilter.lte = parseInt(max);
          }
          
          if (Object.keys(rangeFilter).length > 0) {
            filters[key] = rangeFilter;
          }
        }
      }
    }
  });

  return filters;
};

/**
 * Build complete query with pagination, sorting, search, and filters
 */
export const buildCompleteQuery = (req, config = {}) => {
  const {
    searchFields = [],
    allowedSortFields = ['id'],
    allowedFilters = {},
    defaultLimit = 10
  } = config;

  // Build pagination
  const { page, limit, skip, take } = buildPagination(req, defaultLimit);

  // Build sorting
  const orderBy = buildSorting(req, allowedSortFields);

  // Build search and filters
  const where = {};
  const search = req.query.search?.trim();

  // Add search conditions (MySQL compatible)
  if (search && searchFields.length > 0) {
    where.OR = searchFields.map(field => ({
      [field]: {
        contains: search
      }
    }));
  }

  // Add filter conditions
  const filters = buildFilters(req, allowedFilters);
  Object.assign(where, filters);

  // Log the query for debugging
  logger.info("Query built", {
    page,
    limit,
    search,
    filters: Object.keys(filters).length > 0 ? filters : undefined,
    sort: orderBy
  });

  return {
    page,
    limit,
    skip,
    take,
    where: Object.keys(where).length > 0 ? where : undefined,
    orderBy
  };
};

/**
 * Calculate pagination metadata
 */
export const calculatePagination = (totalItems, currentPage, perPage) => {
  const totalPages = Math.ceil(totalItems / perPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  const nextPage = hasNextPage ? currentPage + 1 : null;
  const prevPage = hasPrevPage ? currentPage - 1 : null;

  return {
    totalItems,
    totalPages,
    currentPage,
    perPage,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage
  };
};
