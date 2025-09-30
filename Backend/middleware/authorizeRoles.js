export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log("req.user:", req.user); // ← Ajoutez ceci
    console.log("roles:", roles); // ← Ajoutez ceci

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} is not allowed to access this resource`,
      });
    }

    next();
  };
};
