"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination,
    Selection,
    SortDescriptor,
    DropdownSection,
    Card,
    CardBody,
} from "@heroui/react";
import { Tooltip } from "@heroui/react"; // or wherever you import Tooltip from
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { useSession } from "@/context/sessionContext";
import EditOrderModal from "./modals/editOrderModal";
import DeleteOrderModal from "./modals/deleteOrderModal";

/** -----------------------------
 *  Types
 *--------------------------------*/
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

/** -----------------------------
 *  Status Color Mapping
 *--------------------------------*/
const statusColorMap = {
    complete: "success",
    declined: "danger",
    pending: "warning",
    "in progress": "secondary",
} as const;

/** -----------------------------
 *  Columns Definition
 *--------------------------------*/
const columns = [
    { name: "Order #", uid: "order_number", sortable: true },
    { name: "User", uid: "user", sortable: true },
    { name: "Venmo ID", uid: "venmo_id" },
    { name: "Items", uid: "items" },
    { name: "Price", uid: "total_price", sortable: true },
    { name: "Table #", uid: "table_number" },
    { name: "Date", uid: "created_at", sortable: true },
    { name: "Status", uid: "status" },
    { name: "Actions", uid: "actions" },
];

/** -----------------------------
 *  Status Options (used in filters, etc.)
 *--------------------------------*/
const statusOptions = [
    { name: "Pending", uid: "pending" },
    { name: "In Progress", uid: "in progress" },
    { name: "Complete", uid: "complete" },
    { name: "Declined", uid: "declined" },
];

/** -----------------------------
 *  Helper Functions
 *--------------------------------*/
function capitalize(str?: string) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/** -----------------------------
 *  Main Component
 *--------------------------------*/
