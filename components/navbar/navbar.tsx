"use client";

import { useState } from "react";
import { Navbar as NextUINavbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, Link, NavbarMenu } from "@heroui/react";

import NavbarMenuItems from "./navbarMenuItems";
import ProfileDropdown from "./profileDropdown";
import SignInButton from "./signInButton";
import { ThemeSwitch } from "@/components/theme-switch";
import { useSession } from "@/context/sessionContext";

export default function Navbar() {
    const { session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Base menu items
    let filteredMenuItems = [
        { label: "홈", path: "/" },
        { label: "메뉴", path: "/menu" },
        { label: "주문 내역", path: "/orders" },
        { label: "장바구니", path: "/cart" },
    ];

    // Add "설정" only if the user is an admin
    if (session?.role === "admin") {
        filteredMenuItems.push({ label: "설정", path: "/settings" });
    }

    // Filter dropdown menu items
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
                        <p className="font-bold text-inherit">쿠사 포차</p>
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
                <NavbarMenuItems tabs={menuDropdownItems} onClose={() => setIsMenuOpen(false)} />
            </NavbarMenu>
        </NextUINavbar>
    );
}
