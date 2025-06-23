/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PasswordInput as MantinePasswordInput,
  PasswordInputProps,
} from "@mantine/core";
import { TextInput as MantineTextInput, TextInputProps } from "@mantine/core";

// Define custom styles (GeneralInput) as a constant or function
const GeneralInput = (theme: any) => ({
  input: {
    borderRadius: "8px",
    borderColor: theme.colors.gray[4],
    border: "none",
    height: "50px",
    backgroundColor: "#EEEEEE",
    "&:focus": {
      borderColor: theme.colors.blue[6],
      boxShadow: `0 0 0 2px ${theme.colors.blue[2]}`,
    },
    "&:disabled": {
      backgroundColor: theme.colors.gray[1],
      opacity: 0.7,
    },
  },
  label: {
    fontWeight: 500,
    color: theme.colors.gray[7],
    marginBottom: "4px",
  },
});

interface InputFieldProps extends TextInputProps {
  form?: any; // Optional form context (e.g., from @mantine/form)
  name?: string; // Optional, but required if form is provided
}

export function InputField({ form, name, ...props }: InputFieldProps) {
  // Ensure form and name are both provided or neither is provided
  if (form && !name) {
    throw new Error("InputField: 'name' is required when 'form' is provided.");
  }

  // Use form integration if provided, otherwise render standalone
  const inputProps =
    form && name ? { ...props, ...form.getInputProps(name) } : props;

  // Ensure value is always defined for controlled inputs
  const controlledProps = {
    ...inputProps,
    value: inputProps.value ?? "", // Fallback to empty string if value is undefined
    onChange: inputProps.onChange || (() => {}), // Fallback to no-op if onChange is undefined
  };

  return (
    <MantineTextInput
      {...controlledProps}
      styles={GeneralInput}
      withAsterisk={props.required} // Show asterisk if required
      className="w-full" // Ensure full width by default
    />
  );
}

// Define custom styles (GeneralInput) as a constant or function
const GeneralPasswordInput = (theme: any) => ({
  input: {
    borderRadius: "8px",
    borderColor: theme.colors.gray[4],
    border: "none",
    height: "50px",
    backgroundColor: "#EEEEEE",
    "&:focus": {
      borderColor: theme.colors.blue[6],
      boxShadow: `0 0 0 2px ${theme.colors.blue[2]}`,
    },
    "&:disabled": {
      backgroundColor: theme.colors.gray[1],
      opacity: 0.7,
    },
  },
  label: {
    fontWeight: 500,
    color: theme.colors.gray[7],
    marginBottom: "4px",
  },
  // Additional styling for the password visibility toggle
  innerInput: {
    height: "50px",
  },
  visibilityToggle: {
    color: theme.colors.gray[6],
    "&:hover": {
      color: theme.colors.blue[6],
    },
  },
});

interface PasswordFieldProps extends PasswordInputProps {
  form?: any; // Optional form context (e.g., from @mantine/form)
  name?: string; // Optional, but required if form is provided
}

export function PasswordField({ form, name, ...props }: PasswordFieldProps) {
  // Ensure form and name are both provided or neither is provided
  if (form && !name) {
    throw new Error(
      "PasswordField: 'name' is required when 'form' is provided."
    );
  }

  // Use form integration if provided, otherwise render standalone
  const inputProps =
    form && name ? { ...props, ...form.getInputProps(name) } : props;

  // Ensure value is always defined for controlled inputs
  const controlledProps = {
    ...inputProps,
    value: inputProps.value ?? "", // Fallback to empty string if value is undefined
    onChange: inputProps.onChange || (() => {}), // Fallback to no-op if onChange is undefined
  };

  return (
    <MantinePasswordInput
      {...controlledProps}
      styles={GeneralPasswordInput}
      withAsterisk={props.required} // Show asterisk if required
      className="w-full" // Ensure full width by default
    />
  );
}
