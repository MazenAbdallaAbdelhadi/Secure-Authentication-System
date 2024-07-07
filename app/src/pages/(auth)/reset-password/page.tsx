import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ResetPasswordForm from "./_components/reset-password-form";

const ResetPasswordPage = () => {
  return (
    <div className="h-screen w-full grid place-content-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Secure Your Account 🔒</CardTitle>
          <CardDescription>
            Almost there! Create new password for your Account to keep it
            secure. Remember to choose a strong and uniqe password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
