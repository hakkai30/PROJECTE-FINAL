import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
      enum: ["me", "them"],
      default: "them",
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    ts: {
      type: Number,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: undefined,
    },
  },
  { _id: false }
);

const threadSchema = new mongoose.Schema(
  {
    threadId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    presence: {
      type: String,
      enum: ["online", "offline"],
      default: "online",
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

export const MessageThread = mongoose.model("MessageThread", threadSchema);
