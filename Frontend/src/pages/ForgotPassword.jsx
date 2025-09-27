import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://felblad-plateform.onrender.com/api/v1/user/forgot-password",
        { email }
      );
      toast.success(res.data.message || "Lien envoyé à votre email");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mot de passe oublié</h1>
      <form onSubmit={handleForgot} className="space-y-4">
        <input
          type="email"
          placeholder="Votre email"
          className="w-full border p-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="w-full bg-blue-600 text-white p-3 rounded">
          Envoyer lien de réinitialisation
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
