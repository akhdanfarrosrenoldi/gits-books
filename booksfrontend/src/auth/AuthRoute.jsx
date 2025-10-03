import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/books" replace />;
  }

  return children;
};

export default AuthRoute;
