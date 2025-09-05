import dotenv from "dotenv";
import connectDB from "./database/db.js";
import useRoute from "./routes/user.route.js";
import blogRoute from "./routes/blog.route.js";
import commentRoute from "./routes/comment.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();
import cloudinary from "./utils/cloudinary.js"; // Now safe to import
import express from "express";
console.log("🔍 MONGO_URI chargée :", process.env.MONGO_URI);
const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://felblad-plateform.onrender.com",
    credentials: true,
  })
);

const _dirname = path.resolve();
// Routes
app.use("/api/v1/user", useRoute);
app.use("/api/v1/blog", blogRoute);
app.use("/api/v1/comment", commentRoute);

app.use(express.static(path.join(_dirname, "/Frontend/dist")));
//  app.get("*", (_, res) => {
//   res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
//  });
//  Connexion à MongoDB puis démarrage du serveur
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server listening at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
