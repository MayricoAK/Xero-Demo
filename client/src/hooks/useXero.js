import { useState } from "react";
import xeroService from "@/services/xero";

export function useXero() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInvoices = async (filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const invoices = await xeroService.fetchInvoices(filters);
      return invoices;
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch invoices";
      setError(errorMessage);
      console.error("Error in useXero hook:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInvoiceById = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      return await xeroService.fetchInvoiceById(id);
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch invoice";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    fetchInvoices,
    fetchInvoiceById,
  };
}

export default useXero;
