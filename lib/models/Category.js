import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    gridImages: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation during development
const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);

export default Category;
