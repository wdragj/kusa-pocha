"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import { useSession } from "@/context/sessionContext";

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

interface Table {
    id: number;
    number: number;
    created_at: string;
}

interface BuyNowProps {
    buyNowModal: {
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
    organizations: Organization[];
    itemTypes: ItemType[];
    tables: Table[];
}

const BuyNow: React.FC<BuyNowProps> = ({ buyNowModal, fetchItems, item, tables }) => {
    const { session } = useSession();
    const { isOpen, onClose } = buyNowModal;
    const [quantity, setQuantity] = useState<number>(1);
    const [venmoId, setVenmoId] = useState<string>("");
    const [tableNumber, setTableNumber] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const isVenmoIdInvalid = useMemo(() => venmoId.trim() === "", [venmoId]);
    const isTableNumberInvalid = useMemo(() => tableNumber === 0, [tableNumber]);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen && item) {
            setQuantity(1);
            setVenmoId("");
            setTableNumber(0);
            setTotalPrice(item.price || 0);
        }
    }, [isOpen, item]);

    // Keep total price correct when quantity or item changes
    useEffect(() => {
        if (item) {
            setTotalPrice(Number((item.price * quantity).toFixed(2)));
        }
    }, [item, quantity]);

    // Function to handle item purchase
    const handleBuyNow = async () => {
        if (!session || !item) return;

        setIsLoading(true); // Start loading

        const order = [
            {
                itemId: item.id.toString(),
                itemName: item.name,
                quantity,
                price: item.price,
                type: item.type,
                organization: item.organization,
                totalPrice: (item.price * quantity).toFixed(2),
            },
        ];

        const status = "pending";

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
                    status,
                    totalPrice: totalPrice.toFixed(2),
                }),
            });

            if (!response.ok) throw new Error("Failed to insert order");

            console.log(`Order placed successfully for ${session.name}`);
            fetchItems(); // Refresh item list
            onClose();
        } catch (error) {
            console.error("Error inserting order:", error);
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
                if (!isLoading) onClose(); // Allow closing only if not loading
            }}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">결제하기</ModalHeader>
                <ModalBody>
                    {!item ? (
                        <p className="text-red-500 font-semibold text-center">Error: No item selected</p>
                    ) : (
                        <>
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
                                onValueChange={setVenmoId}
                            />
                            <Select
                                isRequired
                                className="max-w-xs"
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
                        </>
                    )}
                </ModalBody>
                <ModalFooter className="flex flex-row justify-center items-center">
                    <Button color="danger" variant="flat" isDisabled={isLoading} onPress={onClose}>
                        취소
                    </Button>
                    <Button
                        color="primary"
                        isDisabled={isLoading || isVenmoIdInvalid || isTableNumberInvalid}
                        fullWidth
                        variant="shadow"
                        isLoading={isLoading} // Show loading state
                        onPress={handleBuyNow}
                    >
                        {isLoading ? "결제 중..." : `결제하기 $${totalPrice}`}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default BuyNow;
