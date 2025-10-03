# 📚 Gits Books API Documentation

## Overview

The Gits Books API is a RESTful web service for managing books, authors, and publishers. It provides comprehensive CRUD operations with advanced features like search, filtering, sorting, and pagination.

## Base URL

```
http://localhost:5000
```

## Authentication

The API uses JWT (JSON Web Token) authentication with HTTP-only cookies.

### Login Required

All endpoints except `/health` and `/auth/login` require authentication.

### ⚠️ Security Notice

- **Development**: Use test credentials provided in Postman collection
- **Production**: Change default credentials immediately
- **Environment Variables**: Store sensitive data in environment variables
- **HTTPS**: Always use HTTPS in production

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Success Response with Pagination
```json
{
  "success": true,
  "message": "Found 25 books",
  "data": [...],
  "pagination": {
    "totalItems": 25,
    "totalPages": 3,
    "currentPage": 1,
    "perPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextPage": 2,
    "prevPage": null
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [...], // Optional validation errors
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Common Query Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | integer | Page number | 1 |
| `limit` | integer | Items per page | 10 (books), 30 (authors/publishers) |
| `search` | string | Search term | - |
| `sortBy` | string | Field to sort by | id |
| `sortOrder` | string | Sort direction (asc/desc) | asc |

## Health Check

### GET /health

Check API server status.

**Response:**
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600.123,
  "environment": "development"
}
```

## Authentication Endpoints

### POST /auth/login

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "your_email@example.com",
  "password": "your_password"
}
```

**Test Credentials (Development Only):**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": 1,
    "email": "admin@example.com",
    "username": "admin",
    "role": "ADMIN"
  }
}
```

**Error Responses:**
- `401` - Invalid email or password
- `400` - Validation error

### GET /auth/me

Get current authenticated user profile.

**Success Response (200):**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "id": 1,
    "email": "admin@example.com",
    "username": "admin",
    "role": "ADMIN",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST /auth/logout

Logout current user and clear JWT cookie.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

## Books Endpoints

### GET /books

Get all books with pagination, search, filtering, and sorting.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search in title and description |
| `authorId` | integer | Filter by author ID |
| `publisherId` | integer | Filter by publisher ID |
| `publishedYear` | string | Year range filter (format: "min,max") |
| `title` | string | Filter by title (partial match) |
| `sortBy` | string | Sort by: id, title, publishedYear, createdAt |

**Example Requests:**
```
GET /books?page=1&limit=5
GET /books?search=programming
GET /books?authorId=1&publishedYear=2000,2020
GET /books?sortBy=title&sortOrder=desc
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Found 25 books",
  "data": [
    {
      "id": 1,
      "title": "Clean Code",
      "description": "A handbook of agile software craftsmanship",
      "publishedYear": 2008,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "author": {
        "id": 1,
        "name": "Robert C. Martin"
      },
      "publisher": {
        "id": 1,
        "name": "Prentice Hall"
      }
    }
  ],
  "pagination": { ... }
}
```

### GET /books/:id

Get a specific book by ID.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Book retrieved successfully",
  "data": {
    "id": 1,
    "title": "Clean Code",
    "description": "A handbook of agile software craftsmanship",
    "publishedYear": 2008,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "author": {
      "id": 1,
      "name": "Robert C. Martin",
      "bio": "Software engineer and author"
    },
    "publisher": {
      "id": 1,
      "name": "Prentice Hall",
      "address": "Upper Saddle River, NJ"
    }
  }
}
```

**Error Responses:**
- `400` - Invalid book ID
- `404` - Book not found

### POST /books

Create a new book.

**Request Body:**
```json
{
  "title": "Clean Code",
  "description": "A handbook of agile software craftsmanship",
  "publishedYear": 2008,
  "authorId": 1,
  "publisherId": 1
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": { ... }
}
```

**Error Responses:**
- `400` - Validation error
- `404` - Author or Publisher not found

### PATCH /books/:id

Update an existing book.

**Request Body:**
```json
{
  "title": "Clean Code: Updated Edition",
  "description": "Updated description",
  "publishedYear": 2009
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": { ... }
}
```

**Error Responses:**
- `400` - Invalid book ID or validation error
- `404` - Book, Author, or Publisher not found

### DELETE /books/:id

Delete a book.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Book deleted successfully",
  "data": null
}
```

