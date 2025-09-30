import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { LuSend } from "react-icons/lu";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setBlog } from "@/redux/blogSlice";
import { setComment } from "@/redux/commentSlice";
import { Edit, Trash2 } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CommentBox = ({ selectedBlog }) => {
  const { user } = useSelector((store) => store.auth);
  const { comment } = useSelector((store) => store.comment);
  const { blog } = useSelector((store) => store.blog);
  const dispatch = useDispatch();

  const [content, setContent] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  // ✅ Protection si selectedBlog est undefined
  if (!selectedBlog || !selectedBlog._id) return <div>Loading comments...</div>;

  const getAllCommentsOfBlog = async () => {
    try {
      const res = await axios.get(
        `https://felblad-plateform.onrender.com/api/v1/comment/${selectedBlog._id}/comment/all`,
        { withCredentials: true }
      );
      dispatch(setComment(res.data.comments));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    getAllCommentsOfBlog();
  }, [selectedBlog._id]);

  const commentHandler = async () => {
    if (!content.trim()) return toast.error("Comment cannot be empty");

    try {
      const res = await axios.post(
        `https://felblad-plateform.onrender.com/api/v1/comment/${selectedBlog._id}/create`,
        { content },
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedComments = [...comment, res.data.comment];
        dispatch(setComment(updatedComments));

        const updatedBlogData = blog.map((b) =>
          b._id === selectedBlog._id ? { ...b, comments: updatedComments } : b
        );
        dispatch(setBlog(updatedBlogData));
        toast.success(res.data.message);
        setContent("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add comment");
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const res = await axios.delete(
        `https://felblad-plateform.onrender.com/api/v1/comment/${commentId}/delete`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedComments = comment.filter((c) => c._id !== commentId);
        dispatch(setComment(updatedComments));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete comment");
    }
  };

  const editCommentHandler = async (commentId) => {
    if (!editedContent.trim()) return toast.error("Comment cannot be empty");

    try {
      const res = await axios.put(
        `https://felblad-plateform.onrender.com/api/v1/comment/${commentId}/edit`,
        { content: editedContent },
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedComments = comment.map((c) =>
          c._id === commentId ? { ...c, content: editedContent } : c
        );
        dispatch(setComment(updatedComments));
        toast.success(res.data.message);
        setEditingCommentId(null);
        setEditedContent("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to edit comment");
    }
  };

  const likeCommentHandler = async (commentId) => {
    try {
      const res = await axios.get(
        `https://felblad-plateform.onrender.com/api/v1/comment/${commentId}/like`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedCommentList = comment.map((c) =>
          c._id === commentId ? res.data.updatedComment : c
        );
        dispatch(setComment(updatedCommentList));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Error liking comment:", error);
      toast.error("Failed to like comment");
    }
  };

  return (
    <div>
      {/* Comment Input */}
      <div className="flex gap-4 mb-4 items-center">
        <Avatar>
          <AvatarImage src={user.photoUrl} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h3 className="font-semibold">
          {user.firstName} {user.lastName}
        </h3>
      </div>
      <div className="flex gap-3">
        <Textarea
          placeholder="Leave a comment"
          className="bg-gray-100 dark:bg-gray-800"
          onChange={(e) => setContent(e.target.value)}
          value={content}
        />
        <Button onClick={commentHandler}>
          <LuSend />
        </Button>
      </div>

      {/* Comments List */}
      {comment.length > 0 && (
        <div className="mt-7 bg-gray-100 dark:bg-gray-800 p-5 rounded-md">
          {comment.map((item) => (
            <div key={item._id} className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-start">
                  <Avatar>
                    <AvatarImage src={item?.userId?.photoUrl} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="mb-2 space-y-1 md:w-[400px]">
                    <h1 className="font-semibold">
                      {item?.userId?.firstName} {item?.userId?.lastName}{" "}
                      <span className="text-sm ml-2 font-light">yesterday</span>
                    </h1>

                    {editingCommentId === item._id ? (
                      <>
                        <Textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="mb-2 bg-gray-200 dark:bg-gray-700"
                        />
                        <div className="flex py-1 gap-2">
                          <Button
                            size="sm"
                            onClick={() => editCommentHandler(item._id)}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingCommentId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <p>{item.content}</p>
                    )}

                    <div className="flex gap-5 items-center">
                      <div
                        className="flex gap-2 items-center cursor-pointer"
                        onClick={() => likeCommentHandler(item._id)}
                      >
                        {item.likes.includes(user._id) ? (
                          <FaHeart fill="red" />
                        ) : (
                          <FaRegHeart />
                        )}
                        <span>{item.numberOfLikes}</span>
                      </div>
                      <p
                        onClick={() =>
                          setActiveReplyId(
                            activeReplyId === item._id ? null : item._id
                          )
                        }
                        className="text-sm cursor-pointer"
                      >
                        Reply
                      </p>
                    </div>
                  </div>
                </div>

                {user._id === item?.userId?._id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <BsThreeDots />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[180px]">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingCommentId(item._id);
                          setEditedContent(item.content);
                        }}
                      >
                        <Edit /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500"
                        onClick={() => deleteComment(item._id)}
                      >
                        <Trash2 /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Reply Box */}
              {activeReplyId === item._id && (
                <div className="flex gap-3 w-full px-10">
                  <Textarea
                    placeholder="Reply here ..."
                    className="border-2 dark:border-gray-500 bg-gray-200 dark:bg-gray-700"
                    onChange={(e) => setReplyText(e.target.value)}
                    value={replyText}
                  />
                  <Button onClick={commentHandler}>
                    <LuSend />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentBox;
