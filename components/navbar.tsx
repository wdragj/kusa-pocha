"use server";

import React from "react";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  Link,
  Button,
  NavbarMenu,
} from "@nextui-org/react";

import NavbarMenuItems from "./navbarMenuItems";
import ProfileDropdown from "./profileDropdown";

import { ThemeSwitch } from "@/components/theme-switch";
import { auth, signIn } from "@/lib/auth";

interface ProfileData {
  name: string;
  email: string;
  image: string;
}

interface MenuItem {
  label: string;
  path: string;
}

const menuItems = [
  { label: "Pocha", path: "/" },
  { label: "Menu", path: "/menu" },
  { label: "Orders", path: "/orders" },
  { label: "Log Out", path: "/" },
];

export default async function Navbar() {
  const session = await auth();
  const user = session?.user;
  const filteredMenuItems = user
    ? menuItems
    : menuItems.filter((item) => item.label !== "Log Out");

  return (
    <NextUINavbar shouldHideOnScroll>
      <NavbarContent>
        <NavbarMenuToggle className="sm:hidden" />
        <NavbarBrand>
          {/* <AcmeLogo /> */}
          <Link color="foreground" href="/">
            <p className="font-bold text-inherit">KUSA POCHA</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map(
          (item) =>
            item.label !== "Log Out" && ( // Check if the label is not "Log Out"
              <NavbarItem key={item.label}>
                <Link color="primary" href={item.path}>
                  {item.label}
                </Link>
              </NavbarItem>
            ),
        )}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitch /> {/* Dark/Light mode */}
        </NavbarItem>
        {/* if user is signed in, show the user's avatar else show the sign in button */}
        <NavbarItem className="flex flex-row gap-2">
          {user ? (
            <ProfileDropdown profileData={user as ProfileData} />
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("kakao");
              }}
            >
              <Button color="primary" href="/" type="submit" variant="flat">
                Log In
              </Button>
            </form>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItems tabs={filteredMenuItems as MenuItem[]} />
      </NavbarMenu>
    </NextUINavbar>
  );
}
