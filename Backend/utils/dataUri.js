import DataUriParser from "datauri/parser.js";
import path from "path";

const parser = new DataUriParser();

const getDataUri = (file) => {
  const ext = path.extname(file.originalname).toString();
  return parser.format(ext, file.buffer).content;
};

export default getDataUri;
