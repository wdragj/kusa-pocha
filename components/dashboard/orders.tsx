"use client";

import { Table, TableBody, TableHeader, TableRow, TableColumn, TableCell, Chip, User } from "@nextui-org/react";
import { useEffect, useState } from "react";
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
    user_login_name: string;
    user_id: string;
    user_email: string;
    user_image: string;
    table_number: number;
    venmo_id: string;
    order: OrderItem[];
    total_price: number;
    status: keyof typeof statusColorMap;
    created_at: string;
}

const statusColorMap: Record<string, "success" | "primary" | "secondary" | "danger" | "warning"> = {
    complete: "success",
    declined: "danger",
    pending: "warning",
    "in progress": "secondary",
};

const columns = [
    { name: "USER", uid: "user" },
    { name: "VENMO ID", uid: "venmo_id" },
    { name: "ITEM", uid: "item" },
    { name: "PRICE", uid: "price" },
    { name: "TABLE", uid: "table" },
    { name: "DATE", uid: "date" },
    { name: "STATUS", uid: "status" },
];

export default function Orders() {
    const { session } = useSession();
    const [orders, setOrders] = useState<Orders[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!session?.id) {
            setIsLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/orders?userId=${session.id}&role=${session.role}`);
                if (!response.ok) throw new Error("Failed to fetch orders");

                const result = await response.json();
                setOrders(Array.isArray(result) ? result : []);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setOrders([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [session]);

    return (
        <div className="flex flex-col items-center">
            {isLoading ? (
                <p className="text-lg font-semibold text-gray-500 mt-10">주문을 불러오는 중...</p>
            ) : orders.length === 0 ? (
                <p className="text-lg font-semibold text-gray-500 mt-10">주문 내역이 없습니다.</p>
            ) : (
                <Table aria-label="Orders table">
                    <TableHeader columns={columns}>
                        {(column) => (
                            <TableColumn className="text-center" key={column.uid}>
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="text-center">
                                    <User
                                        avatarProps={{ radius: "lg", src: order.user_image }}
                                        description={order.user_email}
                                        name={order.user_login_name}
                                    />
                                </TableCell>
                                <TableCell className="text-center">{order.venmo_id}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-y-2">
                                        {order.order.map((item) => (
                                            <div key={item.itemId} className="my-1">
                                                <p className="font-semibold text-sm">
                                                    🍴 {item.itemName} ({item.quantity})
                                                </p>
                                                <p className="text-sm text-gray-600">💰 ${Number(item.price).toFixed(2)}</p>
                                                <p className="text-sm text-gray-500 capitalize">🏢 {item.organization}</p>
                                            </div>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">${Number(order.total_price).toFixed(2)}</TableCell>
                                <TableCell className="text-center">{order.table_number}</TableCell>
                                <TableCell className="text-center">
                                    {(() => {
                                        const date = new Date(order.created_at);
                                        const year = date.getFullYear();
                                        const month = String(date.getMonth() + 1).padStart(2, "0");
                                        const day = String(date.getDate()).padStart(2, "0");
                                        const hours = date.getHours();
                                        const minutes = String(date.getMinutes()).padStart(2, "0");
                                        const period = hours >= 12 ? "오후" : "오전";
                                        const formattedHours = hours % 12 || 12;

                                        return `${year}/${month}/${day} ${period} ${formattedHours}:${minutes}`;
                                    })()}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Chip className="capitalize" color={statusColorMap[order.status]} size="sm" variant="flat">
                                        {order.status}
                                    </Chip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
