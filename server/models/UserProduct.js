import mongoose from "mongoose";

const userProductSchema = new mongoose.Schema(
  {
    seller: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    sellerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    gender: {
      type: String,
      enum: ["men", "women", "kids", "unisex"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    sizes: {
      type: [String],
      default: ["ONE SIZE"],
    },
    category: {
      type: String,
      enum: ["clothing", "accessories", "bags", "shoes", "home"],
      default: "clothing",
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const UserProduct = mongoose.model("UserProduct", userProductSchema);
