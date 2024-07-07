import { z } from "zod";

export const registerDate = z
  .object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    passwordConfirm: z.string().min(8),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Password does't match",
    path: ["passwordConfirm"],
  });

export const loginData = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const forgetPasswordData = z.object({
  email: z.string().email(),
});

export const confirmResetData = z.object({
  resetCode: z.string().length(6),
});

export const passwordResetData = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    passwordConfirm: z.string().min(8),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Password does't match",
    path: ["passwordConfirm"],
  });
