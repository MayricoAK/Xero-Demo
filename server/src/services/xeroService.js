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
      if (tokenSet && this.isTokenExpired(tokenSet)) {
        const newTokenSet = await xeroClient.refreshToken(
          tokenSet.refresh_token
        );
        return newTokenSet;
      }
      return tokenSet;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  }

  isTokenExpired(tokenSet) {
    if (!tokenSet || !tokenSet.expires_at) return true;

    const expiresAt = tokenSet.expires_at * 1000;
    const now = new Date().getTime() + 300000;

    return now >= expiresAt;
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

      console.log("Xero API response status:", response.response.statusCode);

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
