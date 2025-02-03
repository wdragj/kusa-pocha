"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

interface SessionData {
    accessToken: string;
    id: string;
    name: string;
    email: string;
    image: string;
}

interface Organization {
    id: number;
    name: string;
    created_at: string;
}

interface ItemType {
    id: number;
    name: string;
    created_at: string;
}

interface AddToCartProps {
    addToCartModal: {
        isOpen: boolean;
        onOpen: () => void;
        onClose: () => void;
    };
    fetchItems: () => void;
    item: {
        created_at: string;
        id: number;
        img: string;
        name: string;
        organization: string;
        price: number;
        type: string;
    };
    organizations: Organization[];
    itemTypes: ItemType[];
    session: SessionData | null;
}

const AddToCart: React.FC<AddToCartProps> = ({ addToCartModal, fetchItems, item, organizations, itemTypes, session }) => {
    const { isOpen, onClose } = addToCartModal;
    const [quantity, setQuantity] = useState<number>(1);
    const [totalPrice, setTotalPrice] = useState(0); // Initial final price

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setQuantity(1);
            setTotalPrice(0);
        }
    }, [isOpen]);

    // Recalculate total price when quantity or item changes
    useEffect(() => {
        const price = (item?.price || 0) * quantity;
        setTotalPrice(Number(price.toFixed(2)));
    }, [item, quantity]);

    // function to handle item edit
    const handleAddToCart = async () => {
        console.log({
            itemId: item.id,
            itemName: item.name,
            itemPrice: item.price,
            itemQuantity: quantity,
            itemType: item.type,
            organization: item.organization,
            totalPrice: item.price * quantity,
            session: session,
        });

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

            if (response.ok) {
                console.log(`Cart updated successfully from ${session?.name} with id ${session?.id} and email ${session?.email}.`);
                fetchItems(); // Fetch items again to update the list
            }
        } catch (error) {
            console.error(`Failed to update cart:`, error);
        }
    };

    return (
        <Modal isOpen={isOpen} placement="center" size="xs" onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">장바구니 담기</ModalHeader>
                <ModalBody>
                    <div className="flex flex-row justify-between items-center">
                        <div className="text-base font-semibold">{item ? item.name : ""}</div>
                        <div className="flex flex-row gap-2 border rounded-lg overflow-hidden items-center justify-center">
                            <Button isIconOnly isDisabled={quantity === 1} onPress={() => setQuantity(quantity - 1)} size="sm" radius="none">
                                <RemoveIcon style={{ fontSize: "14px" }} />
                            </Button>
                            <div className="w-4 text-center text-sm font-semibold">{quantity}</div>
                            <Button isIconOnly onPress={() => setQuantity(quantity + 1)} size="sm" radius="none">
                                <AddIcon style={{ fontSize: "14px" }} />
                            </Button>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className="flex flex-row justify-center items-center">
                    <Button
                        color="primary"
                        fullWidth
                        variant="shadow"
                        onPress={async () => {
                            await handleAddToCart();
                            onClose();
                        }}
                    >
                        {`$${totalPrice}`}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddToCart;
