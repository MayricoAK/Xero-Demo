import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppLayout } from "./components/Layout";
import HomePage from "./pages/HomePage";
import { InvoiceDetailsPage } from "./pages/InvoiceDetailsPage";
import { LoginPage } from "./pages/LoginPage";
import SalesInvoicePage from "./pages/SalesInvoicePage";
import SupplierBillsPage from "./pages/SupplierBillsPage";
import { NotFoundPage } from "./components/ErrorPage";

// Protected route component
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto mb-4 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<SalesInvoicePage />} />
            <Route path="invoices" element={<HomePage />} />
            <Route path="sales-invoice" element={<SalesInvoicePage />} />
            <Route path="supplier-bills" element={<SupplierBillsPage />} />
            <Route path="invoices/:id" element={<InvoiceDetailsPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
