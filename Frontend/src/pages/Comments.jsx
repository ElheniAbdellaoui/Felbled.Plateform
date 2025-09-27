import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { Eye } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Comments = () => {
  const [allComments, setAllComments] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // pour gérer 403 ou autres erreurs
  const navigate = useNavigate();

  const getTotalComments = async () => {
    try {
      const res = await axios.get(
        "https://felblad-plateform.onrender.com/api/v1/comment/my-blogs/comments",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setAllComments(res.data.comments);
        setErrorMessage("");
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 403) {
        setErrorMessage(
          "Vous n’êtes pas autorisé à voir les commentaires de ces blogs."
        );
      } else {
        setErrorMessage(
          "Une erreur est survenue lors du chargement des commentaires."
        );
      }
    }
  };

  useEffect(() => {
    getTotalComments();
  }, []);

  return (
    <div className="pb-10 pt-20 md:ml-[320px] h-screen">
      <div className="max-w-6xl mx-auto mt-8">
        <Card className="w-full p-5 space-y-2 dark:bg-gray-800">
          {errorMessage ? (
            <p className="text-center text-red-500">{errorMessage}</p>
          ) : allComments.length === 0 ? (
            <p className="text-center text-gray-500">
              Aucun commentaire trouvé.
            </p>
          ) : (
            <Table>
              <TableCaption>A list of your recent comments.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Blog Title</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allComments.map((comment, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {comment?.postId?.title || "Titre inconnu"}
                    </TableCell>
                    <TableCell>{comment?.content || "Aucun contenu"}</TableCell>
                    <TableCell>
                      {comment?.userId?.firstName || "Anonyme"}
                    </TableCell>
                    <TableCell className="text-right flex gap-3 items-center justify-center">
                      {comment?.postId?._id && (
                        <Eye
                          className="cursor-pointer"
                          onClick={() =>
                            navigate(`/blogs/${comment.postId._id}`)
                          }
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Comments;
