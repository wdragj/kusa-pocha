"use client";

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, RadioGroup, Radio, Button } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

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

export default function MyCart() {
    const supabase = createClient();

    const [session, setSession] = useState<SessionData | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]); // State for fetched data
    const [grandTotal, setGrandTotal] = useState(0); // Total price of all items

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

    const combineCartItems = (cartItems: CartItem[]): CartItem[] => {
        return cartItems.reduce((acc: CartItem[], item: CartItem) => {
            const existingItem = acc.find((i) => i.itemId === item.itemId);

            if (existingItem) {
                // If the item already exists, update its quantity and totalPrice
                existingItem.quantity += item.quantity;
                existingItem.totalPrice += item.totalPrice;
            } else {
                // Add the item to the accumulator if it doesn't exist
                acc.push({ ...item });
            }

            return acc;
        }, []);
    };

    // Fetch cart items
    const fetchMyCart = async () => {
        try {
            const response = await fetch(`/api/cart?userId=${session?.id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch cart");
            }

            const result = await response.json();
            console.log("Original cart items:", result);

            // Combine cart items with the same itemId
            const combinedItems = combineCartItems(result);

            console.log("Combined cart items:", combinedItems);

            setCartItems(combinedItems);
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

    // Handle quantity increment
    const incrementQuantity = (itemId: string) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.itemId === itemId
                    ? {
                          ...item,
                          quantity: item.quantity + 1,
                          totalPrice: (item.quantity + 1) * item.price,
                      }
                    : item
            )
        );
    };

    // Handle quantity decrement
    const decrementQuantity = (itemId: string) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.itemId === itemId && item.quantity > 1
                    ? {
                          ...item,
                          quantity: item.quantity - 1,
                          totalPrice: (item.quantity - 1) * item.price,
                      }
                    : item
            )
        );
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
                                        onPress={() => decrementQuantity(item.itemId)}
                                    >
                                        <RemoveIcon fontSize="small" />
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
            <Button className="w-[70%]" color="primary" variant="shadow">
                Total: ${grandTotal.toFixed(2)}
            </Button>
        </>
    );
}
