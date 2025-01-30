"use client";

import { subtitle } from "@/components/primitives";
import ProfitAnalytics from "@/components/dashboard/profitAnalytics";
import OrderAnalytics from "@/components/dashboard/orderAnalytics";
import Orders from "@/components/dashboard/orders";

import { useSession } from "@/context/sessionContext";

export default function OrdersPage() {
    const { session, isLoading } = useSession();

    return (
        <section className="flex flex-col items-center justify-center gap-4">
            {/* Show analytics only for admins */}
            {session?.role === "admin" && (
                <>
                    <ProfitAnalytics />
                    <OrderAnalytics />
                </>
            )}

            <h1 className={subtitle()}>Orders</h1>
            <Orders />
        </section>
    );
}
