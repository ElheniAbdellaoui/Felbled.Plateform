import multer from "multer";

// ⚡ Stockage en mémoire
const storage = multer.memoryStorage();

// ⚡ Middleware pour un seul fichier (champ "file")
const singleUpload = multer({ storage }).single("file");

export default singleUpload;
