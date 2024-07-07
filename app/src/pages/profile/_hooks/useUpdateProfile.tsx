import { updateProfileData } from "@/lib/zod-schema/profile-schema";
import { selectCurrentUser } from "@/redux/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useFile from "./useFile";
import { useUpdateProfile } from "@/api/query/profile";
import { useEffect, useState } from "react";

const useUpdate = () => {
  const profile = useAppSelector(selectCurrentUser);
  const { handleFileChange, selectedFile } = useFile();
  const { mutate, isPending, isSuccess } = useUpdateProfile();

  const [isFormDirty, setIsFormDirty] = useState(false);

  const form = useForm({
    resolver: zodResolver(updateProfileData),
    defaultValues: {
      name: profile ? profile.name : "",
      email: profile ? profile.email : "",
      bio: profile ? profile.bio : "",
    },
    shouldUnregister: false,
  });

  form.watch((values, { name }) => {
    const newValue = values[name!];

    if (profile !== null && profile[name!] !== newValue) {
      setIsFormDirty(true);
    } else {
      setIsFormDirty(false);
    }
  });

  // handle file selection
  useEffect(() => {
    if (selectedFile !== null) {
      setIsFormDirty(true);
    } else {
      setIsFormDirty(false);
    }
  }, [selectedFile]);

  // handle request end
  useEffect(() => {
    if (isSuccess) {
      setIsFormDirty(false);
    }
  }, [isSuccess]);

  const handleSubmit = (data: z.infer<typeof updateProfileData>) => {
    const formData = new FormData();

    if (data.name && data.name !== profile?.name) {
      formData.append("name", data.name);
    }

    if (data.email && data.email !== profile?.email) {
      formData.append("email", data.email);
    }

    if (data.bio && data.bio !== profile?.bio) {
      formData.append("bio", data.bio);
    }

    if (selectedFile !== null) {
      formData.append("profileImage", selectedFile);
    }

    mutate(formData);
  };

  return {
    handleFileChange,
    selectedFile,
    form,
    handleSubmit,
    profile,
    isPending,
    isFormDirty,
  };
};

export default useUpdate;
