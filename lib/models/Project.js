import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "",
    },
    year: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    href: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation during development
const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);

export default Project;
