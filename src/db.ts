import mongoose, { Types } from "mongoose";
import { Schema } from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const URL = process.env.DB_URL;
mongoose
  .connect(`${URL}Brainbox`)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const contentTypes = ["image", "video", "article", "audio"];
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const ContentSchema = new Schema({
  link: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: contentTypes },
  title: { type: String, required: true },
  tags: [{ type: Types.ObjectId, ref: "Tag" }],
  userId: { type: Types.ObjectId, ref: "User", required: true },
});
const TagSchema = new Schema({
  title: { type: String, required: true, unique: true },
});
const LinkSchema = new Schema({
  hash: { type: String, required: true, unique: true },
  userId: { type: Types.ObjectId, ref: "User" },
});
export const User = mongoose.model("User", UserSchema);
export const Content = mongoose.model("Content", ContentSchema);
export const Tag = mongoose.model("Tag", TagSchema);
export const Link = mongoose.model("Link", LinkSchema);
