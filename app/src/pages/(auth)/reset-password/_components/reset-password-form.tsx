/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { passwordResetData } from "@/lib/zod-schema/auth-schema";
import { useResetPassword } from "@/api/query/auth";
import { z } from "zod";
import { InputField, PasswordField } from "@/components/input-field";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Alert } from "@/components/ui/alert";
import { AxiosError } from "axios";

const ResetPasswordForm = () => {
  const form = useForm({
    resolver: zodResolver(passwordResetData),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const { mutate, isPending, isError, error, isSuccess } = useResetPassword();

  const handleSubmit = (data: z.infer<typeof passwordResetData>) => {
    mutate(data);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate("/", { replace: true });
    }
  }, [isSuccess, navigate]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-10">
        {isError && (
          <Alert variant="destructive">
            {((error as AxiosError).response?.data as any)?.message}
          </Alert>
        )}
        <InputField
          label="Email"
          name="email"
          placeholder="user@example.com"
          type="email"
        />
        <PasswordField
          label="Password"
          name="password"
          placeholder="Strong Password"
        />
        <PasswordField
          label="Password"
          name="passwordConfirm"
          placeholder="Strong Password"
        />

        <Button type="submit" disabled={isPending}>
          Save new Password
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
