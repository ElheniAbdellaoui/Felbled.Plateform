import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; // icône spinner

const VerifyEmail = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(
          `https://felblad-plateform.onrender.com/api/v1/user/verify-email/${token}`
        );
        toast.success(res.data.message);
        navigate("/login");
      } catch (err) {
        toast.error(err.response?.data?.message || "Lien invalide ou expiré");
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <div className="p-6 text-center flex flex-col items-center justify-center min-h-screen">
      {loading ? (
        <>
          <Loader2 className="animate-spin w-8 h-8 text-blue-600 mb-4" />
          <p className="text-gray-600">Vérification de votre email...</p>
        </>
      ) : (
        <p className="text-green-600 font-semibold">Redirection en cours...</p>
      )}
    </div>
  );
};

export default VerifyEmail;
