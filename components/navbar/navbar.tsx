"use client";

import { Navbar as NextUINavbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, Link, NavbarMenu } from "@nextui-org/react";

import NavbarMenuItems from "./navbarMenuItems";
import ProfileDropdown from "./profileDropdown";
import SignInButton from "./signInButton";

import { ThemeSwitch } from "@/components/theme-switch";

import { useSession } from "@/context/sessionContext";

const menuItems = [
    { label: "Pocha", path: "/" },
    { label: "Menu", path: "/menu" },
    { label: "Orders", path: "/orders" },
    { label: "My Cart", path: "/cart" },
    { label: "Settings", path: "/settings" }, // Will be filtered for non-admins
    { label: "Sign Out", path: "/" }, // Will be removed from the main navbar
];

export default function Navbar() {
    const { session, isLoading } = useSession();

    // Filter menu items for main navbar (Hide "Settings" for non-admins, Remove "Sign Out")
    const filteredMenuItems = menuItems.filter((item) => {
        if (item.label === "Settings" && session?.role !== "admin") return false; // Hide settings if not admin
        if (item.label === "Sign Out") return false; // Hide sign-out from the main navbar
        return true;
    });

    // Filter menu items for the dropdown menu (Keeps "Sign Out" visible)
    const menuDropdownItems = menuItems.filter((item) => {
        if (item.label === "Settings" && session?.role !== "admin") return false; // Hide settings if not admin
        return true;
    });

    return (
        <NextUINavbar>
            <NavbarContent>
                <NavbarMenuToggle className="sm:hidden" />
                <NavbarBrand>
                    <Link color="foreground" href="/">
                        <p className="font-bold text-inherit">KUSA POCHA</p>
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            {/* Main navbar (Desktop) - Without "Sign Out" */}
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                {filteredMenuItems.map((item) => (
                    <NavbarItem key={item.label}>
                        <Link color="primary" href={item.path}>
                            {item.label}
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem>
                    <ThemeSwitch />
                </NavbarItem>
                <NavbarItem className="flex flex-row gap-2">{session ? <ProfileDropdown /> : <SignInButton />}</NavbarItem>
            </NavbarContent>

            {/* Mobile Dropdown Menu - Keeps "Sign Out" */}
            <NavbarMenu>
                <NavbarMenuItems tabs={menuDropdownItems} />
            </NavbarMenu>
        </NextUINavbar>
    );
}
