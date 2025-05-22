import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export function AppLayout() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              Xero Demo
            </Link>

            {isAuthenticated && (
              <nav className="ml-10">
                <ul className="flex space-x-6">
                  <li>
                    <Link
                      to="/sales-invoice"
                      className="text-gray-600 hover:text-blue-600 font-medium"
                    >
                      Sales Invoices
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/supplier-bills"
                      className="text-gray-600 hover:text-blue-600 font-medium"
                    >
                      Supplier Bills
                    </Link>
                  </li>
                </ul>
              </nav>
            )}
          </div>

          <nav className="flex items-center space-x-4">
            {isAuthenticated && (
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Xero Demo - All rights reserved.
        </div>
      </footer>
    </div>
  );
}
