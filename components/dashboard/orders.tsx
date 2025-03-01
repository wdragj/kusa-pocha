"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Image,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination,
    Progress,
    Selection,
    SortDescriptor,
    DropdownSection,
    Card,
    CardBody,
    Alert,
    Badge,
    Divider,
} from "@heroui/react";
import { Tooltip } from "@heroui/react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NotificationsIcon from "@mui/icons-material/Notifications";

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
    payment_id: string; // New field
    payment_method: string; // New field
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

/** -----------------------------
 *  Status Color Mapping
 *--------------------------------*/
const statusColorMap = {
    complete: "success",
    declined: "danger",
    pending: "warning",
    "in progress": "secondary",
    unknown: "default",
} as const;

/** -----------------------------
 *  Columns Definition
 *--------------------------------*/
// Replace "Venmo ID" with "Payment Info"
const columns = [
    { name: "Order #", uid: "order_number", sortable: true },
    { name: "User", uid: "user", sortable: true },
    { name: "Payment Info", uid: "payment", sortable: false },
    { name: "Items", uid: "items" },
    { name: "Price", uid: "total_price", sortable: true },
    { name: "Table #", uid: "table_number", sortable: true },
    { name: "Date", uid: "created_at", sortable: true },
    { name: "Status", uid: "status", sortable: true },
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
    profitData,
    orderData,
}: {
    orders: Orders[];
    refreshAnalytics: () => void;
    fetchOrders: () => void;
    profitData: ProfitAnalyticsData | null;
    orderData: OrderAnalyticsData | null;
}) {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error("Missing Supabase environment variables.");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { session } = useSession();

    // Determine if current user is admin
    const isAdmin = session?.role === "admin";

    /** -----------------------------
     *  States
     *--------------------------------*/
    // Global alert for new orders (admins only)
    const [alert, setAlert] = useState<{
        show: boolean;
        orderNumber?: number;
        userLoginName?: string;
        userEmail?: string;
        tableNumber?: number;
        payment_id?: string;
        payment_method?: string;
        totalPrice?: number;
    } | null>(null);
    const [newOrdersCount, setNewOrdersCount] = useState(0);
    const [searchFilter, setSearchFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState<Selection>("all");
    const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(columns.map((c) => c.uid)));
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "created_at",
        direction: "descending",
    });
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

    // For modals
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
     *  Realtime Updates (Admins Only)
     *--------------------------------*/
    useEffect(() => {
        if (!isAdmin) return;

        const channel = supabase
            .channel("realtime:orders")
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, (payload) => {
                // console.log("New order received:", payload.new);

                // Increment the new order count
                setNewOrdersCount((prev) => prev + 1);

                // Show notification to admin
                setAlert({
                    show: true,
                    orderNumber: payload.new.order_number,
                    userLoginName: payload.new.user_login_name,
                    userEmail: payload.new.user_email,
                    tableNumber: payload.new.table_number,
                    payment_id: payload.new.payment_id,
                    payment_method: payload.new.payment_method,
                    totalPrice: payload.new.total_price,
                });

                // Auto-hide alert after 7 seconds
                setTimeout(() => setAlert(null), 7000);
            })
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, [isAdmin]);

    /** -----------------------------
     *  Handlers
     *--------------------------------*/
    const handleFetchOrders = () => {
        fetchOrders();
        refreshAnalytics();
        setNewOrdersCount(0);
    };

    const handleSearchChange = useCallback((value?: string) => {
        setSearchFilter(value || "");
        setPage(1);
    }, []);

    const handleRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = Number(e.target.value);
        setRowsPerPage(val);
        setPage(1);
    }, []);

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

    /** -----------------------------
     *  Data Memos (filtering, sorting, pagination)
     *--------------------------------*/
    // Filter by search
    const filteredBySearch = useMemo(() => {
        if (!searchFilter) return orders;
        const lowerSearch = searchFilter.toLowerCase();
        return orders.filter((o) => {
            const userNameMatches = o.user_login_name.toLowerCase().includes(lowerSearch);
            const userEmailMatches = o.user_email.toLowerCase().includes(lowerSearch);
            const paymentMatches =
                (o.payment_id && o.payment_id.toLowerCase().includes(lowerSearch)) ||
                (o.payment_method && o.payment_method.toLowerCase().includes(lowerSearch));
            const hasItemMatch = o.order.some((item) => item.itemName.toLowerCase().includes(lowerSearch));
            return userNameMatches || userEmailMatches || paymentMatches || hasItemMatch;
        });
    }, [orders, searchFilter]);

    // Filter by status
    const filteredByStatus = useMemo(() => {
        if (statusFilter === "all" || Array.from(statusFilter).length === statusOptions.length) {
            return filteredBySearch;
        }
        const selectedStatuses = new Set(Array.from(statusFilter));
        return filteredBySearch.filter((o) => selectedStatuses.has(o.status));
    }, [filteredBySearch, statusFilter]);

    // Sorting
    const sortedOrders = useMemo(() => {
        const { column, direction } = sortDescriptor;
        if (column === "items") return filteredByStatus;
        const sorted = [...filteredByStatus].sort((a, b) => {
            let valA = a[column as keyof Orders];
            let valB = b[column as keyof Orders];

            if (column === "created_at") {
                valA = new Date(a.created_at).getTime();
                valB = new Date(b.created_at).getTime();
            }
            if (column === "user") {
                valA = a.user_login_name.toLowerCase();
                valB = b.user_login_name.toLowerCase();
            }
            if (typeof valA === "number" && typeof valB === "number") {
                return direction === "ascending" ? valA - valB : valB - valA;
            }
            const compare = String(valA).localeCompare(String(valB));
            return direction === "ascending" ? compare : -compare;
        });
        return sorted;
    }, [filteredByStatus, sortDescriptor]);

    // Pagination
    const totalPages = Math.ceil(sortedOrders.length / rowsPerPage);
    const paginatedOrders = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return sortedOrders.slice(start, start + rowsPerPage);
    }, [sortedOrders, page, rowsPerPage]);
    const totalOrdersCount = orders.length;
    const selectionCount = selectedKeys === "all" ? totalOrdersCount : selectedKeys.size;
    const selectedCount = selectedKeys === "all" ? filteredByStatus.length : selectedKeys.size;

    /** -----------------------------
     *  Column & Cell Rendering
     *--------------------------------*/
    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns;
        return columns.filter((col) => Array.from(visibleColumns).includes(col.uid));
    }, [visibleColumns]);

    const renderCell = useCallback(
        (order: Orders, columnKey: React.Key) => {
            switch (columnKey) {
                case "order_number":
                    return <>{order.order_number}</>;
                case "user":
                    return <User avatarProps={{ radius: "lg", src: order.user_image }} description={order.user_email} name={order.user_login_name} />;
                case "payment":
                    return (
                        <div className="flex flex-row items-center">
                            {order.payment_method === "zelle" && (
                                <Image
                                    alt="Zelle icon"
                                    src="https://img.icons8.com/?size=100&id=Iirw95F6Nl9c&format=png&color=000000"
                                    width={20}
                                    radius="none"
                                />
                            )}
                            {order.payment_method === "venmo" && (
                                <Image
                                    alt="Venmo icon"
                                    src="https://img.icons8.com/?size=100&id=1gAt2ZCIcIrv&format=png&color=000000"
                                    width={20}
                                    radius="none"
                                />
                            )}
                            <p className="ml-1">{order.payment_method ? `${order.payment_id}` : "--"}</p>
                        </div>
                    );
                case "items":
                    return (
                        <div className="flex flex-col gap-2">
                            {order.order.map((item) => (
                                <div key={item.itemId}>
                                    <p className="text-sm text-default-600 font-semibold">
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
                    // return <>{new Date(order.created_at).toLocaleString()}</>;
                    return (
                        <>
                            {new Date(order.created_at).toLocaleDateString()}
                            <br />
                            {new Date(order.created_at).toLocaleTimeString()}
                        </>
                    );
                case "status":
                    return (
                        <Chip
                            className="capitalize"
                            color={statusColorMap[order.status as keyof typeof statusColorMap] || "default"}
                            size="sm"
                            variant="flat"
                        >
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

    /** -----------------------------
     *  Top Content (search, filter, columns)
     *--------------------------------*/
    const topContent = (
        <div className="flex flex-col gap-4 w-full">
            {isAdmin && (
                <div className="flex justify-center items-center w-full gap-2">
                    {profitData ? (
                        <>
                            <Chip size="md" variant="flat" color="primary" radius="sm">
                                Total Profit: ${profitData.totalProfit}
                            </Chip>
                            {Object.entries(profitData.profitPerOrg).map(([org, profit]) => (
                                <Tooltip key={org} content={`${org}: $${profit}`}>
                                    <Chip size="md" variant="flat" color="default" radius="sm">
                                        {org}
                                    </Chip>
                                </Tooltip>
                            ))}
                        </>
                    ) : (
                        <Progress size="sm" isIndeterminate aria-label="Loading profit analytics..." className="max-w-md" />
                    )}
                </div>
            )}

            <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2 w-[30%]">
                    <Input
                        isClearable
                        classNames={{ base: "w-[50%]", inputWrapper: "border-1" }}
                        placeholder="Search..."
                        size="sm"
                        value={searchFilter}
                        variant="bordered"
                        onClear={() => setSearchFilter("")}
                        onValueChange={handleSearchChange}
                    />
                    {isAdmin && (
                        <div className="flex items-center gap-1 w-[30%]">
                            <Tooltip content={newOrdersCount > 0 ? "Update new orders" : "Orders are up to date"} delay={1} closeDelay={1}>
                                <div>
                                    <Button
                                        variant="light"
                                        size="lg"
                                        isIconOnly
                                        radius="full"
                                        aria-label="New Orders Notification"
                                        isDisabled={newOrdersCount === 0}
                                        onPress={handleFetchOrders}
                                        style={{
                                            background: "transparent",
                                            border: "none",
                                            boxShadow: "none",
                                            padding: 0,
                                        }}
                                    >
                                        {newOrdersCount > 0 ? (
                                            <Badge color="danger" content={newOrdersCount} shape="circle" size="md">
                                                <NotificationsIcon fontSize="medium" />
                                            </Badge>
                                        ) : (
                                            <NotificationsIcon fontSize="medium" />
                                        )}
                                    </Button>
                                </div>
                            </Tooltip>
                        </div>
                    )}
                </div>

                {isAdmin && (
                    <div className="flex items-center gap-2 w-[60%]">
                        {orderData ? (
                            <>
                                <Chip size="sm" color="primary" variant="flat">
                                    Total: {orderData.totalOrders}
                                </Chip>
                                <Chip size="sm" color="warning" variant="flat">
                                    Pending: {orderData.pendingOrders}
                                </Chip>
                                <Chip size="sm" color="secondary" variant="flat">
                                    In Progress: {orderData.inProgressOrders}
                                </Chip>
                                <Chip size="sm" color="success" variant="flat">
                                    Complete: {orderData.completedOrders}
                                </Chip>
                                <Chip size="sm" color="danger" variant="flat">
                                    Declined: {orderData.declinedOrders}
                                </Chip>
                            </>
                        ) : null}
                    </div>
                )}

                {isAdmin && (
                    <div className="flex items-center gap-3 w-[10%] justify-end">
                        {selectedCount > 0 && (
                            <Tooltip content="Delete Selected" delay={1} closeDelay={1}>
                                <Button
                                    color="danger"
                                    size="sm"
                                    variant="flat"
                                    isIconOnly
                                    onPress={() => {
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

                        <Tooltip content="Filter by Status" delay={1} closeDelay={1}>
                            <Button size="sm" color="primary" variant="flat">
                                <Dropdown>
                                    <DropdownTrigger>Status</DropdownTrigger>
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
                            </Button>
                        </Tooltip>

                        <Tooltip content="Show/Hide Columns" delay={1} closeDelay={1}>
                            <Button size="sm" color="primary" variant="flat">
                                <Dropdown>
                                    <DropdownTrigger>Columns</DropdownTrigger>
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
                            </Button>
                        </Tooltip>
                    </div>
                )}
            </div>

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

    const bottomContent = (
        <div className="py-2 px-2 flex justify-between items-center">
            <Pagination showControls page={page} total={totalPages} onChange={(newPage) => setPage(newPage)} />
            {isAdmin && (
                <span className="text-small text-default-400">
                    {selectionCount} of {totalOrdersCount} selected
                </span>
            )}
        </div>
    );

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
            {isAdmin && alert?.show && (
                <div className="fixed bottom-14 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm">
                    <Alert
                        color="success"
                        variant="solid"
                        title="새 주문이 도착했습니다!"
                        description={`주문자: ${alert.userLoginName}, 테이블번호: ${alert.tableNumber}, 주문번호: ${alert.orderNumber}, 총 금액: $${Number(
                            alert.totalPrice
                        ).toFixed(2)}`}
                        onClose={() => setAlert(null)}
                    />
                </div>
            )}

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
                                <Chip
                                    className="capitalize"
                                    color={statusColorMap[order.status as keyof typeof statusColorMap] || "default"}
                                    size="sm"
                                    variant="flat"
                                >
                                    {order.status}
                                </Chip>
                            </div>
                            <div className="mt-3 text-sm text-default-600">
                                <p>📅 {new Date(order.created_at).toLocaleString()}</p>
                                <div className="flex justify-between items-center mt-1">
                                    <p>📍 테이블 번호</p>
                                    <p>{order.table_number}</p>
                                </div>
                                <div className="flex flex-row justify-between items-center mt-1">
                                    <p className="mr-1">🔗 결제</p>
                                    <div className="flex flex-row">
                                        {order.payment_method === "zelle" && (
                                            <Image
                                                alt="Zelle icon"
                                                src="https://img.icons8.com/?size=100&id=Iirw95F6Nl9c&format=png&color=000000"
                                                width={20}
                                                radius="none"
                                            />
                                        )}
                                        {order.payment_method === "venmo" && (
                                            <Image
                                                alt="Venmo icon"
                                                src="https://img.icons8.com/?size=100&id=1gAt2ZCIcIrv&format=png&color=000000"
                                                width={20}
                                                radius="none"
                                            />
                                        )}
                                        <p className="ml-1">{order.payment_method ? `${order.payment_id}` : "--"}</p>
                                    </div>
                                </div>
                                {order.order.map((item) => (
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-sm">
                                            🍴 {item.itemName} ({item.quantity})
                                        </p>
                                        <p className="text-sm">${Number(item.price).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 space-y-2">
                                <div className="bg-content2 p-2 rounded-md flex justify-between items-center">
                                    <p className="font-bold">💰 총 금액</p>
                                    <p className="font-bold">${Number(order.total_price).toFixed(2)}</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

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
                    selectionMode={isAdmin ? "multiple" : "none"}
                    showSelectionCheckboxes={isAdmin}
                    sortDescriptor={sortDescriptor}
                    onSortChange={setSortDescriptor}
                    onSelectionChange={(newKeys) => {
                        if (!isAdmin) return;
                        if (newKeys === "all") {
                            setSelectedKeys(new Set(filteredByStatus.map((o) => o.id)));
                        } else {
                            setSelectedKeys(newKeys);
                        }
                    }}
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

            <EditOrderModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                order={selectedOrder}
                refreshOrders={fetchOrders}
                refreshAnalytics={refreshAnalytics}
            />

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
