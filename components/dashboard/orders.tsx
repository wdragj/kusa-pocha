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
    Card,
    CardBody,
    Tooltip,
} from "@heroui/react";
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

export default function Orders({
    orders,
    refreshAnalytics,
    fetchOrders,
}: {
    orders: Orders[];
    refreshAnalytics: () => void;
    fetchOrders: () => void;
}) {
    const { session } = useSession();
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["Pending", "In Progress", "Complete", "Declined"]);
    const [selectedSort, setSelectedSort] = useState<"asc" | "desc">("desc");
    const [selectedOrder, setSelectedOrder] = useState<Orders | null>(null);

    const editOrderModal = useDisclosure();
    const deleteOrderModal = useDisclosure();

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

    // Handle status update
    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/orders/updateStatus`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, status: newStatus }),
            });

            if (!response.ok) throw new Error("Failed to update order status");

            console.log(`Order ${orderId} status updated to ${newStatus}`);

            // Refresh orders & analytics
            fetchOrders();
            refreshAnalytics();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            {/* Mobile View: Card Layout */}
            <div className="w-full max-w-6xl block md:hidden">
                {sortedOrders.map((order) => (
                    <Card key={order.id} className="w-full shadow-md mb-4">
                        <CardBody>
                            <div className="flex justify-between items-center">
                                <User
                                    avatarProps={{ radius: "lg", src: order.user_image }}
                                    description={order.user_email}
                                    name={order.user_login_name}
                                />
                                <Chip className="capitalize" color={statusColorMap[order.status]} size="sm" variant="flat">
                                    {order.status}
                                </Chip>
                            </div>

                            <div className="mt-3 text-sm text-default-600">
                                <p>📅 {new Date(order.created_at).toLocaleString()}</p>
                                <p>💰 총 금액: ${Number(order.total_price).toFixed(2)}</p>
                                <p>📍 테이블 번호: {order.table_number}</p>
                                <p>🔗 Venmo: {order.venmo_id}</p>
                            </div>

                            <div className="mt-3 space-y-2">
                                {order.order.map((item) => (
                                    <div key={item.itemId} className="bg-content2 p-2 rounded-md flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-sm">
                                                🍴 {item.itemName} ({item.quantity})
                                            </p>
                                            {session?.role === "admin" && <p className="text-xs text-default-500">🏢 {item.organization}</p>}
                                        </div>
                                        <p className="text-sm font-semibold">${Number(item.price).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
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
                                <Tooltip content="Sort">
                                    <button className="focus:outline-none" onClick={() => setSelectedSort(selectedSort === "asc" ? "desc" : "asc")}>
                                        {selectedSort === "asc" ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                                    </button>
                                </Tooltip>
                            </div>
                        </TableColumn>
                        <TableColumn className="text-center relative">
                            <div className="flex justify-center items-center w-full">
                                <span>STATUS</span>
                                <Tooltip content="Filter by Status">
                                    <div className="absolute inset-0 opacity-0 cursor-pointer">
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
                                </Tooltip>
                            </div>
                        </TableColumn>
                    </TableHeader>

                    <TableBody>
                        {sortedOrders.map((order) => (
                            <TableRow key={order.id} className="border-b border-gray-300">
                                <TableCell className="text-center font-semibold w-[16px]">{order.order_number}</TableCell>
                                <TableCell className="text-left">
                                    <User
                                        avatarProps={{ radius: "lg", src: order.user_image }}
                                        description={order.user_email}
                                        name={order.user_login_name}
                                    />
                                </TableCell>
                                <TableCell className="text-left">{order.venmo_id}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-y-2">
                                        {order.order.map((item) => (
                                            <div key={item.itemId} className="my-1 text-left">
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
                                            <Tooltip content="Change Status" placement="top-start">
                                                <div className="absolute inset-0 opacity-0 cursor-pointer">
                                                    <Select
                                                        aria-label="Change Order Status"
                                                        className="w-full h-full"
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
                                                </div>
                                            </Tooltip>
                                        )}
                                        {session?.role === "admin" && (
                                            <div className="flex gap-2 ml-4">
                                                <Tooltip content="Edit Order">
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
                                                </Tooltip>

                                                <Tooltip content="Delete Order">
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
                                                </Tooltip>
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
        </div>
    );
}
