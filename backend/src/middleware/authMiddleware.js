const { verifyToken } = require("../utils/auth");

const authenticateAdmin = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const decoded = verifyToken(token);

    req.admin = {
      id: decoded.adminId,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication",
    });
  }
};

module.exports = authenticateAdmin;