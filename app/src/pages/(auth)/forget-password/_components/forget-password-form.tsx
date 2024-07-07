/* eslint-disable @typescript-eslint/no-explicit-any */

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { forgetPasswordData } from "@/lib/zod-schema/auth-schema";
import { useForgetPassword } from "@/api/query/auth";
import { z } from "zod";
import { InputField } from "@/components/input-field";
import { Button } from "@/components/ui/button";

import { Alert } from "@/components/ui/alert";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ForgetPasswordForm = () => {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(forgetPasswordData),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending, isError, error, isSuccess } = useForgetPassword();

  const handleSubmit = (data: z.infer<typeof forgetPasswordData>) => {
    mutate(data);
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/confirm-reset");
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
          label="Your Registered Email"
          name="email"
          placeholder="user@example.com"
          type="text"
        />

        <Button type="submit" disabled={isPending}>
          Send OTP
        </Button>
      </form>
    </Form>
  );
};

export default ForgetPasswordForm;
