"use client";

import { Card, CardBody, Chip } from "@nextui-org/react";

interface OrderAnalyticsProps {
    orderData: {
        totalOrders: number;
        pendingOrders: number;
        inProgressOrders: number;
        completedOrders: number;
        declinedOrders: number;
    };
}

export default function OrderAnalytics({ orderData }: OrderAnalyticsProps) {
    const statusColorMap: Record<string, "success" | "warning" | "secondary" | "danger" | "primary"> = {
        Completed: "success",
        Pending: "warning",
        "In Progress": "secondary",
        Declined: "danger",
        Total: "primary",
    };

    return (
        <section className="flex flex-wrap justify-center gap-4">
            {[
                { label: "Total", value: orderData.totalOrders },
                { label: "Pending", value: orderData.pendingOrders },
                { label: "In Progress", value: orderData.inProgressOrders },
                { label: "Completed", value: orderData.completedOrders },
                { label: "Declined", value: orderData.declinedOrders },
            ].map(({ label, value }) => (
                <Card key={label} className="flex w-full sm:w-[110px] mx-auto" radius="sm">
                    <CardBody className="flex flex-col items-center">
                        <Chip color={statusColorMap[label]} size="sm" variant="flat">
                            {label}
                        </Chip>
                        <p className="text-md font-bold pt-2">{value}</p>
                    </CardBody>
                </Card>
            ))}
        </section>
    );
}
