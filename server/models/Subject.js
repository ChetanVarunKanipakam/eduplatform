import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    imageUrl: {
      type: String,
      default: "", // optional image
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subject", SubjectSchema);
