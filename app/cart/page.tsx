"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MyCart from "@/components/myCart/myCart";
import { subtitle } from "@/components/primitives";
import { useSession } from "@/context/sessionContext";

export default function CartPage() {
    const { session } = useSession();
    const router = useRouter();
    const [sessionLoaded, setSessionLoaded] = useState(false);

    useEffect(() => {
        if (session !== undefined) {
            setSessionLoaded(true); // Mark session as loaded when it's defined
            if (!session?.id) {
                router.push("/"); // Redirect if session is loaded and user is not logged in
            }
        }
    }, [session, router]);

    if (!sessionLoaded) return null; // Prevent rendering until session is determined

    return (
        <section className="flex flex-col items-center justify-center gap-4">
            <h1 className={`${subtitle()} font-semibold`}>장바구니</h1>
            <MyCart />
        </section>
    );
}
