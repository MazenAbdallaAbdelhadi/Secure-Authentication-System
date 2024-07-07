/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { registerDate } from "@/lib/zod-schema/auth-schema";
import { useRegister } from "@/api/query/auth";
import { z } from "zod";
import { InputField, PasswordField } from "@/components/input-field";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Alert } from "@/components/ui/alert";
import { AxiosError } from "axios";

const RegisterForm = () => {
  const form = useForm({
    resolver: zodResolver(registerDate),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const { mutate, isPending, isError, error, isSuccess } = useRegister();

  const handleSubmit = (data: z.infer<typeof registerDate>) => {
    mutate(data);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isSuccess) {
      navigate(from, { replace: true });
    }
  }, [isSuccess, navigate, from]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-3">
        {isError && (
          <Alert variant="destructive">
            {((error as AxiosError).response?.data as any)?.message}
          </Alert>
        )}
        <InputField
          label="Name"
          name="name"
          placeholder="Joe Doe"
          type="text"
        />
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
          Sign Up
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
