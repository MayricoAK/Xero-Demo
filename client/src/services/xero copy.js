import api from "@/utils/api";

export const xeroService = {
  /**
   * Fetch all invoices with optional type filter
   * @param {string|null} type - Optional invoice type filter (ACCREC, ACCPAY)
   * @returns {Promise<Array>} - Array of invoice objects
   */
  async fetchInvoices(type = null) {
    try {
      const params = type ? { where: `Type==${type}` } : {};
      const response = await api.get("/api/xero/invoices", { params });
      console.log("Fetched invoices:", response);
      return response.invoices || [];
    } catch (err) {
      console.error("Error fetching invoices:", err);
      throw err;
    }
  },

  /**
   * Fetch a specific invoice by ID
   * @param {string} id - Invoice ID
   * @returns {Promise<Object>} - Invoice object
   */
  async fetchInvoiceById(id) {
    try {
      const response = await api.get(`/api/xero/invoices/${id}`);
      return response.invoices[0];
    } catch (err) {
      console.error("Error fetching invoice:", err);
      throw err;
    }
  },
};

export default xeroService;
