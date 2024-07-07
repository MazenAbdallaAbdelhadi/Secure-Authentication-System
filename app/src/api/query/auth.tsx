import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

import {
  confirmResetData,
  forgetPasswordData,
  loginData,
  passwordResetData,
  registerDate,
} from "@/lib/zod-schema/auth-schema";
import { useAppDispatch } from "@/redux/hooks";
import { logout, setCredential } from "@/redux/auth/authSlice";
import { axiosInstace } from "../axios";

export const useRegister = () => {
  const dispatch = useAppDispatch();

  async function register(data: z.infer<typeof registerDate>) {
    return await axiosInstace.post("v1/auth/register", data, {
      withCredentials: true,
    });
  }

  return useMutation({
    mutationFn: register,
    onSuccess: ({ data }) => {
      dispatch(
        setCredential({ token: data?.data?.token, user: data?.data?.user })
      );
    },
  });
};

export const useLogin = () => {
  const dispatch = useAppDispatch();

  async function register(data: z.infer<typeof loginData>) {
    return await axiosInstace.post("v1/auth/login", data, {
      withCredentials: true,
    });
  }

  return useMutation({
    mutationFn: register,
    onSuccess: ({ data }) => {
      dispatch(
        setCredential({ token: data?.data?.token, user: data?.data?.user })
      );
    },
  });
};

export const useRefresh = () => {
  const dispatch = useAppDispatch();

  const refresh = async () => {
    try {
      const res = await axiosInstace.get("v1/auth/refresh", {
        withCredentials: true,
      });

      dispatch(
        setCredential({
          token: res?.data?.data?.token,
          user: res?.data?.data?.user,
        })
      );
    } catch (e) {
      console.log(e);
    }
  };

  return refresh;
};

export const useForgetPassword = () => {
  async function forgetPassword(data: z.infer<typeof forgetPasswordData>) {
    return await axiosInstace.post("v1/auth/forget-password", data);
  }

  return useMutation({
    mutationFn: forgetPassword,
  });
};

export const useConfirmReset = () => {
  async function confirmReset(data: z.infer<typeof confirmResetData>) {
    return await axiosInstace.post("v1/auth/confirm-reset", data);
  }

  return useMutation({
    mutationFn: confirmReset,
  });
};

export const useResetPassword = () => {
  const dispatch = useAppDispatch();

  async function resetPassword(data: z.infer<typeof passwordResetData>) {
    return await axiosInstace.post("v1/auth/reset-password", data, {
      withCredentials: true,
    });
  }

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: ({ data }) => {
      dispatch(setCredential({ token: data?.data?.token }));
    },
  });
};

export const useLogout = () => {
  const dispatch = useAppDispatch();

  async function logoutFn() {
    return await axiosInstace.delete("v1/auth/logout", {
      withCredentials: true,
    });
  }

  return useMutation({
    mutationFn: logoutFn,
    onSuccess: () => {
      dispatch(logout());
    },
  });
};
