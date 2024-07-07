import { InputField } from "@/components/input-field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import useUpdateProfile from "../_hooks/useUpdateProfile";

import profilePlaceholder from "@/assets/person.png";

const UpdateProfileForm = () => {
  const {
    form,
    handleFileChange,
    selectedFile,
    handleSubmit,
    profile,
    isPending,
    isFormDirty,
  } = useUpdateProfile();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col md:flex-row justify-between gap-5  my-10"
      >
        <div className="flex flex-col justify-center items-center gap-4">
          <img
            src={
              (selectedFile && URL.createObjectURL(selectedFile)) ||
              profile?.profileImage ||
              profilePlaceholder
            }
            alt={profile?.name}
            className="h-[300px] w-[300px] rounded-lg"
          />
          <span className="text-muted-foreground text-sm md:self-start">
            image preview
          </span>

          <Label htmlFor="profileImage" className="self-start">
            Choose new Profile Image
          </Label>
          <Input
            type="file"
            name="profileImage"
            id="profileImage"
            onChange={handleFileChange}
            accept="image/png, image/jpeg"
          />
        </div>

        <Separator orientation="vertical" className="h-auto" />

        <div className="flex flex-col justify-between gap-2 flex-1">
          <InputField
            type="text"
            label="Name"
            name="name"
            placeholder="your name..."
          />
          <InputField
            type="email"
            label="Email"
            name="email"
            placeholder="your email..."
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea placeholder="Type your Bio..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-max self-end"
            disabled={!isFormDirty || isPending}
          >
            Update Profile
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateProfileForm;
