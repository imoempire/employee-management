/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { Suspense, useState } from "react";
import { useForm } from "@mantine/form";
import { InputField, PasswordField } from "@/components/Inputs";
import { Button, Group, Text, Title } from "@mantine/core";
import { IconMail, IconCheck } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { api } from "@/service/api/http";
import { API_ENDPOINT } from "@/service/api/endpoints";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Loading from "@/components/loading";

export default function Page() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      Username: "",
      email: "",
      password: "",
      confirm_password: "",
    },
    validate: {
      Username: (value) => (value.length > 0 ? null : "Username is required"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => {
        if (value.length < 8) {
          return "Password should be more than 8 characters";
        }
        if (!/[a-z]/.test(value)) {
          return "Password should contain at least one lowercase letter";
        }
        if (!/[A-Z]/.test(value)) {
          return "Password should contain at least one uppercase letter";
        }
        if (!/\d/.test(value)) {
          return "Password should contain at least one number";
        }
        if (!/[!@#$%^&*]/.test(value)) {
          return "Password should contain at least one special character (!@#$%^&*)";
        }
        return null;
      },
      confirm_password: (value, { password }) => {
        if (value !== password) {
          return "Passwords do not match";
        }
        return null;
      },
    },
  });

  const verificationForm = useForm({
    initialValues: {
      verification_code: "",
    },
    validate: {
      verification_code: (value) =>
        value.length === 0 ? "Code is required" : null,
    },
  });

  const handleRegisterLogin = async (values: typeof form.values) => {
    setIsLoading(true);
    try {
      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (response?.error) {
        setError("Invalid email or password");
        return;
      }

      if (response?.ok) {
        showNotification({
          title: "Success",
          message: "Login successfully!",
          color: "green",
          icon: <IconCheck />,
          position: "bottom-right",
        });
        router.replace("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (values: typeof form.values) => {
    setIsLoading(true);
    setError(null);

    try {
      const response: any = await api.post(API_ENDPOINT.SIGNUP, {
        email: values.email.trim(),
        username: values.Username.trim(),
        password: values.password.trim(),
        password_confirmation: values.password.trim(),
      });

      if (
        response?.message ===
        "Employee registered. Please check your email for confirmation code."
      ) {
        showNotification({
          title: "Success",
          message:
            response?.message ||
            "Successfully registered! Please verify your account.",
          color: "green",
          icon: <IconCheck />,
          position: "bottom-right",
        });
        setIsVerifying(true);
      }
    } catch (error: any) {
      setError(
        error?.response?.data?.message || "An unexpected error occurred"
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (values: typeof verificationForm.values) => {
    setIsLoading(true);
    setError(null);

    try {
      const response: any = await api.post(API_ENDPOINT.VERIFY_EMAIL, {
        email: form.values.email,
        verification_code: values.verification_code,
      });

      if (response?.message === "Account verified successfully") {
        showNotification({
          title: "Success",
          message: response?.message || "Account verified successfully!",
          color: "green",
          icon: <IconCheck />,
          position: "bottom-right",
        });
        handleRegisterLogin(form.values);
      }
    } catch (error: any) {
      setError(error?.response?.data?.message || "Failed to verify account");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGmailSignup = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Gmail signup error:", error);
      setError("Failed to sign up with Gmail");
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Section: Background Image */}
        <div
          className="hidden lg:block lg:w-1/2 bg-cover bg-center"
          style={{
            backgroundImage: "url('/signup.jpg')",
            backgroundColor: "#f0f0f0",
          }}
        />

        {/* Right Section: Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-white">
          {!isVerifying ? (
            <div className="w-full max-w-md space-y-6">
              {/* Title */}
              <Title
                order={2}
                mb={"xl"}
                className="text-center text-2xl sm:text-3xl font-bold text-gray-800"
              >
                Create A Free Account
              </Title>

              {!!error && (
                <Text c="red" ta="center">
                  {error}
                </Text>
              )}

              {/* Form */}
              <form
                onSubmit={form.onSubmit(handleSignUp)}
                className="space-y-6"
              >
                {/* Username */}
                <InputField
                  form={form}
                  name="Username"
                  placeholder="Username"
                />

                {/* Email Input */}
                <InputField form={form} name="email" placeholder="Email" />

                {/* Password Input */}
                <PasswordField
                  placeholder="Password"
                  type="password"
                  name="password"
                  value={form.values.password}
                  onChange={(event) =>
                    form.setFieldValue("password", event.currentTarget.value)
                  }
                  error={form.errors.password}
                />

                {/* Confirm Password Input */}
                <PasswordField
                  placeholder="Confirm Password"
                  type="confirm_password"
                  name="confirm_password"
                  value={form.values.confirm_password}
                  onChange={(event) =>
                    form.setFieldValue(
                      "confirm_password",
                      event.currentTarget.value
                    )
                  }
                  error={form.errors.confirm_password}
                />

                {/* Sign In Button */}
                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  color="blue"
                  className="mt-8"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Signup
                </Button>
              </form>

              {/* Links */}
              <Group
                align="center"
                justify="center"
                className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
              >
                <Text size="sm" c={"#4a5565"}>
                  You already have an account?{" "}
                  <a href={"/"} className="text-blue-600 hover:underline">
                    Login
                  </a>
                </Text>
                <Text size="sm" c={"#4a5565"}>
                  Forgot your password?{" "}
                  <a
                    href="/forgot-password"
                    className="text-blue-600 hover:underline"
                  >
                    Click here
                  </a>
                </Text>
              </Group>

              {/* Gmail Button */}
              <Button
                fullWidth
                size="lg"
                color="blue"
                leftSection={<IconMail size={20} />}
                className="mt-4"
                variant="outline"
                disabled={isLoading}
                onClick={handleGmailSignup}
              >
                Sign up with Gmail
              </Button>
            </div>
          ) : (
            <div className="w-full max-w-md space-y-6">
              {/* Title */}
              <Title order={2} mb={"xl"} c={"#1e2939"} fw={"700"} size={"xl"}>
                Verify your Account
              </Title>

              {!!error && (
                <Text c="red" ta="center">
                  {error}
                </Text>
              )}

              <Text size="sm" ta="center" c={"#4a5565"}>
                A verification code has been sent to{" "}
                <strong>{form.values.email}</strong>
              </Text>

              {/* Form */}
              <form
                onSubmit={verificationForm.onSubmit(handleVerifyCode)}
                className="space-y-6"
              >
                {/* Verification Code Input */}
                <InputField
                  form={verificationForm}
                  name="verification_code"
                  placeholder="Verification Code"
                />

                {/* Verify Button */}
                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  color="blue"
                  className="mt-8"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Verify Account
                </Button>

                <Button
                  fullWidth
                  size="lg"
                  variant="subtle"
                  color="gray"
                  onClick={() => setIsVerifying(false)}
                  disabled={isLoading}
                >
                  Back to Signup
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>{" "}
    </Suspense>
  );
}
