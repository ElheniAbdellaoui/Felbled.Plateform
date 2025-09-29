import DataUriParser from "datauri/parser.js";
import path from "path";
import multer from "multer";
import cloudinary from "cloudinary";

const parser = new DataUriParser();

const getDataUri = (file) => {
  if (!file) return null;
  return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
};

const storage = multer.memoryStorage();
export const singleUpload = multer({ storage }).single("file");

export default getDataUri;
