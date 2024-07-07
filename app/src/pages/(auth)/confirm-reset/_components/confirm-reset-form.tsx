/* eslint-disable @typescript-eslint/no-explicit-any */

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { confirmResetData } from "@/lib/zod-schema/auth-schema";
import { useConfirmReset } from "@/api/query/auth";
import { z } from "zod";
import { InputField } from "@/components/input-field";
import { Button } from "@/components/ui/button";

import { Alert } from "@/components/ui/alert";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ConfirmResetForm = () => {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(confirmResetData),
    defaultValues: {
      resetCode: "",
    },
  });

  const { mutate, isPending, isError, error, isSuccess } = useConfirmReset();

  const handleSubmit = (data: z.infer<typeof confirmResetData>) => {
    mutate(data);
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/reset-password");
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
          label="OTP"
          name="resetCode"
          placeholder="999999"
          type="text"
        />

        <Button type="submit" disabled={isPending}>
          Confirm OTP
        </Button>
      </form>
    </Form>
  );
};

export default ConfirmResetForm;
