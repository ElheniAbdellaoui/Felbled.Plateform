import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config(); // Charger les variables d'environnement

console.log("Cloudinary cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("Cloudinary API key:", process.env.CLOUDINARY_API_KEY);
console.log(
  "Cloudinary API secret:",
  process.env.CLOUDINARY_API_SECRET ? "Loaded" : "Missing"
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;
