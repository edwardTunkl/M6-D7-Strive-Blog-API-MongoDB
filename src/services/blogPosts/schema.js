import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogPostSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      value: { type: Number, required: false },
      unit: { type: String, required: false },
    },
    author: {
      name: { type: String, required: true },
      avatar: { type: String, required: false },
    },
    content: { type: String, required: true },
    comments: [],
  },
  {
    timestamps: true,
  }
);

export default model("BlogPost", blogPostSchema);