/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import {
  AppShell,
  Burger,
  Group,
  Text,
  Menu,
  Image,
  Avatar,
  Container,
  Box,
  Flex,
} from "@mantine/core";
import Link from "next/link";
import {
  IconBell,
  IconSettings,
  IconLogout,
  IconChevronDown,
  IconUserCircle,
  IconCalendar,
  IconFiles,
} from "@tabler/icons-react";
import { getSession, signOut, useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import Loading from "@/components/loading";
import { useCustomGet } from "@/Hooks/useCustomGet";
import { API_ENDPOINT } from "@/service/api/endpoints";
import { SettingProfileResponse } from "./settings/_components/types";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false);
  const pathname = usePathname();

  //API DATA
  const { data: MyProfile } = useCustomGet<SettingProfileResponse>({
    url: `${API_ENDPOINT.EMPLOYEE}/${session?.user?.id}/details`,
  });

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
    // { label: "Document Management", href: "/dashboard/document-management" },
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

  const userMenuItems = [
    {
      label: "My Profile",
      href: "/dashboard/settings/profile",
      icon: <IconUserCircle size={16} />,
    },
    {
      label: "My Documents",
      href: "/dashboard/document-management",
      icon: <IconFiles size={16} />,
    },
    {
      label: "Calendar",
      href: "/dashboard/calendar",
      icon: <IconCalendar size={16} />,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: <IconSettings size={16} />,
    },
  ];

  const SignOut = async () => {
    await signOut();
  };

  // Check if any onboarding link is active
  const isOnboardingActive = onboardingLinks.some((link) =>
    pathname.startsWith(link.href)
  );

  // Logo component for reusability
  const Logo = ({ size = 30 }: { size?: number }) => (
    <Link
      href="/dashboard"
      style={{
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Image src="/ADK_LOGO.png" alt="ADK Logo" h={size} />
    </Link>
  );

  // Navigation link component
  const NavLink = ({
    link,
    isMobile = false,
  }: {
    link: any;
    isMobile?: boolean;
  }) => {
    if (link.isDropdown) {
      return (
        <Menu key={link.href} position="bottom" offset={10}>
          <Menu.Target>
            <Group gap="xs" align="center">
              <Text
                size={isMobile ? "sm" : "md"}
                fw={500}
                style={{
                  cursor: "pointer",
                  color: "#000000",
                  textDecoration: isOnboardingActive ? "underline" : "none",
                  textDecorationColor: isOnboardingActive ? "#1483C6" : "none",
                }}
              >
                {link.label}
              </Text>
              <IconChevronDown
                color="#000000"
                size={14}
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
                      : "transparent",
                }}
              >
                {onboardingLink.label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <Link
        key={link.href}
        href={link.href}
        style={{
          textDecoration: "none",
          color: pathname === link.href ? "#1483C6" : "#000000",
        }}
      >
        <Text
          size={isMobile ? "sm" : "md"}
          fw={500}
          style={{
            cursor: "pointer",
            textDecoration: pathname === link.href ? "underline" : "none",
            textDecorationColor: pathname === link.href ? "#1483C6" : "none",
          }}
        >
          {link.label}
        </Text>
      </Link>
    );
  };

  return (
    <AppShell
      header={{ height: { base: 60, sm: 70 } }}
      padding={{ base: "md", sm: "xs" }}
    >
      <AppShell.Header
        bg="#ffffff"
        style={{ borderBottomColor: "#1483C6", borderBottomWidth: 5 }}
      >
        <Container
          // w={{ base: "100%", sm: "100%" }}
          size={"100%"}
          h="100%"
          px={{ base: "xl", sm: "100" }}
        >
          <Flex justify="space-between" align="center" h="100%">
            {/* Mobile Logo (smaller) */}
            <Box hiddenFrom="sm">
              <Logo size={28} />
            </Box>

            {/* Desktop Navigation with Logo */}
            <Group gap="xl" visibleFrom="lg">
              <Logo size={35} />
              {navLinks.map((link) => (
                <NavLink key={link.href} link={link} />
              ))}
            </Group>

            {/* Tablet Navigation (condensed) with Logo */}
            <Group gap="md" visibleFrom="sm" hiddenFrom="lg">
              <Logo size={32} />
              {navLinks.slice(0, 3).map((link) => (
                <NavLink key={link.href} link={link} />
              ))}
              <Menu>
                <Menu.Target>
                  <Group gap="xs">
                    <Text size="sm" fw={500} style={{ cursor: "pointer" }}>
                      More
                    </Text>
                    <IconChevronDown size={14} style={{ cursor: "pointer" }} />
                  </Group>
                </Menu.Target>
                <Menu.Dropdown>
                  {navLinks.slice(3).map((link) => (
                    <Menu.Item
                      key={link.href}
                      component={Link}
                      href={link.href}
                      style={{
                        backgroundColor:
                          pathname === link.href ? "#e0e0e0" : "transparent",
                      }}
                    >
                      {link.label}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            </Group>

            {/* Desktop Right Section */}
            <Group gap="md" visibleFrom="sm">
              <IconBell
                color="#000000"
                size={22}
                style={{ cursor: "pointer" }}
              />
              <Menu>
                <Menu.Target>
                  <Group gap={4} style={{ cursor: "pointer" }}>
                    <Avatar
                      size="sm"
                      src={MyProfile?.employee.profile_picture}
                      name={session.user.username}
                    />
                    <IconChevronDown color="#000000" size={14} />
                  </Group>
                </Menu.Target>
                <Menu.Dropdown>
                  {userMenuItems.map((item) => (
                    <Menu.Item
                      key={item.href}
                      leftSection={item.icon}
                      component={Link}
                      href={item.href}
                      style={{
                        backgroundColor:
                          pathname === item.href ? "#e0e0e0" : "transparent",
                      }}
                    >
                      {item.label}
                    </Menu.Item>
                  ))}
                  <Menu.Divider />
                  <Menu.Item
                    leftSection={<IconLogout size={16} />}
                    onClick={SignOut}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>

            {/* Mobile Burger Menu */}
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
                  color="#000000"
                />
              </Menu.Target>
              <Menu.Dropdown>
                {/* Navigation Links */}
                {navLinks.map((link) =>
                  link.isDropdown ? (
                    <Menu key={link.href} position="right-start" offset={5}>
                      <Menu.Target>
                        <Menu.Item
                          rightSection={<IconChevronDown size={14} />}
                          style={{
                            backgroundColor: isOnboardingActive
                              ? "#e0e0e0"
                              : "transparent",
                          }}
                        >
                          {link.label}
                        </Menu.Item>
                      </Menu.Target>
                      <Menu.Dropdown>
                        {onboardingLinks.map((onboardingLink) => (
                          <Menu.Item
                            key={onboardingLink.href}
                            component={Link}
                            href={onboardingLink.href}
                            onClick={() => setMobileMenuOpened(false)}
                            style={{
                              backgroundColor:
                                pathname === onboardingLink.href
                                  ? "#e0e0e0"
                                  : "transparent",
                            }}
                          >
                            {onboardingLink.label}
                          </Menu.Item>
                        ))}
                      </Menu.Dropdown>
                    </Menu>
                  ) : (
                    <Menu.Item
                      key={link.href}
                      component={Link}
                      href={link.href}
                      onClick={() => setMobileMenuOpened(false)}
                      style={{
                        backgroundColor:
                          pathname === link.href ? "#e0e0e0" : "transparent",
                      }}
                    >
                      {link.label}
                    </Menu.Item>
                  )
                )}

                <Menu.Divider />

                {/* User Actions */}
                <Menu.Item
                  leftSection={<IconBell size={16} />}
                  onClick={() => setMobileMenuOpened(false)}
                >
                  Notifications
                </Menu.Item>

                {userMenuItems.map((item) => (
                  <Menu.Item
                    key={item.href}
                    leftSection={item.icon}
                    component={Link}
                    href={item.href}
                    onClick={() => setMobileMenuOpened(false)}
                    style={{
                      backgroundColor:
                        pathname === item.href ? "#e0e0e0" : "transparent",
                    }}
                  >
                    {item.label}
                  </Menu.Item>
                ))}

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
          </Flex>
        </Container>
      </AppShell.Header>

      <AppShell.Main
        style={{
          background: "#ffffff",
        }}
      >
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
