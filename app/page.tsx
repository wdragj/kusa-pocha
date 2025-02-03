"use client";

import { title } from "@/components/primitives";
import KusaGuide from "@/components/guide/kusaGuide";
import Guide from "@/components/guide/guide";

import { useSession } from "@/context/sessionContext";

export default function Home() {
    const { session, isLoading } = useSession();

    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <div className="inline-block text-center justify-center">
                <h1 className={title({ color: "violet" })}>쿠사 포차에 오신걸 환영합니다!&nbsp;</h1>
            </div>

            <div className="px-8 py-6 w-screen sm:w-[32rem]">
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
