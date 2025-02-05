"use client";

import React, { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
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

    // Function to handle adding item to cart
    const handleAddToCart = async () => {
        if (!session || !item) return;

        setIsLoading(true); // Start loading
        const order = [
            {
                itemId: item.id,
                itemName: item.name,
                quantity: quantity,
                price: item.price,
                type: item.type,
                organization: item.organization,
                totalPrice: totalPrice,
            },
        ];

        try {
            const response = await fetch(`/api/cart/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userLoginName: session?.name,
                    userId: session?.id,
                    userEmail: session?.email,
                    order: order,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add item to cart");
            }

            console.log(`Cart updated successfully for ${session.name}`);
            await fetchItems(); // Refresh the items list
            onClose(); // Close the modal
        } catch (error) {
            console.error("Failed to update cart:", error);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
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
                                <div className="w-4 text-center text-sm font-semibold">{quantity}</div>
                                <Button isIconOnly isDisabled={isLoading} onPress={() => setQuantity(quantity + 1)} size="sm" radius="none">
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
    );
};

export default AddToCart;
