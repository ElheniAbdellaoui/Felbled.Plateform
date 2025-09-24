export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.role || !roles.includes(req.role)) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Access denied. You do not have permission",
        });
    }
    next();
  };
};
