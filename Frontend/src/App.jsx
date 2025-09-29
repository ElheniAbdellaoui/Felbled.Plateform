import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import YourBlog from "./pages/YourBlog";
import Comments from "./pages/Comments";
import CreateBlog from "./pages/CreateBlog";
import UpdateBlog from "./pages/UpdateBlog";
import BlogView from "./pages/BlogView";
import SearchList from "./pages/SearchList";
import AdminDashboard from "./pages/AdminDashboard";
import Courses from "./pages/Courses";
import CourseView from "./pages/CourseView";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Home />
        <Footer />
      </>
    ),
  },
  {
    path: "/blogs",
    element: (
      <>
        <Navbar />
        <Blog />
        <Footer />
      </>
    ),
  },
  {
    path: "/about",
    element: (
      <>
        <Navbar />
        <About />
        <Footer />
      </>
    ),
  },
  {
    path: "/search",
    element: (
      <>
        <Navbar />
        <SearchList />
        <Footer />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Navbar />
        <Login />
      </>
    ),
  },
  {
    path: "/signup",
    element: (
      <>
        <Navbar />
        <Signup />
      </>
    ),
  },
  {
    path: "/blogs/:blogId",
    element: (
      <>
        <Navbar />
        <BlogView />
      </>
    ),
  },

  // Reset + Verify
  {
    path: "/reset-password/:token",
    element: (
      <>
        <Navbar />
        <ResetPassword />
      </>
    ),
  },
  {
    path: "/verify-email/:token",
    element: (
      <>
        <Navbar />
        <VerifyEmail />
      </>
    ),
  },

  {
    path: "/dashboard",
    element: (
      <>
        <Navbar />
        <Dashboard />
      </>
    ),
    children: [
      { path: "write-blog", element: <CreateBlog /> },
      { path: "your-blog", element: <YourBlog /> },
      { path: "comments", element: <Comments /> },
      { path: "profile", element: <Profile /> },
      { path: "write-blog/:blogId", element: <UpdateBlog /> },

      // Cours → seulement professeur ou admin
      {
        path: "courses",
        element: (
          <ProtectedRoute roles={["professeur", "admin"]}>
            <Courses />
          </ProtectedRoute>
        ),
      },
      {
        path: "courses/:courseId",
        element: (
          <ProtectedRoute roles={["professeur", "admin"]}>
            <CourseView />
          </ProtectedRoute>
        ),
      },

      // Admin → seulement admin
      {
        path: "admin",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
