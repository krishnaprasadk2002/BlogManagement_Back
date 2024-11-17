import mongoose, { Schema } from "mongoose";

import { IBlog } from "../interfaces/IBlog";

const blogSchema: Schema = new Schema<IBlog>({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  tags: [
    {
      type: String,
      required: true
    }
  ],
  authorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Users'
  }
}, {
  timestamps: true
});

const Blogs = mongoose.model<IBlog>('Blogs', blogSchema);

export default Blogs;