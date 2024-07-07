import { useMutation, useQuery } from "@tanstack/react-query";
import usePrivateAxios from "../usePrivateAxios";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectCurrentToken,
  selectCurrentUser,
  setCredential,
} from "@/redux/auth/authSlice";
import { toast } from "sonner";
import { z } from "zod";
import { updatePasswordData } from "@/lib/zod-schema/profile-schema";

export const useGetProfile = () => {
  const api = usePrivateAxios();

  const getProfile = async () => {
    return await api.get("/v1/users/getMe");
  };

  return useQuery({
    queryFn: getProfile,
    queryKey: ["profile"],
  });
};

export const useUpdateProfile = () => {
  const api = usePrivateAxios();
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectCurrentToken);

  const updateProfile = async (data: FormData) => {
    return await api.put("/v1/users/updateMe", data);
  };

  return useMutation({
    mutationFn: updateProfile,
    mutationKey: ["profile"],
    onSuccess: (data) => {
      dispatch(setCredential({ user: data.data?.data, token }));
      toast.success("profile updated successfully");
    },
  });
};

export const useUpdatePassword = () => {
  const api = usePrivateAxios();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  const updatePassword = async (data: z.infer<typeof updatePasswordData>) => {
    return await api.put("/v1/users/changeMyPassword", data);
  };

  return useMutation({
    mutationFn: updatePassword,
    onSuccess: (data) => {
      dispatch(setCredential({ token: data.data?.data?.token, user }));
      toast.success("Password updated successfully");
    },
  });
};
