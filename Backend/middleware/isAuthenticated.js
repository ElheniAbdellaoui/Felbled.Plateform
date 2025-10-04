import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  try {
    let token;

    // Vérifie d'abord dans les cookies
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // Sinon, vérifie dans les headers (Authorization: Bearer ...)
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Si aucun token trouvé
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated (token missing)",
        success: false,
      });
    }

    // Vérification du token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // ✅ Définit req.user au lieu de req.id
    req.user = { id: decoded.userId }; // ou decoded._id selon ton payload

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};
