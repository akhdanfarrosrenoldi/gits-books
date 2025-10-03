import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import BookList from "./layouts/book/BookList";
import AddBook from "./layouts/book/AddBook";
import EditBook from "./layouts/book/EditBook";

import PublisherList from "./layouts/publisher/PublisherList";
import AddPublisher from "./layouts/publisher/AddPublisher";
import EditPublisher from "./layouts/publisher/EditPublisher";

import AuthorList from "./layouts/author/AuthorList";
import AddAuthor from "./layouts/author/AddAuthor";
import EditAuthor from "./layouts/author/EditAuthor";

import NavBar from "./components/NavBar";
import Login from "./auth/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
import AuthRoute from "./auth/AuthRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route
              path="/"
              element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              }
            />
            <Route path="/login" element={<Navigate to="/" replace />} />

            {/* Books */}
            <Route
              path="/books"
              element={
                <ProtectedRoute>
                  <BookList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book/add"
              element={
                <ProtectedRoute>
                  <AddBook />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book/edit/:id"
              element={
                <ProtectedRoute>
                  <EditBook />
                </ProtectedRoute>
              }
            />

            {/* Publishers */}
            <Route
              path="/publishers"
              element={
                <ProtectedRoute>
                  <PublisherList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/publishers/add"
              element={
                <ProtectedRoute>
                  <AddPublisher />
                </ProtectedRoute>
              }
            />
            <Route
              path="/publishers/edit/:id"
              element={
                <ProtectedRoute>
                  <EditPublisher />
                </ProtectedRoute>
              }
            />

            {/* Authors */}
            <Route
              path="/authors"
              element={
                <ProtectedRoute>
                  <AuthorList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/authors/add"
              element={
                <ProtectedRoute>
                  <AddAuthor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/authors/edit/:id"
              element={
                <ProtectedRoute>
                  <EditAuthor />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
