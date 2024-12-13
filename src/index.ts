import express from "express";
import { signupSchema } from "./zod";
import { Content, User } from "./db";
import { validatorMiddleware } from "./middlewares/validator";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
dotenv.config();
const SECRET = process.env.JWT_SECRET;
const saltRound = 10;
const app = express();
app.use(express.json());
enum ContentTypes {
  image = "image",
  video = "video",
  article = "article",
  audio = "audio",
}
interface ContentType {
  link: String;
  type: ContentTypes;
  title: String;
  tags: [];
  userId: Types.ObjectId;
}
app.get("/", (req, res) => {
  res.json("hi");
});
app.post("/api/v1/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(req.body);

  if (!signupSchema.safeParse(req.body).success) {
    res.status(411).json({ msg: "wrong input" });
  }
  const founduser = await User.findOne({ username: username });
  if (founduser) {
    res.status(403).json({ msg: "user already exist" });
  }
  const hashedpass = await bcrypt.hash(password, saltRound);
  try {
    await User.create({ username: username, password: hashedpass });
    res.status(200).send({ msg: "you signed up" });
  } catch (error) {
    console.log("error");
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(req.body);
  if (!signupSchema.safeParse(req.body).success) {
    res.status(411).json({ msg: "wrong input" });
  }
  const founduser = await User.findOne({ username: username });
  console.log(founduser);

  if (!founduser) {
    res.status(403).json({ msg: "user doesn't exist" });
  }
  try {
    if (
      founduser != null &&
      (await bcrypt.compare(password, founduser?.password))
    ) {
      const token = jwt.sign(username, `${SECRET}`);
      console.log(token);
      res.status(200).json({ msg: "signed in" });
    }
  } catch (error) {}
});
app.post("/api/v1/content", validatorMiddleware, async (req, res) => {
  try {
    const { link, type, title, tags, userId }: ContentType = req.body;
    await Content.create({
      link: link,
      type: type,
      title: title,
      tags: tags,
      userId: userId,
    });
    res.status(200).send({ msg: "content added" });
  } catch (error) {
    console.log(error);
  }
});
app.listen(3000);
