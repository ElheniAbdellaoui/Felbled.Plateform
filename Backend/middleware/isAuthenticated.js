import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
    let token;

    // Check cookies first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // Check Authorization header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);

    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    // ✅ Set both req.id and req.user for compatibility
    req.id = decode.userId;
    req.user = { _id: decode.userId };

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};
