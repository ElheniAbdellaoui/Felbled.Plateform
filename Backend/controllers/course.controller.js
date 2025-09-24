import Course from "../models/course.model.js";

export const createCourse = async (req, res) => {
  const course = await Course.create({ ...req.body, prof: req.user._id });
  res.status(201).json(course);
};

export const getCourses = async (req, res) => {
  const courses = await Course.find().populate("prof", "firstName lastName");
  res.json(courses);
};

export const getCourse = async (req, res) => {
  const course = await Course.findById(req.params.id).populate(
    "prof",
    "firstName lastName"
  );
  res.json(course);
};

export const deleteCourse = async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Deleted" });
};
