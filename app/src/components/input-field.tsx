import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { EyeIcon, EyeOff } from "lucide-react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type InputProps = {
  name: string;
  label: string;
  placeholder: string;
  type: string;
};

const InputField = (props: InputProps) => {
  const { control } = useFormContext();
  return (
    <div>
      <FormField
        name={props.name}
        control={control}
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>{props.label}</FormLabel>
              <FormControl>
                <Input
                  type={props.type}
                  placeholder={props.placeholder}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
};

type PasswordProps = {
  name: string;
  label: string;
  placeholder: string;
};

const PasswordField = (props: PasswordProps) => {
  const { control } = useFormContext();
  const [hide, setHide] = useState(true);
  return (
    <FormField
      name={props.name}
      control={control}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>{props.label}</FormLabel>
            <div className="flex">
              <FormControl>
                <Input
                  className="border-r-0 rounded-r-none"
                  type={hide ? "password" : "text"}
                  placeholder={props.placeholder}
                  {...field}
                />
              </FormControl>

              <Button
                type="button"
                variant="ghost"
                className="border border-l-0 border-input rounded-l-none"
                onClick={() => setHide(!hide)}
              >
                {hide ? <EyeIcon size="16px" /> : <EyeOff size="16px" />}
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
export { InputField, PasswordField };
