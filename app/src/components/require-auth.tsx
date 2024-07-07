import { useAppSelector } from "@/redux/hooks";
import { selectCurrentToken } from "@/redux/auth/authSlice";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth = () => {
  const location = useLocation();
  const token = useAppSelector(selectCurrentToken);

  return token !== null ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
