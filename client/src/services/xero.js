import api from "@/utils/api";

export const xeroService = {
  async fetchInvoices(filters = {}) {
    try {
      // Create where clause from filters
      const whereConditions = [];

      if (filters.type) {
        whereConditions.push(`Type=="${filters.type}"`);
      }

      if (filters.status) {
        whereConditions.push(`Status=="${filters.status}"`);
      }

      // Combine conditions with AND if multiple exist
      const params = {};
      if (whereConditions.length > 0) {
        params.where = whereConditions.join(" AND ");
      }

      console.log("Sending request with params:", params);
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
