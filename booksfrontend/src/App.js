import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppRoutes } from "./routes";
import NavBar from "./components/NavBar";

/**
 * Main App Component
 * 
 * Provides the main application structure with:
 * - Router configuration
 * - Authentication context
 * - Global navigation
 * - Route management
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          {/* Global Navigation */}
          <NavBar />
          
          {/* Main Content Area */}
          <main className="container mx-auto px-4 py-6">
            <AppRoutes />
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
