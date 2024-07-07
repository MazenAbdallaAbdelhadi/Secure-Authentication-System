import logo from "@/assets/logo.svg";
import { selectCurrentToken } from "@/redux/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { Link } from "react-router-dom";
import ProfileBtn from "./profile-btn";
import { buttonVariants } from "./ui/button";

const Nav = () => {
  const token = useAppSelector(selectCurrentToken);

  return (
    <nav className="py-2 shadow">
      <div className="flex justify-between items-center gap-4 container ">
        {/* logo */}
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>

        {/* auth */}
        {token ? (
          <ProfileBtn />
        ) : (
          <div className="flex gap-2">
            <Link className={buttonVariants()} to="/login">
              Log in
            </Link>
            <Link
              className={buttonVariants({ variant: "outline" })}
              to="/register"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
