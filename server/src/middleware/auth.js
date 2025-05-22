const xeroService = require("../services/xeroService");

exports.isAuthenticated = async (req, res, next) => {
  try {
    if (!req.session?.tokenSet) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Check if access token is expired
    const tokenExpireTime = new Date(req.session.tokenSet.expires_at * 1000);
    const currentTime = new Date();

    if (tokenExpireTime <= currentTime) {
      try {
        // Refresh the token
        const newTokenSet = await xeroService.refreshToken();
        req.session.tokenSet = newTokenSet;
        await new Promise((resolve, reject) => {
          req.session.save((err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      } catch (error) {
        console.error("Token refresh failed:", error);
        throw new Error("Unauthorized: Invalid token");
      }
    }

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
