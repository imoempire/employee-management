"use client";
import { useEffect, useState } from "react";
import { AppShell, Burger, Group, Text, Menu } from "@mantine/core";
import Link from "next/link";
import {
  IconBell,
  IconSettings,
  IconLogout,
  IconUserCircle,
  IconChevronDown,
} from "@tabler/icons-react";
import { getSession, signOut, useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation"; // Import usePathname
import Loading from "@/components/loading";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false);
  const pathname = usePathname(); // Get current URL path

  useEffect(() => {
    getSession();
  }, []);

  if (status === "loading") {
    return <Loading />;
  }

  if (!session) {
    redirect("/");
  }

  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Onboarding", href: "/dashboard/onboarding", isDropdown: true },
    { label: "Document Management", href: "/dashboard/document-management" },
    { label: "Training", href: "/dashboard/training" },
    { label: "Support", href: "/dashboard/support" },
  ];

  const onboardingLinks = [
    { label: "General Onboarding", href: "/dashboard/onboarding" },
    {
      label: "Consumer Drones Onboarding",
      href: "/dashboard/onboarding/consumer-drones",
    },
    {
      label: "Enterprise Drones Onboarding",
      href: "/dashboard/onboarding/enterprise-drones",
    },
    {
      label: "Agricultural Drones Onboarding",
      href: "/dashboard/onboarding/agricultural-drones",
    },
    { label: "Softwares Onboarding", href: "/dashboard/onboarding/softwares" },
    {
      label: "After-Sales Support Onboarding",
      href: "/dashboard/onboarding/after-sales-support",
    },
    { label: "Warranty Onboarding", href: "/dashboard/onboarding/warranty" },
    { label: "Repairs Onboarding", href: "/dashboard/onboarding/repairs" },
    {
      label: "Procurement Onboarding",
      href: "/dashboard/onboarding/procurement",
    },
    {
      label: "Fulfilment Onboarding",
      href: "/dashboard/onboarding/fulfilment",
    },
  ];

  const SignOut = async () => {
    await signOut();
  };

  // Check if any onboarding link is active
  const isOnboardingActive = onboardingLinks.some((link) =>
    pathname.startsWith(link.href)
  );

  return (
    <AppShell header={{ height: 60 }} padding="xl">
      <AppShell.Header bg={"#0039C8"}>
        <Group h="100%" px="md" justify="space-between">
          <Text hiddenFrom="sm" />
          {/* Desktop Navigation */}
          <Group gap="xl" visibleFrom="sm" ml={"100"}>
            {navLinks.map((link) =>
              link.isDropdown ? (
                <Menu key={link.href} position="bottom" offset={10}>
                  <Menu.Target>
                    <Group gap="xs" align="center">
                      <Text
                        size="md"
                        fw={500}
                        style={{
                          cursor: "pointer",
                          color: "#ffffff",
                          textDecoration: isOnboardingActive
                            ? "underline"
                            : "none", // Highlight if any onboarding link is active
                        }}
                      >
                        {link.label}
                      </Text>
                      <IconChevronDown
                        color="#ffffff"
                        size={16}
                        style={{ cursor: "pointer" }}
                      />
                    </Group>
                  </Menu.Target>
                  <Menu.Dropdown>
                    {onboardingLinks.map((onboardingLink) => (
                      <Menu.Item
                        key={onboardingLink.href}
                        component={Link}
                        href={onboardingLink.href}
                        style={{
                          backgroundColor:
                            pathname === onboardingLink.href
                              ? "#e0e0e0"
                              : "transparent", // Highlight active sub-link
                        }}
                      >
                        {onboardingLink.label}
                      </Menu.Item>
                    ))}
                  </Menu.Dropdown>
                </Menu>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    textDecoration: "none",
                    color: "#ffffff",
                  }}
                >
                  <Text
                    size="md"
                    fw={500}
                    style={{
                      cursor: "pointer",
                      textDecoration:
                        pathname === link.href ? "underline" : "none", // Highlight active link
                    }}
                  >
                    {link.label}
                  </Text>
                </Link>
              )
            )}
          </Group>

          {/* Desktop Icons */}
          <Group gap="lg" visibleFrom="sm">
            <IconBell color="#ffffff" size={25} style={{ cursor: "pointer" }} />
            <Menu>
              <Menu.Target>
                <IconSettings
                  color="#ffffff"
                  size={25}
                  style={{ cursor: "pointer" }}
                />
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconSettings size={25} />}
                  component={Link}
                  href="/dashboard/settings"
                  style={{
                    backgroundColor:
                      pathname === "/dashboard/settings"
                        ? "#e0e0e0"
                        : "transparent",
                  }}
                >
                  Settings
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconUserCircle size={25} />}
                  component={Link}
                  href="/dashboard/settings/profile"
                  style={{
                    backgroundColor:
                      pathname === "/dashboard/settings/profile"
                        ? "#e0e0e0"
                        : "transparent",
                  }}
                >
                  Profile
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <div onClick={SignOut}>
              <IconLogout color="#ffffff" size={25} />
            </div>
          </Group>

          {/* Mobile Burger with Menu */}
          <Menu
            opened={mobileMenuOpened}
            onChange={setMobileMenuOpened}
            position="bottom-end"
            offset={10}
            withinPortal
          >
            <Menu.Target>
              <Burger
                opened={mobileMenuOpened}
                onClick={() => setMobileMenuOpened((o) => !o)}
                size="sm"
                hiddenFrom="sm"
                color="#ffffff"
              />
            </Menu.Target>
            <Menu.Dropdown>
              {navLinks.map((link) =>
                link.isDropdown ? (
                  <Menu.Sub key={link.href}>
                    <Menu.Sub.Target>
                      <Menu.Sub.Item
                        style={{
                          backgroundColor: isOnboardingActive
                            ? "#e0e0e0"
                            : "transparent", // Highlight if any onboarding link is active
                        }}
                      >
                        {link.label}
                      </Menu.Sub.Item>
                    </Menu.Sub.Target>

                    <Menu.Sub.Dropdown>
                      {onboardingLinks.map((onboardingLink) => (
                        <Menu.Item
                          key={onboardingLink.href}
                          component={Link}
                          href={onboardingLink.href}
                          style={{
                            backgroundColor:
                              pathname === onboardingLink.href
                                ? "#e0e0e0"
                                : "transparent", // Highlight active sub-link
                          }}
                        >
                          {onboardingLink.label}
                        </Menu.Item>
                      ))}
                    </Menu.Sub.Dropdown>
                  </Menu.Sub>
                ) : (
                  <Menu.Item
                    key={link.href}
                    component={Link}
                    href={link.href}
                    onClick={() => setMobileMenuOpened(false)}
                    style={{
                      backgroundColor:
                        pathname === link.href ? "#e0e0e0" : "transparent", // Highlight active link
                    }}
                  >
                    {link.label}
                  </Menu.Item>
                )
              )}
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconBell size={16} />}
                component="button"
                onClick={() => setMobileMenuOpened(false)}
              >
                Notifications
              </Menu.Item>
              <Menu.Item
                leftSection={<IconSettings size={16} />}
                component={Link}
                href="/dashboard/settings"
                onClick={() => setMobileMenuOpened(false)}
                style={{
                  backgroundColor:
                    pathname === "/dashboard/settings"
                      ? "#e0e0e0"
                      : "transparent",
                }}
              >
                Settings
              </Menu.Item>
              <Menu.Item
                leftSection={<IconLogout size={16} />}
                onClick={() => {
                  SignOut();
                  setMobileMenuOpened(false);
                }}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Main
        style={{
          background: "#ffff",
        }}
      >
        {children}
      </AppShell.Main>
    </AppShell>
  );
}