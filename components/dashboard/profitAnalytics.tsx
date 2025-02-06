"use client";

import { Card, CardBody } from "@heroui/react";

interface ProfitAnalyticsProps {
    profitData: {
        totalProfit: string;
        profitPerOrg: Record<string, string>;
    };
}

export default function ProfitAnalytics({ profitData }: ProfitAnalyticsProps) {
    return (
        <section className="flex flex-wrap justify-center gap-4 w-full">
            {/* Mobile View */}
            <Card className="w-full lg:hidden" radius="sm">
                <CardBody className="flex flex-col items-center">
                    <div className="w-full">
                        {[
                            { label: "Total", value: profitData.totalProfit },
                            ...Object.entries(profitData.profitPerOrg).map(([orgName, profit]) => ({
                                label: orgName,
                                value: profit,
                            })),
                        ].map(({ label, value }) => (
                            <div key={label} className="flex justify-between text-sm text-default-600 py-1 border-b border-gray-300">
                                <p className="font-medium">{label}:</p>
                                <p className="font-bold">${value}</p>
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>

            {/* Desktop View */}
            <div className="hidden lg:flex flex-wrap justify-center gap-4 w-full">
                <Card className="w-full max-w-xs mx-auto shadow-lg border border-default-200 bg-white" radius="sm">
                    <CardBody className="p-3">
                        {/* Header */}
                        <h2 className="text-base font-bold text-default-800 mb-2">Profit Analytics</h2>

                        {/* Analytics List */}
                        <div className="divide-y divide-gray-200">
                            {/* Total Profit */}
                            <div className="flex justify-between items-center py-1">
                                <span className="text-sm font-medium text-default-600">Total Profit</span>
                                <span className="text-sm font-bold text-default-800">${profitData.totalProfit}</span>
                            </div>

                            {/* Profit per Organization */}
                            {Object.entries(profitData.profitPerOrg).map(([org, profit]) => (
                                <div key={org} className="flex justify-between items-center py-1">
                                    <span className="text-sm font-medium text-default-600">{org}</span>
                                    <span className="text-sm font-bold text-default-800">${profit}</span>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>
            </div>
        </section>
    );
}
