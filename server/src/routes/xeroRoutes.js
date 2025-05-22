const express = require("express");
const xeroController = require("../controllers/xeroController");
const { isAuthenticated } = require("../middleware/auth");
const router = express.Router();

// Auth routes
router.get("/connect", xeroController.getConsentUrl);
router.get("/callback", xeroController.handleCallback);

// Data routes (protected)
router.get("/tenant", isAuthenticated, xeroController.getTenant);
router.get("/organizations", isAuthenticated, xeroController.getOrganizations);
router.get("/invoices", isAuthenticated, xeroController.getInvoices);
router.get("/invoices/:id", isAuthenticated, xeroController.getInvoiceById);

router.post("/logout", isAuthenticated, xeroController.logout);

module.exports = router;
