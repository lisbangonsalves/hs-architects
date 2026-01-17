import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      default: "studio@hsarchitects.com",
    },
    phone: {
      type: String,
      default: "+91 98765 43210",
    },
    address: {
      type: String,
      default: "Mumbai, India",
    },
    note: {
      type: String,
      default: "For project inquiries, collaborations, or general questions—reach out via email.",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Contact || mongoose.model("Contact", ContactSchema);
