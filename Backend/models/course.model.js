import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    level: {
      type: String,
      enum: ["Primaire", "Collège", "Lycée"],
      default: "Primaire",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // professeur
    pdfUrl: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    published: { type: Boolean, default: false },
    studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);
