import { useState } from "react";
import xeroService from "@/services/xero";

export function useXero() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch invoices with optional type filter
   * @param {string|null} type - Optional invoice type filter
   * @returns {Promise<Array>} Array of invoice objects
   */
  const fetchInvoices = async (type = null) => {
    try {
      setIsLoading(true);
      setError(null);
      return await xeroService.fetchInvoices(type);
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch invoices";
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch a specific invoice by ID
   * @param {string} id - Invoice ID
   * @returns {Promise<Object>} Invoice object
   */
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
