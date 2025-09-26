import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, default: "", trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["user", "professeur", "admin"],
      default: "user",
    },
    photoUrl: { type: String, default: "" },

    // 🔑 Reset Password
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // 📩 Vérification Email
    isVerified: { type: Boolean, default: false },
    verifyToken: String,
    verifyTokenExpire: Date,
  },
  { timestamps: true }
);

// 🔐 Hash mot de passe avant save()
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔑 Générer JWT
userSchema.methods.getJWT = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.SECRET_KEY,
    { expiresIn: "7d" } // 7 jours
  );
};

// 🔍 Comparer mot de passe
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// 🔄 Générer un token reset password
userSchema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min

  return resetToken;
};

const User = mongoose.model("User", userSchema);
export default User;
