"use client";

import { useState } from "react";
import { subtitle } from "@/components/primitives";
import ProfitAnalytics from "@/components/dashboard/profitAnalytics";
import OrderAnalytics from "@/components/dashboard/orderAnalytics";
import Orders from "@/components/dashboard/orders";
import { useSession } from "@/context/sessionContext";

export default function OrdersPage() {
    const { session } = useSession();
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

    // Function to refresh analytics when status changes
    const refreshAnalytics = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    return (
        <section className="flex flex-col items-center justify-center gap-4">
            {/* Show analytics only for admins */}
            {session?.role === "admin" && (
                <>
                    <ProfitAnalytics refreshTrigger={refreshTrigger} />
                    <OrderAnalytics refreshTrigger={refreshTrigger} />
                </>
            )}

            <h1 className={`${subtitle()} font-semibold`}>주문내역</h1>
            <Orders refreshAnalytics={refreshAnalytics} />
        </section>
    );
}
