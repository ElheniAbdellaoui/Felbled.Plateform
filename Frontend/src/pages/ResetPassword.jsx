import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(
        `https://felblad-plateform.onrender.com/api/v1/user/reset-password/${token}`,
        { password }
      );
      toast.success(res.data.message);
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Erreur lors de la réinitialisation"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Réinitialiser le mot de passe</h1>
      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          className="w-full border p-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5 mr-2" />{" "}
              Réinitialisation...
            </>
          ) : (
            "Réinitialiser"
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
