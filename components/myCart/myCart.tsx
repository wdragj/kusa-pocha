"use client";

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, RadioGroup, Radio, Button } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import PurchaseModal from "./purchaseModal";

import { createClient } from "@/utils/supabase/client";

interface SessionData {
    accessToken: string;
    id: string;
    name: string;
    email: string;
    image: string;
}

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
    const supabase = createClient();

    const [session, setSession] = useState<SessionData | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]); // State for fetched data
    const [grandTotal, setGrandTotal] = useState(0); // Total price of all items
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false); // Modal state
    const [venmoId, setVenmoId] = useState("");
    const [tableNumber, setTableNumber] = useState<number | null>(null);
    const [tables, setTables] = useState<TableOption[]>([]); // Fetch tables dynamically

    // Fetch session and set it
    const fetchSession = async () => {
        const { data } = await supabase.auth.getSession();

        if (data.session) {
            setSession({
                accessToken: data.session.access_token,
                id: data.session.user.id,
                name: data.session.user.user_metadata.full_name,
                email: data.session.user.user_metadata.email,
                image: data.session.user.user_metadata.avatar_url,
            });
        }
    };

    // Fetch tables
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

    // Fetch cart items
    const fetchMyCart = async () => {
        try {
            const response = await fetch(`/api/cart?userId=${session?.id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch cart");
            }

            const result = await response.json();
            console.log("Fetched cart items:", result);

            setCartItems(result); // No need to combine, backend already does it
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    // Ensure fetchMyCart runs only after fetchSession completes
    useEffect(() => {
        const fetchData = async () => {
            await fetchSession(); // Wait for session to be fetched
        };

        fetchData();
    }, []); // Run only once on mount

    useEffect(() => {
        if (session?.id) {
            fetchMyCart(); // Fetch cart only after session is set
        }
    }, [session]); // Runs whenever session changes

    // Recalculate the grand total whenever cartItems change
    useEffect(() => {
        const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
        setGrandTotal(total);
    }, [cartItems]);

    // Update entire cart in database
    const updateEntireCart = async (updatedCart: CartItem[]) => {
        if (!session?.id) return;

        try {
            const response = await fetch("/api/cart/edit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: session.id,
                    updatedCart,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update cart in database");
            }

            console.log("Entire cart updated successfully");
        } catch (error) {
            console.error("Error updating entire cart:", error);
        }
    };

    // Handle item removal
    const removeItem = (itemId: string) => {
        const updatedItems = cartItems.filter((item) => item.itemId !== itemId); // Remove item

        setCartItems(updatedItems);
        updateEntireCart(updatedItems);
    };

    // Handle quantity increment
    const incrementQuantity = (itemId: string) => {
        const updatedItems = cartItems.map((item) =>
            item.itemId === itemId
                ? {
                      ...item,
                      quantity: item.quantity + 1,
                      totalPrice: (item.quantity + 1) * item.price,
                  }
                : item
        );

        setCartItems(updatedItems);
        updateEntireCart(updatedItems);
    };

    // Handle quantity decrement
    const decrementQuantity = (itemId: string) => {
        const updatedItems = cartItems.map((item) =>
            item.itemId === itemId && item.quantity > 1
                ? {
                      ...item,
                      quantity: item.quantity - 1,
                      totalPrice: (item.quantity - 1) * item.price,
                  }
                : item
        );

        setCartItems(updatedItems);
        updateEntireCart(updatedItems);
    };

    const handlePurchase = async (venmoId: string, tableNumber: number) => {
        if (!session?.id) return;

        const order = cartItems.map((item) => ({
            itemId: item.itemId.toString(),
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
        <>
            <Table aria-label="Dynamic Cart Table" color="primary">
                <TableHeader>
                    <TableColumn className="text-center">ITEM</TableColumn>
                    <TableColumn className="text-center">QUANTITY</TableColumn>
                    <TableColumn className="text-center">PRICE</TableColumn>
                    <TableColumn className="text-center">TOTAL</TableColumn>
                </TableHeader>
                <TableBody>
                    {cartItems.map((item) => (
                        <TableRow key={item.itemId}>
                            <TableCell>
                                <div className="text-center">{item.itemName}</div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-row gap-1 overflow-hidden items-center justify-center">
                                    <Button
                                        isIconOnly
                                        color="danger"
                                        radius="full"
                                        size="sm"
                                        variant="light"
                                        onPress={() => {
                                            if (item.quantity > 1) {
                                                decrementQuantity(item.itemId);
                                            } else {
                                                removeItem(item.itemId);
                                            }
                                        }}
                                    >
                                        {item.quantity > 1 ? <RemoveIcon fontSize="small" /> : <DeleteIcon fontSize="small" />}
                                    </Button>
                                    <div className="w-4 text-center text-sm font-semibold">{item.quantity}</div>
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
                            <TableCell>
                                <div className="text-center">${item.price.toFixed(2)}</div>
                            </TableCell>
                            <TableCell>
                                <div className="text-center">${item.totalPrice.toFixed(2)}</div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button className="w-[70%]" color="primary" variant="shadow" onPress={() => setIsPurchaseModalOpen(true)}>
                Total: ${grandTotal.toFixed(2)}
            </Button>
            <PurchaseModal
                isOpen={isPurchaseModalOpen}
                onClose={() => setIsPurchaseModalOpen(false)}
                onPurchase={handlePurchase}
                grandTotal={grandTotal}
                tables={tables}
            />
        </>
    );
}
