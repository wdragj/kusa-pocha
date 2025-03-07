"use client";

import { useState } from "react";
import { Navbar as NextUINavbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, Link, NavbarMenu, Image } from "@heroui/react";
import NavbarMenuItems from "./navbarMenuItems";
import ProfileDropdown from "./profileDropdown";
import SignInButton from "./signInButton";
import { ThemeSwitch } from "@/components/theme-switch";
import { useSession } from "@/context/sessionContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const { session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    // Base menu items
    let filteredMenuItems = [
        { label: "메뉴", path: "/" },
        { label: "장바구니", path: "/cart" },
        { label: "주문 내역", path: "/orders" },
        { label: "가이드", path: "/guide" },
    ];

    // Add "설정" only if the user is an admin
    if (session?.role === "admin") {
        filteredMenuItems.push({ label: "설정", path: "/settings" });
    }

    // For mobile dropdown items, add logout if needed.
    let menuDropdownItems = [...filteredMenuItems];
    if (session) {
        menuDropdownItems.push({ label: "로그아웃", path: "/" });
    }

    return (
        <NextUINavbar isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} className="z-[9999]">
            {/* Controls menu */}
            <NavbarContent>
                <NavbarMenuToggle className="sm:hidden" aria-label="Open menu" />
                <NavbarBrand>
                    <Link color="foreground" href="/">
                        <Image
                            src="https://uquxhjgvhmfqorzidceh.supabase.co/storage/v1/object/sign/images/logos/logo4.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvbG9nb3MvbG9nbzQucG5nIiwiaWF0IjoxNzQwNDE4Nzk4LCJleHAiOjE3NzE5NTQ3OTh9.-NBUr4Jp6GLXT0n5AhKPgl90iDeVi9f_eSGzIM2qDs4"
                            alt="Logo"
                            className="w-full h-8 rounded-none"
                        />
                    </Link>
                </NavbarBrand>
            </NavbarContent>
            {/* Desktop Navbar */}
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                {filteredMenuItems.map((item) => (
                    <NavbarItem key={item.label}>
                        <Link color={pathname === item.path ? "primary" : "foreground"} href={item.path}>
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
                <NavbarMenuItems tabs={menuDropdownItems} onClose={() => setIsMenuOpen(false)} />
            </NavbarMenu>
        </NextUINavbar>
    );
}
