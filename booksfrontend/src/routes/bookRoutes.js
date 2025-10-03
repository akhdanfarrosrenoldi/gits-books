import BookList from "../layouts/book/BookList";
import AddBook from "../layouts/book/AddBook";
import EditBook from "../layouts/book/EditBook";
import ProtectedRoute from "../auth/ProtectedRoute";

export const bookRoutes = [
  {
    path: "/books",
    element: (
      <ProtectedRoute>
        <BookList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/book/add",
    element: (
      <ProtectedRoute>
        <AddBook />
      </ProtectedRoute>
    ),
  },
  {
    path: "/book/edit/:id",
    element: (
      <ProtectedRoute>
        <EditBook />
      </ProtectedRoute>
    ),
  },
];
