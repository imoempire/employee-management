import { Select, SelectProps } from "@mantine/core";
import React from "react";

interface SelectFieldProps extends Omit<SelectProps, "label" | "placeholder"> {
  label?: string;
  placeholder?: string;
  caption?: string;
  className?: string;
  data: string[] | { value: string; label: string }[]; // Options for the select
}

export function SelectField({
  label,
  placeholder,
  caption,
  className,
  data,
  ...selectProps
}: SelectFieldProps) {
  return (
    <div className={className}>
      <Select
        label={label}
        placeholder={placeholder}
        data={data}
        {...selectProps}
      />
      {caption && (
        <span
          style={{
            fontSize: "0.875rem",
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
