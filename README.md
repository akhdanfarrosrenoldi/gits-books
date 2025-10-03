# 📚 Gits Books - Modern Book Management System

A comprehensive full-stack web application for managing books, authors, and publishers with advanced search, filtering, and sorting capabilities.

## 🚀 Tech Stack

### Backend

- **Express.js** - Web framework
- **Prisma ORM** - Database ORM with MySQL
- **JWT** - Authentication & authorization
- **Winston** - Advanced logging system
- **Helmet** - Security middleware
- **Joi** - Input validation
- **Morgan** - HTTP request logging
- **Rate Limiting** - API protection

### Frontend

- **React.js** - UI framework
- **Axios** - HTTP client
- **SWR** - Data fetching & caching
- **Tailwind CSS** - Utility-first CSS framework
- **Debounced Search** - Optimized search experience

### Database

- **MySQL** - Primary database
- **Prisma Migrations** - Database schema management

## ✨ Key Features

### 🔐 Authentication & Security

- JWT-based authentication with HTTP-only cookies
- Role-based access control (ADMIN/USER)
- Rate limiting (General: 100/15min, Auth: 5/15min, API: 1000/hour)
- Security headers with Helmet.js
- Input validation and sanitization

### 📊 Advanced Data Management

- **Search**: Multi-field search across titles, descriptions, names
- **Filter**: Dynamic filtering by author, publisher, year range
- **Sort**: Multiple sort options (ID, name, date, year)
- **Pagination**: Smart pagination with metadata
- **Real-time Updates**: Optimistic UI updates

### 🎯 API Features

- Consistent response format across all endpoints
- Comprehensive error handling with proper HTTP status codes
- Global logging for all requests and errors
- Query parameter validation
- Relationship validation (prevent orphaned data)

### 🎨 Modern UI/UX

- Responsive design for all screen sizes
- Loading states with spinners
- Empty states with helpful messages
- Hover effects and smooth transitions
- Debounced search (800ms delay)
- Toast notifications for errors

## 📁 Project Structure

```
gits-books/
├── 📁 booksbackend/                    # Express.js Backend API
│   ├── 📁 config/
│   │   └── database.js                # Centralized Prisma client
│   ├── 📁 controllers/                # Route handlers & business logic
│   │   ├── AuthController.js          # Authentication & authorization
│   │   ├── BookController.js          # Books CRUD + search/filter
│   │   ├── AuthorController.js        # Authors CRUD + search
│   │   └── PublisherController.js     # Publishers CRUD + search
│   ├── 📁 middleware/                 # Custom middleware stack
│   │   ├── auth.js                   # JWT authentication
│   │   ├── errorHandler.js           # Global error handling (Prisma/MySQL)
│   │   ├── logger.js                 # Winston & Morgan logging
│   │   ├── security.js               # Helmet & rate limiting
│   │   └── validateRequest.js        # Joi input validation
│   ├── 📁 routes/                    # Express route definitions
│   │   ├── AuthRoute.js              # Authentication routes
│   │   ├── BookRoute.js              # Books API routes
│   │   ├── AuthorRoute.js            # Authors API routes
│   │   └── PublisherRoute.js         # Publishers API routes
│   ├── 📁 utils/                     # Utility functions
│   │   ├── responseFormatter.js      # Consistent API responses
│   │   └── queryHelper.js            # Dynamic query building
│   ├── 📁 validations/               # Joi validation schemas
│   │   ├── authValidation.js         # Auth validation rules
│   │   ├── bookValidation.js         # Book validation rules
│   │   ├── authorValidation.js       # Author validation rules
│   │   └── publisherValidation.js    # Publisher validation rules
│   ├── 📁 prisma/                    # Database layer
│   │   ├── schema.prisma             # Database schema
│   │   ├── migrations/               # Database migrations
│   │   └── seed.js                   # Sample data seeder
│   ├── 📁 logs/                      # Application logs
│   │   ├── combined.log              # All logs
│   │   └── error.log                 # Error logs only
│   ├── .env                          # Environment variables
│   └── index.js                      # Main server entry point
│
├── 📁 booksfrontend/                   # React.js Frontend SPA
│   ├── 📁 src/
│   │   ├── 📁 components/            # Reusable UI components
│   │   │   ├── SearchFilter.jsx      # Advanced search & filter component
│   │   │   └── Pagination.jsx        # Reusable pagination component
│   │   ├── 📁 hooks/                 # Custom React hooks
│   │   │   └── useDebounce.js        # Debounced search hook (800ms)
│   │   ├── 📁 layouts/               # Page layouts & containers
│   │   │   ├── 📁 book/              # Books management pages
│   │   │   │   ├── BookList.jsx      # Books listing with search/filter
│   │   │   │   ├── BookAdd.jsx       # Add new book form
│   │   │   │   └── BookEdit.jsx      # Edit book form
│   │   │   ├── 📁 author/            # Authors management pages
│   │   │   │   ├── AuthorList.jsx    # Authors listing with search
│   │   │   │   ├── AuthorAdd.jsx     # Add new author form
│   │   │   │   └── AuthorEdit.jsx    # Edit author form
│   │   │   └── 📁 publisher/         # Publishers management pages
│   │   │       ├── PublisherList.jsx # Publishers listing with search
│   │   │       ├── PublisherAdd.jsx  # Add new publisher form
│   │   │       └── PublisherEdit.jsx # Edit publisher form
│   │   ├── 📁 api/                   # API configuration
│   │   │   └── axios.js              # Axios instance with interceptors
│   │   ├── App.js                    # Main app component
│   │   └── index.js                  # React entry point
│   ├── package.json                  # Frontend dependencies
│   └── tailwind.config.js            # Tailwind CSS configuration
│
└── 📁 docs/                           # Complete documentation
    ├── api.md                        # Comprehensive API documentation
    ├── postman-collection.json       # Postman collection (secure)
    ├── SECURITY.md                   # Security guidelines & best practices
    └── API_TEST_RESULTS.md           # Latest API testing results
```

