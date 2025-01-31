"use client";

import { Table, TableBody, TableHeader, TableRow, TableColumn, TableCell, Chip, User, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useSession } from "@/context/sessionContext";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

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

// Status colors for UI
const statusColorMap: Record<string, "success" | "primary" | "secondary" | "danger" | "warning"> = {
    complete: "success",
    declined: "danger",
    pending: "warning",
    "in progress": "secondary",
};

// Status options for dropdown
const statusOptions = ["All", "Pending", "In Progress", "Complete", "Declined"];

export default function Orders() {
    const { session } = useSession();
    const [orders, setOrders] = useState<Orders[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<string>("All");
    const [selectedSort, setSelectedSort] = useState<"asc" | "desc">("desc");

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

    // Apply filtering based on selected status
    const filteredOrders = selectedStatus === "All" ? orders : orders.filter((order) => order.status.toLowerCase() === selectedStatus.toLowerCase());

    // Apply sorting based on selectedSort state
    const sortedOrders = [...filteredOrders].sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return selectedSort === "asc" ? dateA - dateB : dateB - dateA; // Ascending or descending order
    });

    return (
        <div className="flex flex-col items-center w-full overflow-x-auto">
            {isLoading ? (
                <p className="text-lg font-semibold text-gray-500 mt-10">주문을 불러오는 중...</p>
            ) : (
                <Table aria-label="Orders table" className="w-full">
                    <TableHeader>
                        <TableColumn className="text-center min-w-[120px]">USER</TableColumn>
                        <TableColumn className="text-center min-w-[100px]">VENMO ID</TableColumn>
                        <TableColumn className="text-center min-w-[150px]">ITEM</TableColumn>
                        <TableColumn className="text-center min-w-[80px]">PRICE</TableColumn>
                        <TableColumn className="text-center min-w-[80px]">TABLE</TableColumn>
                        <TableColumn className="text-center min-w-[150px] relative">
                            <div className="flex items-center justify-center gap-1">
                                DATE
                                <button className="focus:outline-none" onClick={() => setSelectedSort(selectedSort === "asc" ? "desc" : "asc")}>
                                    {selectedSort === "asc" ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                                </button>
                            </div>
                        </TableColumn>
                        <TableColumn className="text-center min-w-[120px] relative">
                            <div className="flex justify-center items-center w-full">
                                <span className="text-sm font-semibold text-gray-900">Status: {selectedStatus}</span>
                                <div className="absolute inset-0 opacity-0 cursor-pointer">
                                    <Select
                                        aria-label="Filter by Status"
                                        className="w-full h-full"
                                        selectedKeys={[selectedStatus]}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        disallowEmptySelection
                                    >
                                        {statusOptions.map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                        </TableColumn>
                    </TableHeader>
                    <TableBody>
                        {sortedOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">
                                    <p className="text-lg font-semibold text-gray-500">주문 내역이 없습니다.</p>
                                </TableCell>
                                <TableCell className="hidden">
                                    <></>
                                </TableCell>
                                <TableCell className="hidden">
                                    <></>
                                </TableCell>
                                <TableCell className="hidden">
                                    <></>
                                </TableCell>
                                <TableCell className="hidden">
                                    <></>
                                </TableCell>
                                <TableCell className="hidden">
                                    <></>
                                </TableCell>
                                <TableCell className="hidden">
                                    <></>
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedOrders.map((order) => (
                                <TableRow key={order.id} className="border-b border-gray-300">
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
                            ))
                        )}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
