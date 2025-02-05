"use client";

import { useEffect, useState } from "react";
import { subtitle } from "@/components/primitives";
import ProfitAnalytics from "@/components/dashboard/profitAnalytics";
import OrderAnalytics from "@/components/dashboard/orderAnalytics";
import Orders from "@/components/dashboard/orders";
import { useSession } from "@/context/sessionContext";

interface OrderItem {
    itemId: number;
    itemName: string;
    quantity: number;
    price: number;
    type: string;
    organization: string;
}

interface Orders {
    id: string;
    order_number: number;
    user_login_name: string;
    user_id: string;
    user_email: string;
    user_image: string;
    table_number: number;
    venmo_id: string;
    order: OrderItem[];
    total_price: number;
    status: string;
    created_at: string;
}

interface ProfitAnalyticsData {
    totalProfit: string;
    profitPerOrg: Record<string, string>;
}

interface OrderAnalyticsData {
    totalOrders: number;
    pendingOrders: number;
    inProgressOrders: number;
    completedOrders: number;
    declinedOrders: number;
}

export default function OrdersPage() {
    const { session } = useSession();
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [orders, setOrders] = useState<Orders[]>([]);
    const [isOrdersLoading, setIsOrdersLoading] = useState(true);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [profitData, setProfitData] = useState<ProfitAnalyticsData | null>(null);
    const [orderData, setOrderData] = useState<OrderAnalyticsData | null>(null);
    const [isProfitAnalyticsLoading, setIsProfitAnalyticsLoading] = useState(true);
    const [isOrderAnalyticsLoading, setIsOrderAnalyticsLoading] = useState(true);

    useEffect(() => {
        if (session === undefined) return;
        if (session?.id) fetchOrders();
    }, [session]);

    const fetchOrders = async () => {
        if (!session?.id) return;
        try {
            setIsOrdersLoading(true);
            const response = await fetch(`/api/orders?userId=${session.id}&role=${session.role}`);
            if (!response.ok) throw new Error("Failed to fetch orders");
            const result: Orders[] = await response.json();
            setOrders(result);
            setShowAnalytics(result.length > 0 && session?.role === "admin");
        } catch (error) {
            console.error("Error fetching orders:", error);
            setOrders([]);
        } finally {
            setIsOrdersLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        if (session?.role !== "admin") return;
        try {
            setIsProfitAnalyticsLoading(true);
            setIsOrderAnalyticsLoading(true);

            const [profitResponse, orderResponse] = await Promise.all([fetch("/api/analytics/profit"), fetch("/api/analytics/order")]);

            const [profitData, orderData] = await Promise.all([profitResponse.json(), orderResponse.json()]);

            setProfitData(profitData);
            setOrderData(orderData);
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setIsProfitAnalyticsLoading(false);
            setIsOrderAnalyticsLoading(false);
        }
    };

    useEffect(() => {
        if (showAnalytics) {
            fetchAnalytics();
        }
    }, [refreshTrigger, showAnalytics]);

    const refreshAnalytics = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    return session === undefined ? null : (
        <section className="flex flex-col items-center justify-center gap-4">
            {session?.role === "admin" && showAnalytics && (
                <>
                    {!isProfitAnalyticsLoading && profitData && <h1 className={`${subtitle()} font-semibold`}>수익 통계</h1>}
                    {isProfitAnalyticsLoading ? (
                        <p className="text-lg text-gray-500 text-center mt-4">수익 통계를 불러오는 중...</p>
                    ) : (
                        profitData && <ProfitAnalytics profitData={profitData} />
                    )}

                    {!isOrderAnalyticsLoading && orderData && <h1 className={`${subtitle()} font-semibold`}>주문 통계</h1>}
                    {isOrderAnalyticsLoading ? (
                        <p className="text-lg text-gray-500 text-center mt-4">주문 통계를 불러오는 중...</p>
                    ) : (
                        orderData && <OrderAnalytics orderData={orderData} />
                    )}
                </>
            )}

            {!session?.id ? (
                <p className="text-lg text-gray-500 mt-10">로그인이 필요합니다.</p>
            ) : (
                <>
                    {!isOrdersLoading && orders.length > 0 && <h1 className={`${subtitle()} font-semibold`}>주문내역</h1>}

                    {isOrdersLoading ? (
                        <p className="text-lg text-gray-500 mt-10">주문을 불러오는 중...</p>
                    ) : orders.length === 0 ? (
                        <p className="text-lg text-gray-500 text-center mt-10">주문 내역이 없습니다.</p>
                    ) : (
                        <Orders orders={orders} refreshAnalytics={refreshAnalytics} fetchOrders={fetchOrders} />
                    )}
                </>
            )}
        </section>
    );
}
