const { XeroClient } = require("xero-node");

// Xero API credentials
const xeroClient = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID,
  clientSecret: process.env.XERO_CLIENT_SECRET,
  redirectUris: [process.env.XERO_REDIRECT_URI],
  scopes: process.env.XERO_SCOPES.split(" "),
  state: "xero-state",
  httpTimeout: 3000,
});

module.exports = { xeroClient };
