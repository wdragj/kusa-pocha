"use client";

import { useEffect, useState } from "react";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  Link,
  NavbarMenu,
} from "@nextui-org/react";

import NavbarMenuItems from "./navbarMenuItems";
import ProfileDropdown from "./profileDropdown";
import SignInButton from "./navbar/signInButton";

import { ThemeSwitch } from "@/components/theme-switch";
import { createClient } from "@/utils/supabase/client";

interface SessionData {
  accessToken: string;
  id: string;
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
  { label: "Sign Out", path: "/" },
];

export default function Navbar() {
  const supabase = createClient();
  const [session, setSession] = useState<SessionData | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        // console.log(data);

        setSession({
          accessToken: data.session.access_token,
          id: data.session.user.id,
          name: data.session.user.user_metadata.full_name,
          email: data.session.user.user_metadata.email,
          image: data.session.user.user_metadata.avatar_url,
        });
      }
    };

    fetchSession();
  }, []);

  const filteredMenuItems = session
    ? menuItems
    : menuItems.filter((item) => item.label !== "Sign Out");

  return (
    <NextUINavbar>
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
            item.label !== "Sign Out" && ( // Check if the label is not "Sign Out"
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
          {session ? (
            <ProfileDropdown sessionData={session as SessionData} />
          ) : (
            <SignInButton />
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItems tabs={filteredMenuItems as MenuItem[]} />
      </NavbarMenu>
    </NextUINavbar>
  );
}
