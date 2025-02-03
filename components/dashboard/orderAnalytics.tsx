"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/react";
import { subtitle } from "../primitives";

interface OrderAnalytics {
    totalOrders: number;
    pendingOrders: number;
    inProgressOrders: number;
    completedOrders: number;
    declinedOrders: number;
}

export default function ProfitAnalytics() {
    const [analytics, setAnalytics] = useState<OrderAnalytics>({
        totalOrders: 0,
        pendingOrders: 0,
        inProgressOrders: 0,
        completedOrders: 0,
        declinedOrders: 0,
    });

    const fetchOrderAnalytics = async () => {
        try {
            const response = await fetch("/api/analytics/order");
            const data = await response.json();
            setAnalytics(data);
        } catch (error) {
            console.error("Error fetching order analytics:", error);
        }
    };

    useEffect(() => {
        fetchOrderAnalytics();
    }, []);

    return (
        <>
            <h1 className={subtitle()}>Order Analytics</h1>
            <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 justify-center w-full max-w-4xl">
                {[
                    { label: "TOTAL", value: analytics.totalOrders },
                    { label: "PENDING", value: analytics.pendingOrders },
                    { label: "IN PROGRESS", value: analytics.inProgressOrders },
                    { label: "COMPLETED", value: analytics.completedOrders },
                    { label: "DECLINED", value: analytics.declinedOrders },
                ].map(({ label, value }) => (
                    <Card key={label} className="flex w-full sm:w-[130px] mx-auto" radius="sm">
                        <CardBody className="flex flex-col items-center">
                            <p className="text-sm font-bold text-default-500">{label}</p>
                            <p className="text-xl font-bold pt-2">{value}</p>
                        </CardBody>
                    </Card>
                ))}
            </section>
        </>
    );
}
