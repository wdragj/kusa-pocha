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
    tables: Table[];
}

const BuyNow: React.FC<BuyNowProps> = ({ buyNowModal, fetchItems, item, organizations, itemTypes, tables }) => {
    const { session } = useSession(); // ✅ Use global session
    const { isOpen, onClose } = buyNowModal;
    const [quantity, setQuantity] = useState<number>(1);
    const [venmoId, setVenmoId] = useState<string>("");
    const [tableNumber, setTableNumber] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState(0); // Initial final price

    const isVenmoIdInvalid = useMemo(() => venmoId === "", [venmoId]);
    const isTableNumberInvalid = useMemo(() => tableNumber === 0, [tableNumber]);

    useEffect(() => {
        // Calculate final price if item exists
        const price = (item?.price || 0) * quantity;
        setTotalPrice(Number(price.toFixed(2))); // Keep 2 decimal places
    }, [item, quantity]); // Dependency array

    // function to handle item purchase
    const handleBuyNow = async () => {
        if (!session) return; // Prevent order if no session

        // console.log({
        //     itemId: item.id,
        //     itemName: item.name,
        //     itemPrice: item.price,
        //     itemQuantity: quantity,
        //     itemType: item.type,
        //     organization: item.organization,
        //     venmoId,
        //     tableNumber,
        //     totalPrice,
        //     session,
        // });

        const order = [
            {
                itemId: item.id.toString(),
                itemName: item.name,
                quantity,
                price: item.price,
                type: item.type,
                organization: item.organization,
                totalPrice: (item.price * quantity).toFixed(2), // Keep 2 decimal places
            },
        ];

        const status = "pending";

        try {
            const response = await fetch(`/api/orders/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userLoginName: session.name,
                    userId: session.id,
                    userEmail: session.email,
                    userImage: session.image,
                    tableNumber,
                    venmoId,
                    order,
                    status,
                    totalPrice: totalPrice.toFixed(2), // Ensure 2 decimal places
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(
                    `Order inserted successfully. Order from ${data.user_login_name} at table ${data.table_number} with Venmo ID ${data.venmo_id}`
                );
                fetchItems(); // Refresh the item list
            }
        } catch (error) {
            console.error(`Failed to insert order:`, error);
        }
    };

    return (
        <Modal isOpen={isOpen} placement="center" size="xs" onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">결제하기</ModalHeader>
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
                    <Input
                        autoFocus
                        isClearable
                        isRequired
                        color={isVenmoIdInvalid ? "danger" : "success"}
                        description=""
                        errorMessage=""
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
                        label="Table number"
                        placeholder="Select a table number"
                        selectedKeys={tableNumber ? [tableNumber.toString()] : []}
                        onChange={(e) => setTableNumber(parseInt(e.target.value))}
                    >
                        {tables.map((table) => (
                            <SelectItem key={table.id} value={table.number.toString()} textValue={table.number.toString()}>
                                Table {table.number}
                            </SelectItem>
                        ))}
                    </Select>
                </ModalBody>
                <ModalFooter className="flex flex-row justify-center items-center">
                    <Button color="danger" variant="flat" onPress={onClose}>
                        취소
                    </Button>
                    <Button
                        color="primary"
                        isDisabled={isVenmoIdInvalid || isTableNumberInvalid}
                        fullWidth
                        variant="shadow"
                        onPress={async () => {
                            await handleBuyNow();
                            onClose();
                        }}
                    >
                        결제하기 ${totalPrice}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default BuyNow;
