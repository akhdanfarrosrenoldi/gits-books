import Login from "../auth/Login";
import AuthRoute from "../auth/AuthRoute";

export const authRoutes = [
  {
    path: "/",
    element: (
      <AuthRoute>
        <Login />
      </AuthRoute>
    ),
  },
];
