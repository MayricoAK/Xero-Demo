const { xeroClient } = require("../config/xero");

class XeroService {
  async getConsentUrl() {
    try {
      const consentUrl = await xeroClient.buildConsentUrl();
      return consentUrl;
    } catch (error) {
      console.error("Error building consent URL:", error);
      throw error;
    }
  }

  async handleCallback(callbackUrl) {
    try {
      const tokenSet = await xeroClient.apiCallback(callbackUrl);
      await xeroClient.updateTenants(false);
      return {
        tokenSet,
        tenants: xeroClient.tenants,
      };
    } catch (error) {
      console.error("Error handling callback:", error);
      throw error;
    }
  }

  async refreshToken(tokenSet) {
    try {
      // Validate input
      if (!tokenSet) {
        throw new Error("TokenSet is required for refresh");
      }

      if (!tokenSet.refresh_token) {
        throw new Error("Refresh token is missing from tokenSet");
      }

      // Check if token actually needs refreshing
      if (!this.isTokenExpired(tokenSet)) {
        console.log("Token is still valid, no refresh needed");
        return tokenSet;
      }

      console.log("Refreshing token...");

      // Perform the refresh
      const newTokenSet = await xeroClient.refreshToken(tokenSet.refresh_token);

      if (!newTokenSet) {
        throw new Error("Failed to get new token from Xero");
      }

      console.log("Token refreshed successfully");
      return newTokenSet;
    } catch (error) {
      console.error("Error refreshing token:", error);

      // Log more details about the error
      if (error.response) {
        console.error("Xero API Error Response:", {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        });
      }

      throw error;
    }
  }

  isTokenExpired(tokenSet) {
    if (!tokenSet || !tokenSet.expires_at) {
      console.log("Token is invalid or missing expires_at");
      return true;
    }

    const expiresAt = tokenSet.expires_at * 1000;
    const now = new Date().getTime();
    const bufferTime = 5 * 60 * 1000; // 5 minutes buffer

    const isExpired = now + bufferTime >= expiresAt;

    if (isExpired) {
      console.log(
        `Token expired. Expires at: ${new Date(
          expiresAt
        )}, Current time: ${new Date(now)}`
      );
    }

    return isExpired;
  }

  async getOrganizations(tenantId) {
    try {
      const response = await xeroClient.accountingApi.getOrganisations(
        tenantId
      );
      return response.body;
    } catch (error) {
      console.error("Error getting organizations:", error);
      throw error;
    }
  }

  async getInvoices(tenantId, params = {}) {
    try {
      const modifiedParams = {
        where: params.where || undefined,
        order: params.order || "updatedDateUTC DESC",
        dateFrom: params.dateFrom ? params.dateFrom.toISOString() : undefined,
        dateTo: params.dateTo ? params.dateTo.toISOString() : undefined,
        page: params.page || undefined,
        pageSize: params.pageSize || undefined,
      };

      // Remove undefined values
      Object.keys(modifiedParams).forEach(
        (key) => modifiedParams[key] === undefined && delete modifiedParams[key]
      );

      const response = await xeroClient.accountingApi.getInvoices(
        tenantId,
        undefined,
        modifiedParams.where,
        modifiedParams.order,
        modifiedParams.dateFrom,
        modifiedParams.dateTo,
        modifiedParams.page,
        modifiedParams.pageSize
      );

      return response.body;
    } catch (error) {
      console.error("Error getting invoices from Xero API:", error.message);
      if (error.response) {
        console.error("Error response body:", error.response.body);
      }
      throw error;
    }
  }

  async getInvoiceById(tenantId, invoiceId) {
    try {
      const response = await xeroClient.accountingApi.getInvoice(
        tenantId,
        invoiceId
      );
      return response.body;
    } catch (error) {
      console.error(`Error getting invoice ${invoiceId}:`, error);
      throw error;
    }
  }
}

module.exports = new XeroService();
