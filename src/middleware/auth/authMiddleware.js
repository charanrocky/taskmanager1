import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../../models/auth/UserModel.js";
import Token from "../../models/auth/Token.js";

export const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ message: "Not authorized, please login" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(400).json({ message: "User not found!" });
    }

    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ message: "Not authorized, token failed!" });
  }
});

export const adminMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
    return;
  }

  res.status(403).json({ message: "Only admins can do this!" });
});

export const creatorMiddleware = asyncHandler(async (req, res, next) => {
  if (
    req.user &&
    req.user.role === "creator" &&
    req.user &&
    req.user.role === "admin"
  ) {
    next();
    return;
  }

  res.status(403).json({ message: "Only Creators can do this!" });
});

export const verifiedMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isVerified) {
    next();
    return;
  }

  res.status(403).json({ message: "Please verify your email address!" });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  let token = await Token.findOne({ userId: user._id });

  if (token) {
    await token.deleteOne();
  }

  const passwordResetToken = crypto.randomBytes(64).toString("hex") + user._id;
  await new Token({}).save();
});
