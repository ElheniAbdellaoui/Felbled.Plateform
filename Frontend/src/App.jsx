import React, { Children } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import YourBlog from "./pages/YourBlog";
import Comments from "./pages/Comments";
import CreateBlog from "./pages/CreateBlog";
import UpdateBlog from "./pages/UpdateBlog";
import BlogView from "./pages/BlogView";
import Footer from "./components/Footer";
import SearchList from "./pages/SearchList";

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
  {
    path: "/dashboard",
    element: (
      <>
        <Navbar />
        <Dashboard />
      </>
    ),
    children: [
      {
        path: "write-blog",
        element: (
          <>
            <CreateBlog />
          </>
        ),
      },

      {
        path: "your-blog",
        element: (
          <>
            <YourBlog />
          </>
        ),
      },
      {
        path: "comments",
        element: (
          <>
            <Comments />
          </>
        ),
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "write-blog/:blogId",
        element: <UpdateBlog />,
      },
    ],
  },
]);
const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
