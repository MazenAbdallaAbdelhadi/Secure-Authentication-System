import { z } from "zod";

export const updateProfileData = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  bio: z.string().optional(),
});

export const updatePasswordData = z
  .object({
    oldPassword: z.string().min(8),
    newPassword: z.string().min(8),
    passwordConfirm: z.string(),
  })
  .refine((val) => val.newPassword === val.passwordConfirm, {
    message: "Password Confirm does't match",
    path: ["passwordConfirm"],
  });
