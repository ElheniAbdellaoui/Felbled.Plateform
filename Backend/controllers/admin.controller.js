import { Blog } from "../models/blog.model";
import User from "../models/user.model";

//  admin controller
export const getStats = async (req, res) => {
  try {
    console.log("Stats endpoint hit");
    const users = await User.countDocuments();
    const blogs = await Blog.countDocuments();
    const comments = await Comment.countDocuments();
    res.json({ users, blogs, comments });
  } catch (error) {
    console.error("Error in getStats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
