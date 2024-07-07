import { RouterProvider, createBrowserRouter } from "react-router-dom";

import RequireAuth from "./components/require-auth";
import Layout from "./components/layout";
import { useRefresh } from "./api/query/auth";

import LoginPage from "./pages/(auth)/login/page";
import ErrorPage from "./pages/error-page";
import RegisterPage from "./pages/(auth)/register/page";
import ForgetPasswordPage from "./pages/(auth)/forget-password/page";
import ConfirmResetPage from "./pages/(auth)/confirm-reset/page";
import ResetPasswordPage from "./pages/(auth)/reset-password/page";

import ProfilePage from "./pages/profile/page";

import { useAppSelector } from "./redux/hooks";
import { selectCurrentToken } from "./redux/auth/authSlice";

function App() {
  const token = useAppSelector(selectCurrentToken);
  const refresh = useRefresh();

  const router = createBrowserRouter([
    {
      element: <Layout />,
      loader: async () => {
        if (!token) {
          await refresh();
        }
        return null;
      },
      children: [
        {
          path: "/",
          element: "this is home page",
          errorElement: <ErrorPage />,
        },
        {
          path: "/about",
          element: "this is about page",
          errorElement: <ErrorPage />,
        },
        {
          path: "/courses",
          element: "this is courses page",
          errorElement: <ErrorPage />,
        },
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/register",
          element: <RegisterPage />,
        },
        {
          path: "/forget-password",
          element: <ForgetPasswordPage />,
        },
        {
          path: "/confirm-reset",
          element: <ConfirmResetPage />,
        },
        {
          path: "/reset-password",
          element: <ResetPasswordPage />,
        },
        {
          element: <RequireAuth />,
          children: [
            {
              path: "/profile",
              element: <ProfilePage />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
