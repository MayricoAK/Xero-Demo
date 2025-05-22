import { NotFoundPage } from "@/components/ErrorPage";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import SalesInvoicePage from "@/pages/SalesInvoicePage";
import SupplierBillsPage from "@/pages/SupplierBillsPage";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        path: "/",
        element: <HomePage />,
      },
      {
        index: true,
        path: "/home",
        element: <HomePage />,
      },
      {
        index: true,
        path: "/sales-invoice",
        element: <SalesInvoicePage />,
      },
      {
        index: true,
        path: "/supplier-bill",
        element: <SupplierBillsPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
