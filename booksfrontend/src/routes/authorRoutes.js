import AuthorList from "../layouts/author/AuthorList";
import AddAuthor from "../layouts/author/AddAuthor";
import EditAuthor from "../layouts/author/EditAuthor";
import ProtectedRoute from "../auth/ProtectedRoute";

export const authorRoutes = [
  {
    path: "/authors",
    element: (
      <ProtectedRoute>
        <AuthorList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/authors/add",
    element: (
      <ProtectedRoute>
        <AddAuthor />
      </ProtectedRoute>
    ),
  },
  {
    path: "/authors/edit/:id",
    element: (
      <ProtectedRoute>
        <EditAuthor />
      </ProtectedRoute>
    ),
  },
];
