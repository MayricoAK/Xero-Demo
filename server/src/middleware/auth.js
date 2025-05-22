const xeroService = require("../services/xeroService");

exports.isAuthenticated = async (req, res, next) => {
  try {
    if (!req.session?.tokenSet) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Check if token needs refreshing
    if (xeroService.isTokenExpired(req.session.tokenSet)) {
      try {

        const newTokenSet = await xeroService.refreshToken(
          req.session.tokenSet
        );

        if (!newTokenSet) {
          throw new Error("Failed to refresh token");
        }

        req.session.tokenSet = newTokenSet;

        await new Promise((resolve, reject) => {
          req.session.save((err) => {
            if (err) {
              console.error("Session save error:", err);
              reject(err);
            } else {
              console.log("Token refreshed and session saved");
              resolve();
            }
          });
        });
      } catch (error) {
        console.error("Token refresh failed:", error);
        req.session.tokenSet = null;
        req.session.activeTenant = null;
        req.session.allTenants = null;

        return res.status(401).json({
          message: "Unauthorized: Token refresh failed",
          error: error.message,
        });
      }
    }

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({
      message: "Unauthorized: Authentication failed",
      error: error.message,
    });
  }
};
