import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ConformResetForm from "./_components/confirm-reset-form";

const ConfirmResetPage = () => {
  return (
    <div className="h-screen w-full grid place-content-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Enter The OTP 🔐</CardTitle>
          <CardDescription>
            Please Check your email inbox for a message from our App. Enter the
            one-time verification code below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConformResetForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmResetPage;
