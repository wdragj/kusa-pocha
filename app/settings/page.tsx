"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/sessionContext";

import ItemTypes from "@/components/settings/itemTypes/itemTypes";
import Organizations from "@/components/settings/organizations/organizations";
import Tables from "@/components/settings/tables/tables";

export default function SettingsPage() {
    const { session, isLoading } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!session || session.role !== "admin")) {
            router.push("/"); // Redirect non-admin users
        }
    }, [session, isLoading, router]);

    if (isLoading) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    if (!session || session.role !== "admin") {
        return null; // Prevents rendering before redirect
    }

    return (
        <section className="flex flex-col items-center justify-center gap-4">
            <Organizations />
            <ItemTypes />
            <Tables />
        </section>
    );
}
