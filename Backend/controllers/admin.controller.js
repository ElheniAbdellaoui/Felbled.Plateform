import User from "../models/user.model.js";
import { Blog } from "../models/blog.model.js";
import Comment from "../models/comment.model.js";

export const getStats = async (req, res) => {
  const users = await User.countDocuments();
  const blogs = await Blog.countDocuments();
  const comments = await Comment.countDocuments();
  res.json({ users, blogs, comments });
};
