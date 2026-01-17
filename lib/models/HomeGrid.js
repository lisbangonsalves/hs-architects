import mongoose from "mongoose";

const HomeGridSchema = new mongoose.Schema(
  {
    position: {
      type: Number,
      required: true,
      min: 1,
      max: 9,
    },
    image: {
      type: String,
      default: "",
    },
    cloudinaryPublicId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation during development
const HomeGrid =
  mongoose.models.HomeGrid || mongoose.model("HomeGrid", HomeGridSchema);

export default HomeGrid;
