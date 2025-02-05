"use client";

import { Card, CardBody, Chip } from "@nextui-org/react";

interface ProfitAnalyticsProps {
    profitData: {
        totalProfit: string;
        profitPerOrg: Record<string, string>;
    };
}

export default function ProfitAnalytics({ profitData }: ProfitAnalyticsProps) {
    return (
        <section className="flex flex-wrap justify-center gap-4 w-full">
            {/* Mobile View: Single Summary Card */}
            <Card className="w-full sm:hidden" radius="sm">
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

            {/* Desktop View: Individual Cards */}
            <div className="hidden sm:flex flex-wrap justify-center gap-4 w-full">
                {[["TOTAL", profitData.totalProfit], ...Object.entries(profitData.profitPerOrg)].map(([label, value]) => (
                    <Card key={label} className="flex w-full sm:w-[110px] mx-auto" radius="sm">
                        <CardBody className="flex flex-col items-center">
                            <p className="text-sm font-bold text-default-500">{label}</p>
                            <p className="text-md font-bold pt-2">${value}</p>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </section>
    );
}
