/* eslint-disable @typescript-eslint/no-explicit-any */

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { loginData } from "@/lib/zod-schema/auth-schema";
import { useLogin } from "@/api/query/auth";
import { z } from "zod";
import { InputField, PasswordField } from "@/components/input-field";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Alert } from "@/components/ui/alert";
import { AxiosError } from "axios";

const LoginForm = () => {
  const form = useForm({
    resolver: zodResolver(loginData),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending, isError, error, isSuccess } = useLogin();

  const handleSubmit = (data: z.infer<typeof loginData>) => {
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
          label="Email"
          name="email"
          placeholder="user@example.com"
          type="text"
        />
        <PasswordField
          label="Password"
          name="password"
          placeholder="Strong Password"
        />

        <div>
          <Link to="/forget-password" className="underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" disabled={isPending}>
          Sign In
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
