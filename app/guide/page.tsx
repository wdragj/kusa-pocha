"use client";

import { title } from "@/components/primitives";
import KusaGuide from "@/components/guide/kusaGuide";
import Guide from "@/components/guide/guide";

import { useSession } from "@/context/sessionContext";

export default function GuidePage() {
    const { session, isLoading } = useSession();

    return (
        <section className="flex flex-col items-center justify-center gap-6">
            <div className="px-8 w-screen sm:w-[32rem]">
                <Guide />
            </div>

            {/* Render KusaGuide only if user is admin */}
            {session?.role === "admin" && (
                <div className="px-8 w-screen sm:w-[32rem]">
                    <KusaGuide />
                </div>
            )}
        </section>
    );
}
