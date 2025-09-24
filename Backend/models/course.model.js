import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    level: {
      type: String,
      enum: ["primaire", "college", "lycee"],
      required: true,
    },
    prof: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pdfUrl: String,
    videoUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
