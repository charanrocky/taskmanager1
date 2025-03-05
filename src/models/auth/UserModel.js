import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },

    email: {
      type: String,
      required: [true, "Please an Email"],
      unique: true,
      trim: true,
      match: [
        /^([\w-\.0]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please add a vaild email",
      ],
    },

    password: {
      type: String,
      required: [true, "Please add password!"],
    },

    photo: {
      type: String,
      default: "no-photo.jpg",
    },

    bio: {
      type: String,
      default: "Iam a new user",
    },

    role: {
      type: String,
      enum: ["user", "admin", "creator"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, minimize: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcryptjs.genSalt(10);
  const hasedPassword = await bcryptjs.hash(this.password, salt);
  this.password = hasedPassword;
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
