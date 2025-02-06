"use client";

import { Card, CardBody, Chip } from "@heroui/react";

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
        <section className="flex flex-wrap justify-center gap-4 w-full">
            {/* Mobile View: Single Summary Card */}
            <Card className="w-full lg:hidden" radius="sm">
                <CardBody className="flex flex-col items-center">
                    <div className="w-full">
                        {[
                            { label: "Total", value: orderData.totalOrders, color: "primary" },
                            { label: "Pending", value: orderData.pendingOrders, color: "warning" },
                            { label: "In Progress", value: orderData.inProgressOrders, color: "secondary" },
                            { label: "Completed", value: orderData.completedOrders, color: "success" },
                            { label: "Declined", value: orderData.declinedOrders, color: "danger" },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="flex justify-between text-sm text-default-600 py-1 border-b border-gray-300">
                                <Chip color={color as any} size="sm" variant="flat">
                                    {label}
                                </Chip>
                                <p className="font-bold">{value}</p>
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>

            {/* Desktop View: Individual Cards */}
            <div className="hidden lg:flex flex-wrap justify-center gap-4 w-full">
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
            </div>
        </section>
    );
}