export default function OrdersTable({
    orders,
    refreshAnalytics,
    fetchOrders,
}: {
    orders: Orders[];
    refreshAnalytics: () => void;
    fetchOrders: () => void;
}) {
    const { session } = useSession();
    /** -----------------------------
     *  States
     *--------------------------------*/
    // Search filter (by user name / email)
    const [searchFilter, setSearchFilter] = useState("");
    // Status filter
    const [statusFilter, setStatusFilter] = useState<Selection>("all");
    // Columns visible
    const [visibleColumns, setVisibleColumns] = useState<Selection>(
        new Set(columns.map((c) => c.uid)) // by default all columns shown
    );
    // Sorting descriptor
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "created_at",
        direction: "descending",
    });
    // Pagination
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    // Table selection
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

    // For the modals
    const [selectedOrder, setSelectedOrder] = useState<Orders | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteModalProps, setDeleteModalProps] = useState<{
        orderIds?: string[];
        order?: Orders | null;
        customMessage?: string;
    }>({
        orderIds: [],
        order: null,
        customMessage: "",
    });

    /** -----------------------------
     *  Handlers
     *--------------------------------*/
    // Search change handler
    const handleSearchChange = useCallback((value?: string) => {
        setSearchFilter(value || "");
        setPage(1);
    }, []);

    // Rows per page change handler
    const handleRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = Number(e.target.value);
        setRowsPerPage(val);
        setPage(1);
    }, []);

    // Update order status handler
    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/orders/updateStatus`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, status: newStatus }),
            });

            if (!response.ok) throw new Error("Failed to update order status");
            fetchOrders();
            refreshAnalytics();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    // Bulk delete handler
    const handleDeleteSelected = async () => {
        try {
            let idsToDelete: string[];

            if (selectedKeys === "all") {
                // If user selected "All" from the table, then we can
                // delete all of the orders in `filteredByStatus` or `sortedOrders`
                // depending on your business logic. For example:
                idsToDelete = filteredByStatus.map((o) => o.id);
            } else {
                // Convert the selection (which is a Set or array) to a string array
                idsToDelete = Array.from(selectedKeys) as string[];
            }

            if (!idsToDelete.length) return; // nothing to delete

            const response = await fetch("/api/orders/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderIds: idsToDelete }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete selected orders");
            }

            // Refresh
            fetchOrders();
            refreshAnalytics();
            setSelectedKeys(new Set([])); // clear selection
        } catch (error) {
            console.error("Error deleting selected:", error);
        }
    };

    /** -----------------------------
     *  Data Memos (filtering, sorting, pagination)
     *--------------------------------*/
    // 1) Filter by user name, user email, venmo_id, or item name
    const filteredBySearch = useMemo(() => {
        if (!searchFilter) return orders;

        const lowerSearch = searchFilter.toLowerCase();

        return orders.filter((o) => {
            const userNameMatches = o.user_login_name.toLowerCase().includes(lowerSearch);
            const userEmailMatches = o.user_email.toLowerCase().includes(lowerSearch);
            const venmoMatches = o.venmo_id.toLowerCase().includes(lowerSearch);

            // Check if any order item name matches
            const hasItemMatch = o.order.some((item) => item.itemName.toLowerCase().includes(lowerSearch));

            // Include the order if it matches any of these conditions
            return userNameMatches || userEmailMatches || venmoMatches || hasItemMatch;
        });
    }, [orders, searchFilter]);

    // 2) Filter by status
    const filteredByStatus = useMemo(() => {
        // If "all" or if selection includes all statuses
        if (statusFilter === "all" || Array.from(statusFilter).length === statusOptions.length) {
            return filteredBySearch;
        }

        const selectedStatuses = new Set(Array.from(statusFilter));
        return filteredBySearch.filter((o) => selectedStatuses.has(o.status));
    }, [filteredBySearch, statusFilter]);

    // 3) Sort
    const sortedOrders = useMemo(() => {
        const { column, direction } = sortDescriptor;

        // If column is "items", just return the filtered array as-is (no sorting)
        if (column === "items") {
            return filteredByStatus;
        }

        const sorted = [...filteredByStatus].sort((a, b) => {
            let valA = a[column as keyof Orders];
            let valB = b[column as keyof Orders];

            // 1) If sorting by "created_at" -> convert to timestamp
            if (column === "created_at") {
                valA = new Date(a.created_at).getTime();
                valB = new Date(b.created_at).getTime();
            }

            // 2) If sorting by "user" -> compare user_login_name
            if (column === "user") {
                valA = a.user_login_name.toLowerCase();
                valB = b.user_login_name.toLowerCase();
            }

            // 3) Numeric compare (order_number, total_price, table_number, etc.)
            if (typeof valA === "number" && typeof valB === "number") {
                return direction === "ascending" ? valA - valB : valB - valA;
            }

            // 4) String compare fallback
            const compare = String(valA).localeCompare(String(valB));
            return direction === "ascending" ? compare : -compare;
        });

        return sorted;
    }, [filteredByStatus, sortDescriptor]);

    // 4) Pagination
    const totalPages = Math.ceil(sortedOrders.length / rowsPerPage);
    const paginatedOrders = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return sortedOrders.slice(start, end);
    }, [sortedOrders, page, rowsPerPage]);

    /** -----------------------------
     *  Column & Cell Rendering
     *--------------------------------*/
    // Filter the columns that are visible
    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns;
        return columns.filter((col) => Array.from(visibleColumns).includes(col.uid));
    }, [visibleColumns]);

    // Render a single cell
    const renderCell = useCallback(
        (order: Orders, columnKey: React.Key) => {
            switch (columnKey) {
                case "order_number":
                    return <>{order.order_number}</>;

                case "user":
                    return <User avatarProps={{ radius: "lg", src: order.user_image }} description={order.user_email} name={order.user_login_name} />;

                case "venmo_id":
                    return <>{order.venmo_id || "--"}</>;

                case "items":
                    return (
                        <div className="flex flex-col gap-2">
                            {order.order.map((item) => (
                                <div key={item.itemId}>
                                    <p className="text-sm font-semibold">
                                        🍴 {item.itemName} ({item.quantity})
                                    </p>
                                    {session?.role === "admin" && <p className="text-xs text-default-500">🏢 {item.organization}</p>}
                                    <p className="text-xs text-default-400">${Number(item.price).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    );

                case "total_price":
                    return <>${Number(order.total_price).toFixed(2)}</>;

                case "table_number":
                    return <>{order.table_number}</>;

                case "created_at":
                    return <>{new Date(order.created_at).toLocaleString()}</>;

                case "status":
                    return (
                        <Chip className="capitalize" color={statusColorMap[order.status]} size="sm" variant="flat">
                            {order.status}
                        </Chip>
                    );

                case "actions":
                    return session?.role === "admin" ? (
                        <div className="flex gap-2 justify-center">
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button isIconOnly size="sm" variant="light">
                                        <MoreVertIcon fontSize="small" />
                                    </Button>
                                </DropdownTrigger>

                                <DropdownMenu aria-label="Actions">
                                    {/* First section specifically for changing order status */}
                                    <DropdownSection title="Change Status">
                                        <DropdownItem key="pending" color="warning" onPress={() => handleStatusUpdate(order.id, "pending")}>
                                            Pending
                                        </DropdownItem>
                                        <DropdownItem key="in progress" color="secondary" onPress={() => handleStatusUpdate(order.id, "in progress")}>
                                            In Progress
                                        </DropdownItem>
                                        <DropdownItem key="complete" color="success" onPress={() => handleStatusUpdate(order.id, "complete")}>
                                            Complete
                                        </DropdownItem>
                                        <DropdownItem key="declined" color="danger" onPress={() => handleStatusUpdate(order.id, "declined")}>
                                            Declined
                                        </DropdownItem>
                                    </DropdownSection>

                                    {/* Second section for general order actions */}
                                    <DropdownSection title="Order">
                                        <DropdownItem
                                            key="edit"
                                            color="warning"
                                            onPress={() => {
                                                setSelectedOrder(order);
                                                setIsEditOpen(true);
                                            }}
                                        >
                                            Edit
                                        </DropdownItem>
                                        <DropdownItem
                                            key="delete"
                                            color="danger"
                                            onPress={() => {
                                                setDeleteModalProps({
                                                    orderIds: [order.id],
                                                    customMessage: `${order.order_number}번 주문을 삭제하시겠습니까?`,
                                                });
                                                setDeleteModalOpen(true);
                                            }}
                                        >
                                            Delete
                                        </DropdownItem>
                                    </DropdownSection>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    ) : (
                        <span className="text-default-400 text-sm">–</span>
                    );

                default:
                    return null;
            }
        },
        [session?.role]
    );

    const selectedCount = selectedKeys === "all" ? filteredByStatus.length : selectedKeys.size;

    /** -----------------------------
     *  Top Content (search, filter, columns)
     *--------------------------------*/
    const topContent = (
        <div className="flex flex-col gap-4">
            {/* Search / Filters / Columns / etc. */}
            <div className="flex justify-between gap-3 items-end">
                {/* Search by user or email */}
                <Input
                    isClearable
                    classNames={{
                        base: "w-full sm:max-w-[44%]",
                        inputWrapper: "border-1",
                    }}
                    placeholder="Search by user name, email, venmo id, item name..."
                    size="sm"
                    value={searchFilter}
                    variant="bordered"
                    onClear={() => setSearchFilter("")}
                    onValueChange={handleSearchChange}
                />

                {/* Right side: Delete Selected (conditionally), Status, Columns */}
                <div className="flex gap-3 items-end">
                    {/* Delete selected */}
                    {selectedCount > 0 && (
                        <Tooltip content="Delete Selected">
                            <Button
                                color="danger"
                                size="sm"
                                variant="flat"
                                isIconOnly
                                onPress={() => {
                                    // Build array of IDs to delete
                                    const idsToDelete =
                                        selectedKeys === "all" ? filteredByStatus.map((o) => o.id) : (Array.from(selectedKeys) as string[]);

                                    setDeleteModalProps({
                                        orderIds: idsToDelete,
                                        customMessage: `${idsToDelete.length}건의 주문을 삭제하시겠습니까?`,
                                    });
                                    setDeleteModalOpen(true);
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </Button>
                        </Tooltip>
                    )}

                    {/* Status filter */}
                    <Dropdown>
                        <DropdownTrigger>
                            <Button size="sm" variant="flat">
                                Status
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label="Status Filter"
                            closeOnSelect={false}
                            selectedKeys={statusFilter}
                            selectionMode="multiple"
                            onSelectionChange={setStatusFilter}
                        >
                            {statusOptions.map((status) => (
                                <DropdownItem key={status.uid}>{capitalize(status.name)}</DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>

                    {/* Column Visibility */}
                    <Dropdown>
                        <DropdownTrigger>
                            <Button size="sm" variant="flat">
                                Columns
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label="Table Columns"
                            closeOnSelect={false}
                            selectedKeys={visibleColumns}
                            selectionMode="multiple"
                            onSelectionChange={setVisibleColumns}
                        >
                            {columns.map((col) => (
                                <DropdownItem key={col.uid}>{col.name}</DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>

            {/* Row count & Rows per page */}
            <div className="flex justify-between items-center">
                <span className="text-default-400 text-small">Showing {sortedOrders.length} total order(s)</span>

                <label className="flex items-center text-default-400 text-small gap-2">
                    Rows per page:
                    <select
                        className="bg-transparent outline-none text-default-400 text-small"
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                </label>
            </div>
        </div>
    );

    /** -----------------------------
     *  Bottom Content (pagination, selection info)
     *--------------------------------*/
    const bottomContent = (
        <div className="py-2 px-2 flex justify-between items-center">
            <Pagination showControls page={page} total={totalPages} onChange={(newPage) => setPage(newPage)} />
            <span className="text-small text-default-400">
                {selectedKeys === "all" ? "All items selected" : `${selectedKeys.size} of ${paginatedOrders.length} selected`}
            </span>
        </div>
    );

    /** -----------------------------
     *  Table Class Names
     *--------------------------------*/
    const classNames = useMemo(
        () => ({
            wrapper: ["max-h-[600px]", "overflow-auto"],
            th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
            td: [],
        }),
        []
    );

    return (
        <div className="flex flex-col items-center w-full">
            {/* MOBILE VIEW: Card Layout */}
            <div className="w-full max-w-6xl block lg:hidden">
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

            {/* DESKTOP VIEW: Table */}
            <div className="hidden lg:block w-full shadow-lg border border-default-200 rounded-xl p-5">
                <Table
                    isCompact
                    removeWrapper
                    aria-label="Orders table"
                    topContent={topContent}
                    bottomContent={bottomContent}
                    topContentPlacement="outside"
                    bottomContentPlacement="outside"
                    selectedKeys={selectedKeys}
                    selectionMode="multiple"
                    sortDescriptor={sortDescriptor}
                    onSortChange={setSortDescriptor}
                    onSelectionChange={setSelectedKeys}
                    classNames={classNames}
                >
                    <TableHeader columns={headerColumns}>
                        {(column) => (
                            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} allowsSorting={column.sortable}>
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody emptyContent="No orders found" items={paginatedOrders}>
                        {(order) => <TableRow key={order.id}>{(columnKey) => <TableCell>{renderCell(order, columnKey)}</TableCell>}</TableRow>}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Modal */}
            <EditOrderModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                order={selectedOrder}
                refreshOrders={fetchOrders}
                refreshAnalytics={refreshAnalytics}
            />

            {/* Delete Modal */}
            <DeleteOrderModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                orderIds={deleteModalProps.orderIds}
                customMessage={deleteModalProps.customMessage}
                refreshOrders={fetchOrders}
                refreshAnalytics={refreshAnalytics}
            />
        </div>
    );
}
