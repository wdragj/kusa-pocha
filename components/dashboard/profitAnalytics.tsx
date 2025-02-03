"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/react";
import { subtitle } from "../primitives";

interface ProfitAnalyticsData {
    totalProfit: string;
    profitPerOrg: Record<string, string>;
}

export default function ProfitAnalytics() {
    const [analytics, setAnalytics] = useState<ProfitAnalyticsData>({
        totalProfit: "0.00",
        profitPerOrg: {},
    });

    const fetchProfitAnalytics = async () => {
        try {
            const response = await fetch("/api/analytics/profit");
            const data = await response.json();
            setAnalytics(data);
        } catch (error) {
            console.error("Error fetching profit analytics:", error);
        }
    };

    useEffect(() => {
        fetchProfitAnalytics();
    }, []);

    return (
        <>
            <h1 className={subtitle()}>수익 통계</h1>
            <section className="flex flex-wrap justify-center gap-4 w-full">
                {/* Total Profit */}
                <Card className="flex w-full sm:w-[130px] mx-auto" radius="sm">
                    <CardBody className="flex flex-col items-center">
                        <p className="text-sm font-bold text-default-500">TOTAL</p>
                        <p className="text-xl font-bold pt-2">${analytics.totalProfit}</p>
                    </CardBody>
                </Card>

                {/* Organization Profits */}
                {Object.entries(analytics.profitPerOrg).map(([orgName, profit]) => (
                    <Card key={orgName} className="flex w-full sm:w-[130px] mx-auto" radius="sm">
                        <CardBody className="flex flex-col items-center">
                            <p className="text-sm font-bold text-default-500">{orgName}</p>
                            <p className="text-xl font-bold pt-2">${profit}</p>
                        </CardBody>
                    </Card>
                ))}
            </section>
        </>
    );
}
