"use client";

import { useState } from "react";
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
    const { session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Filter menu items for main navbar (Hide "Settings" for non-admins, Remove "Sign Out")
    const filteredMenuItems = menuItems.filter((item) => {
        if (item.label === "Settings" && session?.role !== "admin") return false;
        if (item.label === "Sign Out") return false;
        return true;
    });

    // Filter menu items for the dropdown menu (Keeps "Sign Out" visible)
    const menuDropdownItems = menuItems.filter((item) => {
        if (item.label === "Settings" && session?.role !== "admin") return false;
        return true;
    });

    return (
        <NextUINavbar isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
            {" "}
            {/* Controls menu */}
            <NavbarContent>
                {/* Correctly toggles menu */}
                <NavbarMenuToggle className="sm:hidden" aria-label="Open menu" />
                <NavbarBrand>
                    <Link color="foreground" href="/">
                        <p className="font-bold text-inherit">KUSA POCHA</p>
                    </Link>
                </NavbarBrand>
            </NavbarContent>
            {/* Desktop Navbar */}
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
            {/* Mobile Dropdown Menu */}
            <NavbarMenu>
                <NavbarMenuItems tabs={menuDropdownItems} onClose={() => setIsMenuOpen(false)} /> {/* Close on link click */}
            </NavbarMenu>
        </NextUINavbar>
    );
}
