import express from "express";
import { signupSchema } from "./zod";
import { User } from "./db";
import bcrypt from "bcrypt";
const saltRound = 10;
const app = express();
app.use(express.json());
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
  const hashedpass=await bcrypt.hash(password, saltRound);
  try {
    await User.create({ username: username, password: hashedpass });
    res.status(200).send({msg: "you signed up"})
  } catch (error) {
    console.log("error");
  }
});
app.listen(3000);
