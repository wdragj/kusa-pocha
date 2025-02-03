"use client";

import { Avatar, Popover, PopoverTrigger, PopoverContent, Link } from "@nextui-org/react";
import { signOut } from "@/auth/signOut";
import { useSession } from "@/context/sessionContext";
import { useState } from "react";

export default function ProfileDropdown() {
    const { session, setSession } = useSession();
    const [isOpen, setIsOpen] = useState(false); // ✅ Controls popover state

    if (!session) return null; // Don't render if no session

    // ✅ Handles link clicks
    const handleClose = () => setIsOpen(false);

    return (
        <Popover isOpen={isOpen} onOpenChange={setIsOpen} backdrop="blur" offset={10} placement="bottom-end">
            <PopoverTrigger>
                <Avatar isBordered as="button" className="self-center" color="danger" size="sm" src={session.image} />
            </PopoverTrigger>
            <PopoverContent>
                <div className="px-1 py-2">
                    <div className="text-small font-bold pt-1 px-1">{session.name}님</div>
                    <div className="text-small pb-2 px-1">{session.email}</div>
                    <Link className="w-full text-small py-2 px-1" color="foreground" href="/cart" size="lg" onClick={handleClose}>
                        My Cart
                    </Link>
                    <Link className="w-full text-small py-2 px-1" color="foreground" href="/orders" size="lg" onClick={handleClose}>
                        My Orders
                    </Link>
                    <Link
                        as="button"
                        className="w-full text-small pt-2 pb-1 px-1"
                        color="danger"
                        size="lg"
                        onPress={async () => {
                            await signOut();
                            setSession(null); // ✅ Clear session globally on sign-out
                            handleClose(); // ✅ Close dropdown
                            window.location.reload(); // ✅ Force UI update
                        }}
                    >
                        Sign Out
                    </Link>
                </div>
            </PopoverContent>
        </Popover>
    );
}
