"use client";

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import PurchaseModal from "./purchaseModal";
import { useSession } from "@/context/sessionContext";

interface CartItem {
    itemId: string;
    itemName: string;
    quantity: number;
    price: number;
    type: string;
    organization: string;
    totalPrice: number;
}

interface TableOption {
    id: number;
    number: number;
}

export default function MyCart() {
    const { session } = useSession();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [grandTotal, setGrandTotal] = useState(0);
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [tables, setTables] = useState<TableOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!session?.id) {
            setIsLoading(false);
            return;
        }

        const fetchMyCart = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/cart?userId=${session.id}`);
                if (!response.ok) throw new Error("Failed to fetch cart");
                const result = await response.json();
                setCartItems(result);
            } catch (error) {
                console.error("Error fetching cart:", error);
                setCartItems([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyCart();
    }, [session]);

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
        setGrandTotal(cartItems.reduce((sum, item) => sum + item.totalPrice, 0));
    }, [cartItems]);

    const updateEntireCart = async (updatedCart: CartItem[]) => {
        if (!session?.id) return;

        try {
            await fetch("/api/cart/edit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: session.id, updatedCart }),
            });
            console.log("Cart updated successfully");
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    const removeItem = (itemId: string) => {
        const updatedItems = cartItems.filter((item) => item.itemId !== itemId);
        setCartItems(updatedItems);
        updateEntireCart(updatedItems);
    };

    const incrementQuantity = (itemId: string) => {
        const updatedItems = cartItems.map((item) =>
            item.itemId === itemId ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.price } : item
        );
        setCartItems(updatedItems);
        updateEntireCart(updatedItems);
    };

    const decrementQuantity = (itemId: string) => {
        const updatedItems = cartItems.map((item) =>
            item.itemId === itemId && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1, totalPrice: (item.quantity - 1) * item.price }
                : item
        );
        setCartItems(updatedItems);
        updateEntireCart(updatedItems);
    };

    const handlePurchase = async (venmoId: string, tableNumber: number) => {
        if (!session?.id) return;

        const order = cartItems.map((item) => ({
            itemId: item.itemId,
            itemName: item.itemName,
            quantity: item.quantity,
            price: item.price,
            type: item.type,
            organization: item.organization,
            totalPrice: item.totalPrice.toFixed(2),
        }));

        try {
            const response = await fetch(`/api/orders/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userLoginName: session.name,
                    userId: session.id,
                    userEmail: session.email,
                    userImage: session.image,
                    tableNumber,
                    venmoId,
                    order,
                    status: "pending",
                    totalPrice: grandTotal.toFixed(2),
                }),
            });

            if (!response.ok) throw new Error("Failed to place order");

            console.log("Order placed successfully");
            setCartItems([]);
            updateEntireCart([]);
            setIsPurchaseModalOpen(false);
        } catch (error) {
            console.error("Error placing order:", error);
        }
    };

    return (
        <div className="flex flex-col items-center w-full px-4">
            {isLoading ? (
                <p className="text-lg font-semibold text-gray-500 mt-10">장바구니를 불러오는 중...</p>
            ) : cartItems.length === 0 ? (
                <p className="text-lg font-semibold text-gray-500 mt-10">장바구니가 비었습니다.</p>
            ) : (
                <>
                    {/* Scrollable Table for Mobile */}
                    <div className="w-full overflow-x-auto">
                        <Table aria-label="Cart Table" className="min-w-full">
                            <TableHeader>
                                <TableColumn className="text-center">ITEM</TableColumn>
                                <TableColumn className="text-center">QUANTITY</TableColumn>
                                <TableColumn className="text-center">PRICE</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {cartItems.map((item) => (
                                    <TableRow key={item.itemId}>
                                        <TableCell>
                                            <div className="text-center">{item.itemName}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-row gap-2 items-center justify-center">
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
                                                <span className="w-2 text-center text-sm font-semibold">{item.quantity}</span>
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
                                        </TableCell>
                                        <TableCell className="text-center">${item.totalPrice.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Purchase Button */}
                    <Button className="w-full max-w-sm mt-4" color="primary" variant="shadow" onPress={() => setIsPurchaseModalOpen(true)}>
                        Total: ${grandTotal.toFixed(2)}
                    </Button>
                </>
            )}

            <PurchaseModal
                isOpen={isPurchaseModalOpen}
                onClose={() => setIsPurchaseModalOpen(false)}
                onPurchase={handlePurchase}
                grandTotal={grandTotal}
                tables={tables}
            />
        </div>
    );
}
