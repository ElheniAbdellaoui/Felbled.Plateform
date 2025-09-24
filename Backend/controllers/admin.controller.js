import { User } from "../models/user.model.js";
import { Blog } from "../models/blog.model.js";
import Comment from "../models/comment.model.js";

export const getAdminStats = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalBlogs = await Blog.countDocuments();
  const totalComments = await Comment.countDocuments();
  res.json({ success: true, totalUsers, totalBlogs, totalComments });
};
