"use client";

import { useEffect, useState } from "react";
import { Navbar as NextUINavbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, Link, NavbarMenu } from "@nextui-org/react";

import NavbarMenuItems from "./navbarMenuItems";
import ProfileDropdown from "./profileDropdown";
import SignInButton from "./signInButton";

import { ThemeSwitch } from "@/components/theme-switch";
import { createClient } from "@/utils/supabase/client";

import { useSession } from "@/context/sessionContext";

interface MenuItem {
    label: string;
    path: string;
}

const menuItems = [
    { label: "Pocha", path: "/" },
    { label: "Menu", path: "/menu" },
    { label: "Orders", path: "/orders" },
    { label: "My Cart", path: "/cart" },
    { label: "Settings", path: "/settings" },
    { label: "Sign Out", path: "/" },
];

export default function Navbar() {
    const supabase = createClient();

    const { session, isLoading } = useSession();

    const filteredMenuItems = session
        ? menuItems.filter(
              (item) => session.role === "admin" || item.label !== "Settings" // Only admins can see "Settings"
          )
        : menuItems.filter((item) => item.label !== "Sign Out" && item.label !== "Settings");

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
                        )
                )}
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem>
                    <ThemeSwitch /> {/* Dark/Light mode */}
                </NavbarItem>
                {/* if user is signed in, show the user's avatar else show the sign in button */}
                <NavbarItem className="flex flex-row gap-2">{session ? <ProfileDropdown /> : <SignInButton />}</NavbarItem>
            </NavbarContent>

            <NavbarMenu>
                <NavbarMenuItems tabs={filteredMenuItems as MenuItem[]} />
            </NavbarMenu>
        </NextUINavbar>
    );
}
