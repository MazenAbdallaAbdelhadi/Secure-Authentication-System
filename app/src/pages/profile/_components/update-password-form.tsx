import { useUpdatePassword } from "@/api/query/profile";
import { PasswordField } from "@/components/input-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { updatePasswordData } from "@/lib/zod-schema/profile-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const UpdatePasswordForm = () => {
  const form = useForm({
    resolver: zodResolver(updatePasswordData),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      passwordConfirm: "",
    },
  });

  const { mutate, isPending } = useUpdatePassword();

  const handleSubmit = (data: z.infer<typeof updatePasswordData>) => {
    console.log(data);
    mutate(data)
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
        <PasswordField
          label="Old Password"
          name="oldPassword"
          placeholder="old password..."
        />
        <PasswordField
          label="New Password"
          name="newPassword"
          placeholder="Strong Password"
        />
        <PasswordField
          label="Password Confirm"
          name="passwordConfirm"
          placeholder="Strong Password"
        />

        <Button className="w-max self-end" type="submit" disabled={isPending}>Update Password</Button>
      </form>
    </Form>
  );
};

export default UpdatePasswordForm;
