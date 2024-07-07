import { Button } from "./ui/button";
import googleIcon from "@/assets/google-symbol.png";

const GoogleLoginBtn = () => {
  const handleLoginWithGoogle = () => {
    window.open(
      `https://basic-auth-324k.onrender.com/api/auth/google`,
      "_self"
    );
  };

  return (
    <Button
      variant="outline"
      onClick={handleLoginWithGoogle}
      className="w-full py-4 flex gap-1"
    >
      <img className="w-[30px] h-[30px]" src={googleIcon} alt="google icon" />
      <span>Continue with google</span>
    </Button>
  );
};

export default GoogleLoginBtn;
