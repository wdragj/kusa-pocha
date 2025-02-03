"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, Chip } from "@nextui-org/react";
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
            <h1 className={subtitle()}>주문 통계</h1>
            <section className="flex flex-wrap justify-center gap-4 w-full">
                {[
                    { label: "Total", value: analytics.totalOrders },
                    { label: "Pending", value: analytics.pendingOrders },
                    { label: "In Progress", value: analytics.inProgressOrders },
                    { label: "Completed", value: analytics.completedOrders },
                    { label: "Declined", value: analytics.declinedOrders },
                ].map(({ label, value }) => {
                    const statusColorMap: Record<string, "success" | "warning" | "secondary" | "danger" | "primary"> = {
                        Completed: "success",
                        Pending: "warning",
                        "In Progress": "secondary",
                        Declined: "danger",
                        Total: "primary",
                    };

                    return (
                        <Card key={label} className="flex w-full sm:w-[130px] mx-auto" radius="sm">
                            <CardBody className="flex flex-col items-center">
                                <Chip color={statusColorMap[label]} size="md" variant="flat">
                                    {label}
                                </Chip>
                                <p className="text-xl font-bold pt-2">{value}</p>
                            </CardBody>
                        </Card>
                    );
                })}
            </section>
        </>
    );
}
