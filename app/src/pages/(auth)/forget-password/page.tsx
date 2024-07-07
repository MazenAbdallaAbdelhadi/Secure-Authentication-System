import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ForgetPasswordForm from "./_components/forget-password-form";

const ForgetPasswordPage = () => {
  return (
    <div className="h-screen w-full grid place-content-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Forgot Your password? 🔑</CardTitle>
          <CardDescription>
            We've got you covered. Enter your registered email to reset your
            password. We will send an OTP code to your email for the next steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgetPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgetPasswordPage;
