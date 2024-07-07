import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { useLogout } from "@/api/query/auth";

const ProfileBtn = () => {
  const user = useAppSelector(selectCurrentUser);
  const { mutate } = useLogout();
  const navigate = useNavigate();

  if (user === null) return;

  const handleClick = async () => {
    await mutate();
    navigate("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.profileImage} />
          <AvatarFallback>{user?.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile">Profile</Link>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleClick()}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileBtn;
