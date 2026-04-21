import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 400,
    },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    img: {
      type: String,
      default: "",
      trim: true,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.model("Post", postSchema);
