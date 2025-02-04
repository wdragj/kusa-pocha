"use client";

import {
    Table,
    TableBody,
    TableHeader,
    TableRow,
    TableColumn,
    TableCell,
    Chip,
    User,
    Select,
    SelectItem,
    Button,
    useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useSession } from "@/context/sessionContext";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditOrderModal from "./modals/editOrderModal";
import DeleteOrderModal from "./modals/deleteOrderModal";

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
const statusOptions = ["Pending", "In Progress", "Complete", "Declined"];

export default function Orders({ refreshAnalytics }: { refreshAnalytics: () => void }) {
    const { session } = useSession();
    const [orders, setOrders] = useState<Orders[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["Pending", "In Progress", "Complete", "Declined"]); // Default to all statuses
    const [selectedSort, setSelectedSort] = useState<"asc" | "desc">("desc");
    const [selectedOrder, setSelectedOrder] = useState<Orders | null>(null);

    const editOrderModal = useDisclosure();
    const deleteOrderModal = useDisclosure();

    useEffect(() => {
        if (!session?.id || !session?.role) {
            setIsLoading(false);
            return;
        }

        fetchOrders();
    }, [session]);

    const fetchOrders = async () => {
        if (!session?.id || !session?.role) {
            setIsLoading(false);
            return;
        }

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

    // Update order status
    const handleStatusUpdate = async (orderId: string, newStatus: keyof typeof statusColorMap) => {
        try {
            const response = await fetch(`/api/orders/updateStatus`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ orderId, status: newStatus }),
            });

            if (!response.ok) throw new Error("Failed to update order status");

            console.log(`Order ${orderId} status updated to ${newStatus}`);

            // Update local state
            setOrders((prevOrders) => prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)));

            // Refresh analytics
            refreshAnalytics();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    // Apply filtering based on selected statuses
    const filteredOrders =
        selectedStatuses.length === 0
            ? orders
            : orders.filter((order) => selectedStatuses.some((status) => status.toLowerCase() === order.status.toLowerCase()));

    // Apply sorting based on selectedSort state
    const sortedOrders = [...filteredOrders].sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return selectedSort === "asc" ? dateA - dateB : dateB - dateA; // Ascending or descending order
    });

    // Handle status selection change
    const handleStatusChange = (keys: any) => {
        setSelectedStatuses(Array.from(keys) as string[]);
    };

    return (
        <div className="flex flex-col items-center w-full">
            {isLoading ? (
                <p className="text-lg text-gray-500 mt-10">주문을 불러오는 중...</p>
            ) : !session?.id ? (
                <p className="text-lg text-gray-500 mt-10">로그인이 필요합니다.</p>
            ) : sortedOrders.length === 0 ? (
                <p className="text-lg text-gray-500 text-center mt-10">주문 내역이 없습니다.</p>
            ) : (
                <>
                    {/* Mobile View: Card Layout */}
                    <div className="w-full max-w-6xl block md:hidden">
                        {sortedOrders.map((order) => (
                            <div key={order.id} className="bg-white shadow-md rounded-lg p-4 mb-4 w-full">
                                <div className="flex items-center justify-between">
                                    <User
                                        avatarProps={{ radius: "lg", src: order.user_image }}
                                        description={order.user_email}
                                        name={order.user_login_name}
                                    />
                                    <Chip className="capitalize" color={statusColorMap[order.status]} size="sm" variant="flat">
                                        {order.status}
                                    </Chip>
                                </div>
                                <p className="text-gray-600 text-sm mt-2 text-left">📅 {new Date(order.created_at).toLocaleString()}</p>
                                <p className="text-gray-600 text-sm text-left">💰 총 금액: ${Number(order.total_price).toFixed(2)}</p>
                                <p className="text-gray-600 text-sm text-left">📍 테이블 번호: {order.table_number}</p>
                                <p className="text-gray-600 text-sm text-left">🔗 Venmo: {order.venmo_id}</p>

                                <div className="mt-3">
                                    {order.order.map((item) => (
                                        <div key={item.itemId} className="flex justify-between items-center bg-gray-100 p-2 rounded-md mb-1">
                                            <div>
                                                <p className="font-semibold text-sm text-left">
                                                    🍴 {item.itemName} ({item.quantity})
                                                </p>
                                                {session?.role === "admin" && ( // Only show organization if admin
                                                    <p className="text-sm text-gray-500 text-left">🏢 {item.organization}</p>
                                                )}
                                            </div>
                                            <p className="text-sm font-semibold">${Number(item.price).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop View: Full Table */}
                    <div className="hidden md:block w-full ">
                        <Table aria-label="Orders table" className="w-full">
                            <TableHeader>
                                <TableColumn className="text-center w-[16px]">Order No.</TableColumn>
                                <TableColumn className="text-center">USER</TableColumn>
                                <TableColumn className="text-center">VENMO ID</TableColumn>
                                <TableColumn className="text-center">ITEM</TableColumn>
                                <TableColumn className="text-center">PRICE</TableColumn>
                                <TableColumn className="text-center">TABLE</TableColumn>
                                <TableColumn className="text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        DATE
                                        <button
                                            className="focus:outline-none"
                                            onClick={() => setSelectedSort(selectedSort === "asc" ? "desc" : "asc")}
                                        >
                                            {selectedSort === "asc" ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                                        </button>
                                    </div>
                                </TableColumn>
                                <TableColumn className="text-center relative">
                                    <div className="flex justify-center items-center w-full">
                                        <span>STATUS</span>
                                        <div className="absolute inset-0 opacity-0 cursor-pointer">
                                            hi
                                            <Select
                                                aria-label="Filter by Status"
                                                className="w-full h-full"
                                                selectedKeys={selectedStatuses}
                                                onSelectionChange={handleStatusChange}
                                                disallowEmptySelection
                                                selectionMode="multiple" // Allow multiple selections
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
                                {sortedOrders.map((order) => (
                                    <TableRow key={order.id} className="border-b border-gray-300">
                                        <TableCell className="text-center font-semibold w-[16px]">{order.order_number}</TableCell>
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
                                                    <div key={item.itemId} className="my-1 text-center">
                                                        <p className="font-semibold text-sm">
                                                            🍴 {item.itemName} ({item.quantity})
                                                        </p>
                                                        <p className="text-sm text-gray-600">💰 ${Number(item.price).toFixed(2)}</p>
                                                        <p className="text-sm text-gray-500 capitalize">
                                                            {session?.role === "admin" && <>🏢 {item.organization}</>}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">${Number(order.total_price).toFixed(2)}</TableCell>
                                        <TableCell className="text-center">{order.table_number}</TableCell>
                                        <TableCell className="text-center">{new Date(order.created_at).toLocaleString()}</TableCell>
                                        <TableCell className="text-center relative">
                                            <div className="flex justify-center items-center w-full">
                                                <Chip
                                                    className={`capitalize ${session?.role === "admin" ? "cursor-pointer" : ""}`}
                                                    color={statusColorMap[order.status]}
                                                    size="sm"
                                                    variant="flat"
                                                >
                                                    {order.status}
                                                </Chip>

                                                {session?.role === "admin" && (
                                                    <Select
                                                        aria-label="Change Order Status"
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        selectedKeys={[order.status]}
                                                        onSelectionChange={(keys) => {
                                                            const newStatus = Array.from(keys)[0] as keyof typeof statusColorMap;
                                                            handleStatusUpdate(order.id, newStatus);
                                                        }}
                                                        disallowEmptySelection
                                                        selectionMode="single"
                                                    >
                                                        {Object.entries({
                                                            complete: "Complete",
                                                            "in progress": "In Progress",
                                                            declined: "Declined",
                                                            pending: "Pending",
                                                        }).map(([value, label]) => (
                                                            <SelectItem key={value} value={value}>
                                                                {label}
                                                            </SelectItem>
                                                        ))}
                                                    </Select>
                                                )}
                                                {session?.role === "admin" && (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="light"
                                                            onPress={() => {
                                                                setSelectedOrder(order);
                                                                editOrderModal.onOpen();
                                                            }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </Button>
                                                        <Button
                                                            color="danger"
                                                            isIconOnly
                                                            size="sm"
                                                            variant="light"
                                                            onPress={() => {
                                                                setSelectedOrder(order);
                                                                deleteOrderModal.onOpen();
                                                            }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <EditOrderModal
                            isOpen={editOrderModal.isOpen}
                            onClose={editOrderModal.onClose}
                            order={selectedOrder}
                            refreshOrders={fetchOrders}
                            refreshAnalytics={refreshAnalytics}
                        />

                        <DeleteOrderModal
                            isOpen={deleteOrderModal.isOpen}
                            onClose={deleteOrderModal.onClose}
                            order={selectedOrder}
                            refreshOrders={fetchOrders}
                            refreshAnalytics={refreshAnalytics}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
