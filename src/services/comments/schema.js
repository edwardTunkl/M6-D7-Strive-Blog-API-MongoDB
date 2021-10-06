import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    title: { type: String, required: true },
    author: {
      name: { type: String, required: true },
      avatar: { type: String, required: false },
    },
    text: { type: String, required: true }
  },
  {
    timestamps: true,
  }
);

export default model("Comment", commentSchema);
