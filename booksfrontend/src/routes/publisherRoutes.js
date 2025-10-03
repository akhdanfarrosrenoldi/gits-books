import PublisherList from "../layouts/publisher/PublisherList";
import AddPublisher from "../layouts/publisher/AddPublisher";
import EditPublisher from "../layouts/publisher/EditPublisher";
import ProtectedRoute from "../auth/ProtectedRoute";

export const publisherRoutes = [
  {
    path: "/publishers",
    element: (
      <ProtectedRoute>
        <PublisherList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/publishers/add",
    element: (
      <ProtectedRoute>
        <AddPublisher />
      </ProtectedRoute>
    ),
  },
  {
    path: "/publishers/edit/:id",
    element: (
      <ProtectedRoute>
        <EditPublisher />
      </ProtectedRoute>
    ),
  },
];
