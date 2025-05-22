const xeroService = require("../services/xeroService");

class XeroController {
  async getConsentUrl(req, res, next) {
    try {
      const consentUrl = await xeroService.getConsentUrl();
      res.redirect(consentUrl);
    } catch (error) {
      next(error);
    }
  }

  async handleCallback(req, res, next) {
    try {
      const { tokenSet, tenants } = await xeroService.handleCallback(req.url);

      // Save to session
      req.session.tokenSet = tokenSet;
      req.session.allTenants = tenants;
      req.session.activeTenant = tenants[0];

      // Redirect to the frontend
      res.redirect(process.env.FRONTEND_URL || "http://localhost:5173");
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      req.session.tokenSet = null;
      req.session.allTenants = null;
      req.session.activeTenant = null;

      req.session.destroy((err) => {
        if (err) {
          return next(err);
        }
        res.status(200).json({ message: "Successfully logged out from Xero" });
      });
    } catch (error) {
      next(error);
    }
  }

  async getTenant(req, res, next) {
    try {
      if (!req.session.activeTenant) {
        return res.status(401).json({ error: "No active Xero connection" });
      }
      res.json(req.session.activeTenant);
    } catch (error) {
      next(error);
    }
  }

  async getOrganizations(req, res, next) {
    try {
      if (!req.session.activeTenant) {
        return res.status(401).json({ error: "No active Xero connection" });
      }

      // Refresh token if needed
      req.session.tokenSet = await xeroService.refreshToken(
        req.session.tokenSet
      );

      const organizations = await xeroService.getOrganizations(
        req.session.activeTenant.tenantId
      );
      res.json(organizations);
    } catch (error) {
      next(error);
    }
  }

  async getInvoices(req, res, next) {
    try {
      const { where, order, dateFrom, dateTo, page, pageSize } = req.query;

      if (!req.session.activeTenant) {
        return res.status(401).json({ error: "No active Xero connection" });
      }

      req.session.tokenSet = await xeroService.refreshToken(
        req.session.tokenSet
      );

      const params = {
        where: where || undefined,
        order: order || undefined,
        dateFrom: dateFrom ? new Date(dateFrom) : undefined,
        dateTo: dateTo ? new Date(dateTo) : undefined,
        page: page ? parseInt(page, 10) : undefined,
        pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
      };

      Object.keys(params).forEach(
        (key) => params[key] === undefined && delete params[key]
      );

      const invoices = await xeroService.getInvoices(
        req.session.activeTenant.tenantId,
        params
      );
      res.json(invoices);
    } catch (error) {
      console.error("Error in getInvoices controller:", error);
      next(error);
    }
  }
  
  async getInvoiceById(req, res, next) {
    try {
      if (!req.session.activeTenant) {
        return res.status(401).json({ error: "No active Xero connection" });
      }

      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Invoice ID is required" });
      }

      // Refresh token if needed
      req.session.tokenSet = await xeroService.refreshToken(
        req.session.tokenSet
      );

      const invoice = await xeroService.getInvoiceById(
        req.session.activeTenant.tenantId,
        id
      );
      res.json(invoice);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new XeroController();
