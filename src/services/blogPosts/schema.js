import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogPostModel = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      value: { type: Number, required: false },
      unit: { type: String, required: false },
    },
    authors: [{authorId: {type: Schema.Types.ObjectId, ref: "Author", required:true}}],
    content: { type: String, required: true },
    comments: [],
  },
  {
    timestamps: true,
  }
);

export default model("BlogPost", blogPostModel);
