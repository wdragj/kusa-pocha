"use client";

import { use, useEffect, useMemo, useState } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@heroui/react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import { useSession } from "@/context/sessionContext";

interface OrderItem {
    itemId: number;
    itemName: string;
    quantity: number;
    price: number;
    type: string;
    organization: string;
}

interface MenuItem {
    id: number;
    name: string;
    price: number;
    type: string;
    organization: string;
}

interface EditOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: { id: string; order_number: number; table_number: number; venmo_id: string; order: OrderItem[] } | null;
    refreshOrders: () => void;
    refreshAnalytics: () => void;
}

export default function EditOrderModal({ isOpen, onClose, order, refreshOrders, refreshAnalytics }: EditOrderModalProps) {
    const { session } = useSession();
    const [tables, setTables] = useState<{ id: number; number: number }[]>([]);
    const [tableNumber, setTableNumber] = useState<number>(0);
    const [venmoId, setVenmoId] = useState<string>("");
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [selectedMenuItem, setSelectedMenuItem] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const isVenmoIdInvalid = useMemo(() => venmoId.trim() === "", [venmoId]);
    const isTableNumberInvalid = useMemo(() => tableNumber === 0, [tableNumber]);
    const isSaveDisabled = useMemo(
        () => isVenmoIdInvalid || isTableNumberInvalid || orderItems.length === 0,
        [isVenmoIdInvalid, isTableNumberInvalid, orderItems]
    );

    useEffect(() => {
        if (isOpen && order) {
            setTableNumber(order.table_number ? Number(order.table_number) : 0); // Ensure it's a number
            setVenmoId(order.venmo_id || "");
            setOrderItems(order.order || []);
        }
    }, [isOpen, order]);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await fetch("/api/tables");
                if (!response.ok) throw new Error("Failed to fetch tables");
                const result = await response.json();
                setTables(result);
            } catch (error) {
                console.error("Error fetching tables:", error);
            }
        };

        fetchTables();
    }, []);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await fetch(`/api/items`);
                if (!response.ok) throw new Error("Failed to fetch menu items");
                const result = await response.json();
                setMenuItems(result);
            } catch (error) {
                console.error("Error fetching menu items:", error);
            }
        };

        fetchMenuItems();
    }, []);

    const incrementQuantity = (itemId: number) => {
        setOrderItems((prevItems) => prevItems.map((item) => (item.itemId === itemId ? { ...item, quantity: item.quantity + 1 } : item)));
    };

    const decrementQuantity = (itemId: number) => {
        setOrderItems((prevItems) =>
            prevItems.map((item) => (item.itemId === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item))
        );
    };

    const removeItem = (itemId: number) => {
        const updatedItems = orderItems.filter((item) => item.itemId !== itemId);
        setOrderItems(updatedItems);
    };

    const addItemToOrder = () => {
        if (!selectedMenuItem) return;

        const menuItem = menuItems.find((item) => item.id.toString() === selectedMenuItem);
        if (menuItem) {
            setOrderItems((prevItems) => {
                const existingItemIndex = prevItems.findIndex((item) => item.itemId === menuItem.id);

                if (existingItemIndex !== -1) {
                    return prevItems.map((item, index) => (index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item));
                } else {
                    return [
                        ...prevItems,
                        {
                            itemId: menuItem.id,
                            itemName: menuItem.name,
                            quantity: 1,
                            price: menuItem.price,
                            type: menuItem.type,
                            organization: menuItem.organization,
                        },
                    ];
                }
            });

            setSelectedMenuItem("");
        }
    };

    const handleEditOrder = async () => {
        if (!order) return;

        setIsLoading(true);

        try {
            if (!session || !session.id) {
                throw new Error("User session not found. Please log in again.");
            }

            const response = await fetch(`/api/orders/edit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId: order.id,
                    userId: session.id,
                    tableNumber: Number(tableNumber),
                    venmoId: venmoId,
                    order: orderItems,
                    totalPrice: orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2),
                }),
            });

            if (!response.ok) throw new Error("Failed to update order");

            refreshOrders(); // Refresh orders list
            refreshAnalytics(); // Refresh profit analytics
            onClose();
        } catch (error) {
            console.error("Error updating order:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            placement="center"
            size="md"
            isDismissable={false}
            onOpenChange={(open) => {
                if (!isLoading) onClose();
            }}
        >
            <ModalContent>
                <ModalHeader>{order ? `${order.order_number}번 주문 수정` : "주문 수정"}</ModalHeader>
                <ModalBody>
                    <Select
                        isRequired
                        isInvalid={isTableNumberInvalid}
                        label="테이블 번호"
                        placeholder="테이블 번호를 고르세요"
                        selectedKeys={tableNumber ? [tableNumber.toString()] : []}
                        onChange={(e) => {
                            const selectedValue = e.target.value;
                            setTableNumber(selectedValue ? parseInt(selectedValue) : 0);
                        }}
                    >
                        {tables.map((table) => (
                            <SelectItem key={table.id} value={table.number.toString()} textValue={table.number.toString()}>
                                테이블 {table.number}
                            </SelectItem>
                        ))}
                    </Select>

                    <Input
                        autoFocus
                        isClearable
                        isRequired
                        color={isVenmoIdInvalid ? "danger" : "success"}
                        isInvalid={isVenmoIdInvalid}
                        label="Venmo Username"
                        placeholder="@yourVenmo"
                        type="text"
                        variant="bordered"
                        value={venmoId}
                        onValueChange={setVenmoId}
                        isDisabled={isLoading}
                    />

                    {/* Order Items List */}
                    {orderItems.map((item) => (
                        <div key={item.itemId} className="flex justify-between items-center bg-gray-100 p-2 rounded-md mb-1">
                            <div>
                                <p className="font-semibold text-sm text-left">
                                    🍴 {item.itemName} ({item.quantity})
                                </p>
                                <p className="text-sm text-gray-500 text-left">🏢 {item.organization}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    isIconOnly
                                    color="danger"
                                    radius="full"
                                    size="sm"
                                    variant="light"
                                    onPress={() => (item.quantity > 1 ? decrementQuantity(item.itemId) : removeItem(item.itemId))}
                                >
                                    {item.quantity > 1 ? <RemoveIcon fontSize="small" /> : <DeleteIcon fontSize="small" />}
                                </Button>
                                <span className="w-4 text-center text-sm font-semibold">{item.quantity}</span>
                                <Button
                                    isIconOnly
                                    color="success"
                                    radius="full"
                                    size="sm"
                                    variant="light"
                                    onPress={() => incrementQuantity(item.itemId)}
                                >
                                    <AddIcon fontSize="small" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {/* Add Item Dropdown */}
                    <div className="flex items-center gap-2">
                        <Select
                            label="메뉴 추가"
                            placeholder="메뉴를 선택하세요"
                            selectedKeys={[selectedMenuItem]}
                            onChange={(e) => setSelectedMenuItem(e.target.value)}
                        >
                            {menuItems.map((item) => (
                                <SelectItem key={item.id.toString()} value={item.id.toString()}>
                                    {item.name}
                                </SelectItem>
                            ))}
                        </Select>

                        <Button onPress={addItemToOrder} isDisabled={!selectedMenuItem}>
                            추가
                        </Button>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose} isDisabled={isLoading}>
                        취소
                    </Button>
                    <Button
                        color="primary"
                        fullWidth
                        variant="shadow"
                        onPress={handleEditOrder}
                        isLoading={isLoading}
                        isDisabled={isLoading || isSaveDisabled}
                    >
                        {orderItems.length === 0 ? "메뉴를 추가해 주세요." : isLoading ? "저장 중..." : "저장"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