### 🏗️ Architecture Highlights

#### **Backend (Express.js + Prisma + MySQL)**

- **Centralized Database Connection** - Single Prisma instance
- **Modular Controllers** - Separation of concerns
- **Comprehensive Middleware Stack** - Security, logging, validation
- **Advanced Query Builder** - Dynamic search, filter, sort
- **Consistent API Responses** - Standardized JSON format
- **Robust Error Handling** - Prisma/MySQL specific errors

#### **Frontend (React.js + SWR + Tailwind)**

- **Component-Based Architecture** - Reusable UI components
- **Smart Data Fetching** - SWR with caching & optimistic updates
- **Advanced Search & Filter** - Debounced search with real-time filtering
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Optimized Performance** - Memoization, pagination, smooth UX

#### **Documentation & Security**

- **Complete API Documentation** - All endpoints documented
- **Secure Postman Collection** - Environment variables, no hardcoded secrets
- **Security Guidelines** - Production deployment checklist
- **Testing Results** - Verified API functionality

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd gits-books/booksbackend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env` file:

   ```env
   # Server Configuration
   APP_PORT=5000
   NODE_ENV=development

   # Database
   DATABASE_URL="mysql://username:password@localhost:3306/gits_books"

   # JWT
   JWT_SECRET="your-super-secure-secret-key-min-32-characters"

   # Frontend URL (for CORS)
   FRONTEND_URL="http://localhost:3000"

   # Logging
   LOG_LEVEL="info"
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev

   # Seed database with sample data
   npm run seed
   ```

5. **Start the server**
   ```bash
   nodemon index
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd ../booksfrontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   Frontend will run on `http://localhost:3000`

## 📚 API Documentation

### Base URL

```
http://localhost:5000
```

### Authentication

All API endpoints (except `/health` and `/auth/login`) require JWT authentication via HTTP-only cookies.

### Response Format

All responses follow a consistent format:

**Success Response:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Success with Pagination:**

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
    "hasPrevPage": false
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error description",
  "errors": [...],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Key Endpoints

#### Authentication

- `POST /auth/login` - User login
- `GET /auth/me` - Get current user profile
- `POST /auth/logout` - User logout

#### Books

- `GET /books` - Get all books (with search, filter, sort, pagination)
- `GET /books/:id` - Get book by ID
- `POST /books` - Create new book
- `PATCH /books/:id` - Update book
- `DELETE /books/:id` - Delete book

#### Authors

- `GET /authors` - Get all authors (with search, filter, sort, pagination)
- `GET /authors/:id` - Get author by ID with books
- `POST /authors` - Create new author
- `PATCH /authors/:id` - Update author
- `DELETE /authors/:id` - Delete author (if no books)

#### Publishers

- `GET /publishers` - Get all publishers (with search, filter, sort, pagination)
- `GET /publishers/:id` - Get publisher by ID with books
- `POST /publishers` - Create new publisher
- `PATCH /publishers/:id` - Update publisher
- `DELETE /publishers/:id` - Delete publisher (if no books)

### Query Parameters

| Parameter       | Type    | Description         | Example                    |
| --------------- | ------- | ------------------- | -------------------------- |
| `page`          | integer | Page number         | `?page=1`                  |
| `limit`         | integer | Items per page      | `?limit=10`                |
| `search`        | string  | Search term         | `?search=programming`      |
| `sortBy`        | string  | Sort field          | `?sortBy=title`            |
| `sortOrder`     | string  | Sort direction      | `?sortOrder=desc`          |
| `authorId`      | integer | Filter by author    | `?authorId=1`              |
| `publisherId`   | integer | Filter by publisher | `?publisherId=1`           |
| `publishedYear` | string  | Year range          | `?publishedYear=2000,2020` |

## 🧪 Testing

### Using REST Client (VS Code)

Use the provided `request.rest` file with comprehensive API examples:

```bash
# Navigate to backend directory
cd booksbackend

# Open request.rest in VS Code with REST Client extension
# Test all endpoints with sample data
```

### Manual Testing

1. Start both backend and frontend servers
2. Open `http://localhost:3000`
3. Login with seeded user credentials
4. Test search, filter, and CRUD operations

## 📊 Logging & Monitoring

### Log Files

- **Combined logs**: `logs/combined.log`
- **Error logs**: `logs/error.log`
- **Console output**: Formatted for development

### Log Levels

- `error`: Error messages only
- `warn`: Warnings and errors
- `info`: General information (default)
- `debug`: Detailed debugging information

### Monitoring Features

- Request/response logging with Morgan
- User activity tracking
- Error tracking with stack traces
- Performance metrics (response times)

## 🔒 Security Features

### Implemented Security Measures

- **JWT Authentication**: Secure token-based auth
- **HTTP-Only Cookies**: XSS protection
- **Rate Limiting**: DDoS protection
- **Helmet.js**: Security headers
- **Input Validation**: Joi schema validation
- **SQL Injection Prevention**: Prisma ORM protection
- **CORS Configuration**: Cross-origin protection

### Security Headers

- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer Policy
- And more via Helmet.js

## 🚀 Production Deployment

### Environment Variables for Production

```env
NODE_ENV=production
JWT_SECRET=your-super-secure-production-key
DATABASE_URL=your-production-database-url
FRONTEND_URL=https://yourdomain.com
LOG_LEVEL=warn
```
