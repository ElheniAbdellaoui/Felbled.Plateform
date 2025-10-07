import { Blog } from "../models/blog.model.js";
import { User } from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import Course from "../models/course.model.js";

//  admin controller
export const getStats = async (req, res) => {
  try {
    console.log("Stats endpoint hit");
    const users = await User.countDocuments();
    const blogs = await Blog.countDocuments();
    const comments = await Comment.countDocuments();
    const courses = await Course.countDocuments();
    res.json({ users, blogs, comments, courses });
  } catch (error) {
    console.error("Error in getStats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
