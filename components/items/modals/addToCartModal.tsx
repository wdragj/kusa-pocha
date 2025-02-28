"use client";

import React, { useEffect, useState } from "react";
import { Alert, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

interface SessionData {
    accessToken: string;
    id: string;
    name: string;
    email: string;
    image: string;
}

interface AddToCartProps {
    addToCartModal: {
        isOpen: boolean;
        onOpen: () => void;
        onClose: () => void;
    };
    fetchItems: () => void;
    item?: {
        created_at: string;
        id: number;
        img: string;
        name: string;
        organization: string;
        price: number;
        type: string;
    } | null;
    session: SessionData | null;
}

const AddToCart: React.FC<AddToCartProps> = ({ addToCartModal, fetchItems, item, session }) => {
    const { isOpen, onClose } = addToCartModal;
    const [quantity, setQuantity] = useState<number>(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState<{ type: "success" | "danger"; title: string; message: string } | null>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen && item) {
            setQuantity(1);
            setTotalPrice(item.price || 0); // Ensure item is defined
        }
    }, [isOpen, item]);

    // Recalculate total price when quantity changes
    useEffect(() => {
        if (item) {
            setTotalPrice(Number((item.price * quantity).toFixed(2)));
        }
    }, [quantity, item]);

    // // Function to handle adding item to cart
    // const handleAddToCart = async () => {
    //     if (!session || !item) return;

    //     setIsLoading(true); // Start loading
    //     setAlert(null); // Reset alert before making request

    //     const order = [
    //         {
    //             itemId: item.id,
    //             itemName: item.name,
    //             quantity: quantity,
    //             price: item.price,
    //             type: item.type,
    //             organization: item.organization,
    //             totalPrice: totalPrice,
    //         },
    //     ];

    //     try {
    //         const response = await fetch(`/api/cart/create`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 userLoginName: session?.name,
    //                 userId: session?.id,
    //                 userEmail: session?.email,
    //                 order: order,
    //             }),
    //         });

    //         if (!response.ok) {
    //             throw new Error("Failed to add item to cart");
    //         }

    //         setAlert({ type: "success", title: "Item Added to Cart", message: `${item.name} (x${quantity}) has been added to your cart.` });

    //         console.log(`Cart updated successfully for ${session.name}`);
    //         fetchItems(); // Refresh the items list
    //         onClose(); // Close the modal
    //     } catch (error) {
    //         console.error("Failed to update cart:", error);
    //         setAlert({ type: "danger", title: "Failed to Add to Cart", message: "There was an error adding this item. Please try again." });
    //     } finally {
    //         setIsLoading(false); // Stop loading
    //         setTimeout(() => setAlert(null), 4000); // Hide alert after 4 seconds
    //     }
    // };

    // Function to handle adding item to cart using localStorage
    const handleAddToCart = () => {
        if (!session || !item) return;

        setIsLoading(true);
        setAlert(null);

        // Get the current cart from localStorage
        const storedCart = localStorage.getItem("cartItems");
        const currentCart = storedCart ? JSON.parse(storedCart) : [];

        // Create new item entry
        const newItem = {
            itemId: item.id.toString(),
            itemName: item.name,
            quantity: quantity,
            price: item.price,
            type: item.type,
            organization: item.organization,
            totalPrice: totalPrice,
        };

        // Check if the item already exists in the cart
        const existingIndex = currentCart.findIndex((cartItem: any) => cartItem.itemId === newItem.itemId);
        let updatedCart;
        if (existingIndex > -1) {
            // If it exists, update the quantity and totalPrice
            updatedCart = currentCart.map((cartItem: any, index: number) => {
                if (index === existingIndex) {
                    const newQuantity = cartItem.quantity + quantity;
                    return {
                        ...cartItem,
                        quantity: newQuantity,
                        totalPrice: newQuantity * cartItem.price,
                    };
                }
                return cartItem;
            });
        } else {
            updatedCart = [...currentCart, newItem];
        }

        // Save updated cart to localStorage
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));

        setAlert({ type: "success", title: "Item Added to Cart", message: `${item.name} (x${quantity}) has been added to your cart.` });
        fetchItems();
        onClose();
        setIsLoading(false);
        setTimeout(() => setAlert(null), 4000);
    };

    return (
        <>
            {/* Alert Notification - Positioned at the Bottom */}
            {alert && (
                <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm">
                    <Alert color={alert.type} variant="solid" title={alert.title} description={alert.message} onClose={() => setAlert(null)} />
                </div>
            )}
            <Modal
                isOpen={isOpen}
                placement="center"
                size="xs"
                isDismissable={false}
                onOpenChange={(open) => {
                    if (!isLoading) onClose(); // Only allow closing if not loading
                }}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">장바구니 담기</ModalHeader>
                    <ModalBody>
                        {!item ? (
                            <p className="text-red-500 font-semibold text-center">Error: No item selected</p>
                        ) : (
                            <div className="flex flex-row justify-between items-center">
                                <div className="text-base font-semibold">{item.name}</div>
                                <div className="flex flex-row gap-2 border rounded-lg overflow-hidden items-center justify-center">
                                    <Button
                                        isIconOnly
                                        isDisabled={quantity === 1 || isLoading}
                                        onPress={() => setQuantity(quantity - 1)}
                                        size="sm"
                                        radius="none"
                                    >
                                        <RemoveIcon style={{ fontSize: "14px" }} />
                                    </Button>
                                    <div className="w-4 text-center text-base font-semibold">{quantity}</div>
                                    <Button
                                        isIconOnly
                                        isDisabled={quantity >= 30 || isLoading}
                                        onPress={() => {
                                            if (quantity < 30) {
                                                setQuantity(quantity + 1);
                                            }
                                        }}
                                        size="sm"
                                        radius="none"
                                    >
                                        <AddIcon style={{ fontSize: "14px" }} />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter className="flex flex-row justify-center gap-4 w-full">
                        <Button color="danger" variant="flat" isDisabled={isLoading} onPress={onClose}>
                            취소
                        </Button>
                        <Button
                            color="primary"
                            variant="shadow"
                            isLoading={isLoading} // Show loading state
                            isDisabled={isLoading || !item}
                            fullWidth
                            className="flex-grow"
                            onPress={handleAddToCart}
                        >
                            {isLoading ? "담는중..." : `담기 ($${totalPrice})`}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default AddToCart;
