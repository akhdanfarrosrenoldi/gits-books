import { Routes, Route, Navigate } from "react-router-dom";
import { authRoutes } from "./authRoutes";
import { bookRoutes } from "./bookRoutes";
import { authorRoutes } from "./authorRoutes";
import { publisherRoutes } from "./publisherRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Authentication Routes */}
      {authRoutes.map((route, index) => (
        <Route key={index} {...route} />
      ))}

      {/* Books Routes */}
      {bookRoutes.map((route, index) => (
        <Route key={index} {...route} />
      ))}

      {/* Authors Routes */}
      {authorRoutes.map((route, index) => (
        <Route key={index} {...route} />
      ))}

      {/* Publishers Routes */}
      {publisherRoutes.map((route, index) => (
        <Route key={index} {...route} />
      ))}

      {/* Redirect /login to / */}
      <Route path="/login" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
