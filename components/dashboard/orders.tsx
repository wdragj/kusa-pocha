"use client";

import { Table, TableBody, TableHeader, TableRow, TableColumn, TableCell, Chip, User } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";

import { createClient } from "@/utils/supabase/client";

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
    order: OrderItem[]; // Array of OrderItem objects
    total_price: number;
    status: keyof typeof statusColorMap; // Ensures `status` matches predefined keys
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
    { name: "ACTIONS", uid: "actions" },
];

export default function Orders() {
    const supabase = createClient();

    // Orders state
    const [orders, setOrders] = useState<Orders[]>([]);

    // Fetch orders from the server
    const fetchOrders = async () => {
        try {
            const response = await fetch("/api/orders");
            const data = await response.json();

            console.log(data);

            setOrders(data);
            // setItemsLoaded(true);
        } catch (error) {
            console.error("Failed to fetch menus:", error);
            // setItemsLoaded(true);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []); // Empty array ensures it runs only on mount

    const renderCell = useCallback((order: Orders, columnKey: string) => {
        const cellValue = order[columnKey as keyof Orders];

        // console.log("Order:", order); // Log the entire order object
        // console.log("Order item:", order.order); // Log the order items
        // console.log("ColumnKey:", columnKey); // Log the column key being rendered

        switch (columnKey) {
            case "user":
                return (
                    <User avatarProps={{ radius: "lg", src: order.user_image }} description={order.user_email} name={order.user_login_name as string}>
                        {order.venmo_id}
                    </User>
                );
            case "venmo_id":
                return <p className="text-sm">{order.venmo_id}</p>;
            case "item":
                return (
                    <div className="flex flex-col gap-y-2">
                        {order.order.map((item) => (
                            <div key={item.itemId} className="my-1">
                                <p className="font-semibold text-sm">
                                    <span className="mr-1">🍴</span> {item.itemName} ({item.quantity})
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="mr-1">💰</span> ${item.price.toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-500 capitalize">
                                    <span className="mr-1">🏢</span> {item.organization}
                                </p>
                            </div>
                        ))}
                    </div>
                );
            case "price":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">${order.total_price}</p>
                    </div>
                );
            case "table":
                return <p className="text-sm">{order.table_number}</p>;
            case "date":
                return (
                    <p className="text-sm">
                        {(() => {
                            const date = new Date(order.created_at);
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
                            const day = String(date.getDate()).padStart(2, "0");
                            const hours = date.getHours();
                            const minutes = String(date.getMinutes()).padStart(2, "0");
                            const seconds = String(date.getSeconds()).padStart(2, "0"); // Add seconds
                            const period = hours >= 12 ? "오후" : "오전";
                            const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format

                            return `${year}/${month}/${day} ${period} ${formattedHours}:${minutes}:${seconds}`;
                        })()}
                    </p>
                );
            case "status":
                return (
                    <Chip className="capitalize" color={statusColorMap[order.status]} size="sm" variant="flat">
                        {order.status}
                    </Chip>
                );
            default:
            // return <span>{cellValue}</span>;
        }
    }, []);

    return (
        <Table aria-label="Orders table">
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn className="text-center" key={column.uid}>
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody items={orders}>
                {(order: Orders) => (
                    <TableRow key={order.id}>
                        {(columnKey) => (
                            <TableCell
                                className={
                                    columnKey === "venmo_id" || columnKey === "price" || columnKey === "table" || columnKey === "date"
                                        ? "text-center"
                                        : ""
                                }
                            >
                                {renderCell(order, columnKey as string)}
                            </TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
