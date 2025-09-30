import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, MessageSquare, Share2 } from "lucide-react";
import CommentBox from "@/components/CommentBox";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { setBlog } from "@/redux/blogSlice";
import { toast } from "sonner";
import axios from "axios";

const BlogView = () => {
  const params = useParams();
  const blogId = params.blogId;
  const { blog } = useSelector((store) => store.blog);
  const { user } = useSelector((store) => store.auth);
  const selectedBlog = blog.find((b) => b._id === blogId);
  const dispatch = useDispatch();

  const [blogLike, setBlogLike] = useState(selectedBlog?.likes?.length || 0);
  const [liked, setLiked] = useState(
    selectedBlog?.likes?.includes(user?._id) || false
  );

  // Crée une instance Axios avec token pour éviter les 401
  const axiosInstance = axios.create({
    baseURL: "https://felblad-plateform.onrender.com/api/v1",
    headers: { Authorization: `Bearer ${user?.token}` },
    withCredentials: true,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!selectedBlog) {
    return (
      <div className="pt-14 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p className="text-muted-foreground">
            Please wait while we load the blog post.
          </p>
        </div>
      </div>
    );
  }

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axiosInstance.get(
        `/blog/${selectedBlog._id}/${action}`
      );
      if (res.data.success) {
        const updatedLikes = liked ? blogLike - 1 : blogLike + 1;
        setBlogLike(updatedLikes);
        setLiked(!liked);

        const updatedBlogData = blog.map((b) =>
          b._id === selectedBlog._id
            ? {
                ...b,
                likes: liked
                  ? b.likes.filter((id) => id !== user._id)
                  : [...b.likes, user._id],
              }
            : b
        );
        dispatch(setBlog(updatedBlogData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  };

  const changeTimeFormat = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleShare = (blogId) => {
    const blogUrl = `${window.location.origin}/blogs/${blogId}`;
    if (navigator.share) {
      navigator
        .share({
          title: "Check this blog!",
          text: "Amazing read",
          url: blogUrl,
        })
        .catch((err) => console.error(err));
    } else {
      navigator.clipboard.writeText(blogUrl);
      toast.success("Blog link copied to clipboard!");
    }
  };

  return (
    <div className="pt-14">
      <div className="max-w-6xl mx-auto p-10">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/blogs">Blogs</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{selectedBlog.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Blog Header */}
        <div className="my-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            {selectedBlog.title}
          </h1>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={selectedBlog.author.photoUrl} />
                <AvatarFallback>
                  {selectedBlog.author.firstName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {selectedBlog.author.firstName} {selectedBlog.author.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedBlog.author.occupation || "Author"}
                </p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Published on {changeTimeFormat(selectedBlog.createdAt)}
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={selectedBlog.thumbnail || "/placeholder.jpg"}
            alt={selectedBlog.title}
            width={1000}
            height={500}
            className="w-full object-cover"
          />
          <p className="text-sm text-muted-foreground mt-2 italic">
            {selectedBlog.subtitle}
          </p>
        </div>

        <p dangerouslySetInnerHTML={{ __html: selectedBlog.description }} />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Badge variant="secondary">Next.js</Badge>
          <Badge variant="secondary">React</Badge>
          <Badge variant="secondary">Web Development</Badge>
          <Badge variant="secondary">JavaScript</Badge>
        </div>

        {/* Engagement */}
        <div className="flex items-center justify-between border-y dark:border-gray-800 border-gray-300 py-4 mb-8">
          <div className="flex items-center space-x-4">
            <Button
              onClick={likeOrDislikeHandler}
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
            >
              {liked ? (
                <FaHeart size={24} className="cursor-pointer text-red-600" />
              ) : (
                <FaRegHeart
                  size={24}
                  className="cursor-pointer hover:text-gray-600 text-white"
                />
              )}
              <span>{blogLike}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{selectedBlog.comments?.length || 0} Comments</span>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => handleShare(selectedBlog._id)}
              variant="ghost"
              size="sm"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CommentBox selectedBlog={selectedBlog} axiosInstance={axiosInstance} />
      </div>
    </div>
  );
};

export default BlogView;
