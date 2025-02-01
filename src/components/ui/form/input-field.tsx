"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { Input } from "../input";

type InputFieldProps = {
  nameInSchema: string;
  fieldTitle?: string;
  description?: string;
  placeholder?: string;
  type?: string;
  inputClassName?: string;
  formItemClassName?: string;
};

export function InputField({
  nameInSchema,
  fieldTitle,
  description,
  placeholder,
  type = "text",
  inputClassName,
  formItemClassName,
}: InputFieldProps) {
  const form = useFormContext();
  const fieldTitleNoSpaces = fieldTitle?.replaceAll(" ", "-") || nameInSchema;

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem className={formItemClassName}>
          <FormLabel htmlFor={fieldTitleNoSpaces}>{fieldTitle}</FormLabel>

          <FormControl>
            <Input
              {...field}
              id={fieldTitleNoSpaces}
              type={type}
              placeholder={placeholder}
              onFocus={(e) => e.target.select()}
              className={inputClassName}
            />
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
