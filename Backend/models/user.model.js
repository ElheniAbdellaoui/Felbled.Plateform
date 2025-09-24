import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["user", "professeur", "admin"],
      default: "user",
    },
    photoUrl: { type: String },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

    isVerified: { type: Boolean, default: false },
    verifyToken: String,
    verifyTokenExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.getJWT = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min
  return resetToken;
};

export default mongoose.model("User", userSchema);
