import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
        toast.error(err.response?.data?.message || "Lien invalide");
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <div className="p-6 text-center">
      {loading ? <p>Vérification en cours...</p> : <p>Redirection...</p>}
    </div>
  );
};

export default VerifyEmail;
