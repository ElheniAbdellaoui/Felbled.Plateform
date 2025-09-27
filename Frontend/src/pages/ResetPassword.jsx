import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `https://felblad-plateform.onrender.com/api/v1/user/reset-password/${token}`,
        { newPassword: password }
      );
      toast.success(res.data.message);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Réinitialiser mot de passe</h1>
      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          className="w-full border p-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white p-3 rounded">
          Réinitialiser
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
