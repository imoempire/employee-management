"use client";
import { Button, Text, Title } from "@mantine/core";
import { IconCheck, IconMail } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { showNotification } from "@mantine/notifications";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { InputField, PasswordField } from "@/components/Inputs";
import Loading from "@/components/loading";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => {
        if (value.length === 0) {
          return "Password is required";
        }
        return null;
      },
    },
  });

  // STATE
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (values: typeof form.values) => {
    setIsLoading(true);
    try {
      const response = await signIn("credentials", {
        email: values.email.trim(),
        password: values.password.trim(),
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isCurrent = true;
    if (isCurrent && !session) {
      router.replace("/");
    } else {
      setTimeout(() => {
        router.replace("/dashboard");
      }, 2000);
    }
    return () => {
      isCurrent = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    if (error) {
      setTimeout(() => setError(""), 5000);
    }
  }, [error]);

  if (status === "loading") {
    return (
      <>
        <Loading />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section: Background Image */}
      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: "url('/signin.jpg')",
          backgroundColor: "#f0f0f0",
        }}
      >
        {/* Using a local image in the public folder */}
      </div>

      {/* Right Section: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-white">
        <div className="w-full max-w-md space-y-6">
          {/* Title */}
          <Title
            order={2}
            mb={"xl"}
            className="text-center text-2xl sm:text-3xl font-bold text-gray-800 "
          >
            Login to your account
          </Title>

          {!!error && (
            <Text c="red" ta="center" mb={"md"}>
              {error}
            </Text>
          )}

          {/* Form */}
          <form onSubmit={form.onSubmit(handleSignIn)} className="space-y-6">
            {/* Email Input */}
            <InputField
              placeholder="Email"
              size="md"
              name="email"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email && "Invalid email"}
            />

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

            {/* Sign In Button */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              color="blue"
              className="mt-8"
              loading={isLoading}
            >
              Sign in
            </Button>
          </form>

          {/* Links */}
          <div className="flex flex-col gap-1.5 space-y-2 lg:space-y-0 lg:space-x-4 justify-center  items-center">
            <Text size="sm" c={"#4a5565"}>
              Don’t have an account yet?{" "}
              <a href="/signup" className="text-blue-600 hover:underline">
                Signup
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
          </div>

          {/* Gmail Button */}
          <Button
            fullWidth
            size="lg"
            color="blue"
            leftSection={<IconMail size={20} />}
            className="mt-4"
            variant="outline"
          >
            Gmail
          </Button>
        </div>
      </div>
    </div>
  );
}
