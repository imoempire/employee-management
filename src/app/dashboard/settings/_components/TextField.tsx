import { TextInput, TextInputProps } from "@mantine/core";
import React from "react";

interface TextFieldProps extends Omit<TextInputProps, "label" | "placeholder"> {
  label?: string;
  placeholder?: string;
  caption?: string;
  className?: string;
}

export function TextField({
  label,
  placeholder,
  caption,
  className,
  ...inputProps
}: TextFieldProps) {
  return (
    <div className={className}>
      <TextInput label={label} placeholder={placeholder} {...inputProps} />
      {caption && (
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: "500",
            color: "#666",
            display: "block",
            marginTop: "0.25rem",
          }}
        >
          {caption}
        </span>
      )}
    </div>
  );
}
