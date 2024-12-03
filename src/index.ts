import express from "express";
import { z } from "zod";

const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.json("hi");
});
app.post("/api/v1/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(req.body);

  const signupSchema = z.object({
    username: z
      .string()
      .min(3, { message: "username must be atleast 3 letters long" })
      .max(10, { message: "username must not be more than 10 letters long" }),
    password: z
      .string()
      .min(8, { message: "minLengthError" })
      .max(20, { message: "maxLengthError" })
      .refine((password) => /[A-Z]/.test(password), {
        message: "uppercaseError",
      })
      .refine((password) => /[a-z]/.test(password), {
        message: "lowercaseError",
      })
      .refine((password) => /[0-9]/.test(password), {
        message: "numberError",
      })
      .refine((password) => /[!@#$%^&*]/.test(password), {
        message: "specialCharacterError",
      }),
  });

  if (signupSchema.safeParse(req.body).success) {
    res.status(200).json({ msg: "success" });
  } else {
    res.status(411).json({ msg: "wrong input" });
  }
});
app.listen(3000);
