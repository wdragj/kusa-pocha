"use client";

import { Avatar, Popover, PopoverTrigger, PopoverContent, Link } from "@nextui-org/react";
import { signOut } from "@/auth/signOut";
import { useSession } from "@/context/sessionContext";
import { useState } from "react";

export default function ProfileDropdown() {
    const { session, setSession } = useSession();
    const [isOpen, setIsOpen] = useState(false); // Controls popover state

    if (!session) return null; // Don't render if no session

    // Handles link clicks
    const handleClose = () => setIsOpen(false);

    return (
        <Popover isOpen={isOpen} onOpenChange={setIsOpen} backdrop="blur" offset={10} placement="bottom-end">
            <PopoverTrigger>
                <Avatar isBordered as="button" className="self-center" color="danger" size="sm" src={session.image} />
            </PopoverTrigger>
            <PopoverContent className="px-4 py-3 min-w-fit min-w-0 max-w-max">
                <div className="flex flex-col gap-1">
                    <div className="text-small font-bold">{session.name}님</div>
                    <div className="text-xs text-gray-500">{session.email}</div>

                    <Link className="text-sm py-1 inline-flex" color="foreground" href="/cart" size="lg" onPress={handleClose}>
                        장바구니
                    </Link>
                    <Link className="text-sm py-1 inline-flex" color="foreground" href="/orders" size="lg" onPress={handleClose}>
                        주문내역
                    </Link>

                    {/* Show "Settings" only for admins */}
                    {session.role === "admin" && (
                        <Link className="text-sm py-1 inline-flex" color="foreground" href="/settings" size="lg" onPress={handleClose}>
                            설정
                        </Link>
                    )}

                    <Link
                        as="button"
                        className="text-sm text-danger pt-2 pb-1 inline-flex"
                        size="lg"
                        onPress={async () => {
                            await signOut();
                            setSession(null); // Clear session globally on sign-out
                            handleClose(); // Close dropdown
                            window.location.reload(); // Force UI update
                        }}
                    >
                        로그아웃
                    </Link>
                </div>
            </PopoverContent>
        </Popover>
    );
}
