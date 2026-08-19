const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateRequired = (fields) => {
  return (req, res, next) => {
    const missingFields = fields.filter((field) => {
      const value = req.body[field];

      return (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
      );
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
        fields: missingFields,
      });
    }

    next();
  };
};

const validateAdminRegistration = (req, res, next) => {
  const { email, password } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    });
  }

  if (!password || password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must contain at least 8 characters",
    });
  }

  next();
};

module.exports = {
  validateEmail,
  validateRequired,
  validateAdminRegistration,
};