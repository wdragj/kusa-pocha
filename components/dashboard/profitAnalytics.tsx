"use client";

import { Card, CardBody } from "@nextui-org/react";

interface ProfitAnalyticsProps {
    profitData: {
        totalProfit: string;
        profitPerOrg: Record<string, string>;
    };
}

export default function ProfitAnalytics({ profitData }: ProfitAnalyticsProps) {
    return (
        <section className="flex flex-wrap justify-center gap-4 w-full">
            <Card className="flex w-full sm:w-[110px] mx-auto" radius="sm">
                <CardBody className="flex flex-col items-center">
                    <p className="text-sm font-bold text-default-500">TOTAL</p>
                    <p className="text-md font-bold pt-2">${profitData.totalProfit}</p>
                </CardBody>
            </Card>
            {Object.entries(profitData.profitPerOrg).map(([orgName, profit]) => (
                <Card key={orgName} className="flex w-full sm:w-[110px] mx-auto" radius="sm">
                    <CardBody className="flex flex-col items-center">
                        <p className="text-sm font-bold text-default-500">{orgName}</p>
                        <p className="text-md font-bold pt-2">${profit}</p>
                    </CardBody>
                </Card>
            ))}
        </section>
    );
}
