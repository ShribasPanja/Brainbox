import { z } from "zod";
export const signupSchema = z.object({
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
module.exports = { signupSchema };