**Error Responses:**
- `400` - Invalid book ID
- `404` - Book not found

## Authors Endpoints

### GET /authors

Get all authors with pagination, search, filtering, and sorting.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search in name and bio |
| `name` | string | Filter by name (partial match) |
| `sortBy` | string | Sort by: id, name, createdAt |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Found 15 authors",
  "data": [
    {
      "id": 1,
      "name": "Robert C. Martin",
      "bio": "Software engineer and author",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "books": [
        {
          "id": 1,
          "title": "Clean Code",
          "publishedYear": 2008
        }
      ],
      "_count": {
        "books": 3
      }
    }
  ],
  "pagination": { ... }
}
```

### GET /authors/:id

Get a specific author by ID with their books.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Author retrieved successfully",
  "data": {
    "id": 1,
    "name": "Robert C. Martin",
    "bio": "Software engineer and author",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "books": [
      {
        "id": 1,
        "title": "Clean Code",
        "description": "A handbook...",
        "publishedYear": 2008,
        "publisher": {
          "id": 1,
          "name": "Prentice Hall"
        }
      }
    ],
    "_count": {
      "books": 3
    }
  }
}
```

### POST /authors

Create a new author.

**Request Body:**
```json
{
  "name": "Robert C. Martin",
  "bio": "Software engineer and author"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Author created successfully",
  "data": { ... }
}
```

**Error Responses:**
- `400` - Validation error
- `409` - Author with this name already exists

### PATCH /authors/:id

Update an existing author.

**Request Body:**
```json
{
  "name": "Robert Cecil Martin",
  "bio": "Updated bio"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Author updated successfully",
  "data": { ... }
}
```

### DELETE /authors/:id

Delete an author (only if they have no books).

**Success Response (200):**
```json
{
  "success": true,
  "message": "Author deleted successfully",
  "data": null
}
```

**Error Responses:**
- `400` - Cannot delete author with associated books
- `404` - Author not found

## Publishers Endpoints

### GET /publishers

Get all publishers with pagination, search, filtering, and sorting.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search in name and address |
| `name` | string | Filter by name (partial match) |
| `address` | string | Filter by address (partial match) |
| `sortBy` | string | Sort by: id, name, createdAt |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Found 10 publishers",
  "data": [
    {
      "id": 1,
      "name": "Prentice Hall",
      "address": "Upper Saddle River, NJ",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "books": [
        {
          "id": 1,
          "title": "Clean Code",
          "publishedYear": 2008
        }
      ],
      "_count": {
        "books": 5
      }
    }
  ],
  "pagination": { ... }
}
```

### GET /publishers/:id

Get a specific publisher by ID with their books.

### POST /publishers

Create a new publisher.

**Request Body:**
```json
{
  "name": "Prentice Hall",
  "address": "Upper Saddle River, NJ"
}
```

### PATCH /publishers/:id

Update an existing publisher.

### DELETE /publishers/:id

Delete a publisher (only if they have no books).

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (Duplicate) |
| 429 | Too Many Requests (Rate Limited) |
| 500 | Internal Server Error |

## Rate Limiting

- **General endpoints**: 100 requests per 15 minutes
- **Authentication endpoints**: 5 requests per 15 minutes
- **API endpoints**: 1000 requests per hour (for authenticated users)

## Security Features

- JWT authentication with HTTP-only cookies
- Helmet.js security headers
- Rate limiting
- Input validation and sanitization
- SQL injection prevention (Prisma ORM)
- CORS configuration

## Logging

All requests and errors are logged with the following information:
- Request method, URL, and parameters
- Response status code and duration
- User ID (if authenticated)
- IP address and User-Agent
- Error details and stack traces

## Development

### Environment Variables

```env
APP_PORT=5000
DATABASE_URL="mysql://user:password@localhost:3306/gits_books"
JWT_SECRET="your-secret-key"
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
LOG_LEVEL="info"
```

### Running the Server

```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Seed database
npm run seed

# Start development server
npm start
```

### Testing with REST Client

Use the provided `request.rest` file with VS Code REST Client extension for comprehensive API testing.
