"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, RadioGroup, Radio } from "@heroui/react";
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
    // Instead of a plain input for payment ID, we now use two states: one for payment method and one for payment ID.
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [paymentId, setPaymentId] = useState<string>("");
    const [tableNumber, setTableNumber] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState<{ type: "success" | "danger"; title: string; message: string } | null>(null);

    const isPaymentMethodInvalid = useMemo(() => paymentMethod === "", [paymentMethod]);
    const isPaymentIdInvalid = useMemo(() => paymentId.trim() === "", [paymentId]);
    const isTableNumberInvalid = useMemo(() => tableNumber === 0, [tableNumber]);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen && item) {
            setQuantity(1);
            setPaymentMethod("");
            setPaymentId("");
            setTableNumber(0);
            setTotalPrice(item.price || 0);
            setAlert(null);
        }
    }, [isOpen, item]);

    // Update total price when quantity or item changes
    useEffect(() => {
        if (item) {
            setTotalPrice(Number((item.price * quantity).toFixed(2)));
        }
    }, [item, quantity]);

    // Function to handle order submission
    const handleBuyNow = async () => {
        if (!session || !item) return;
        if (isPaymentMethodInvalid || isPaymentIdInvalid || isTableNumberInvalid) return;

        setIsLoading(true);
        setAlert(null);

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
                    // Send the selected payment method and payment ID
                    paymentMethod,
                    paymentId,
                    order,
                    status,
                    totalPrice: totalPrice.toFixed(2),
                }),
            });

            if (!response.ok) throw new Error("Failed to insert order");

            setAlert({
                type: "success",
                title: "Order Placed Successfully",
                message: `Your order for ${item.name} has been placed at table ${tableNumber}.`,
            });

            console.log(`Order placed successfully for ${session.name}`);
            fetchItems();
            onClose();
        } catch (error) {
            console.error("Error inserting order:", error);
            setAlert({
                type: "danger",
                title: "Order Failed",
                message: "There was an error processing your order. Please try again.",
            });
        } finally {
            setIsLoading(false);
            setTimeout(() => setAlert(null), 4000);
        }
    };

    return (
        <>
            {/* Alert Notification */}
            {alert && (
                <div className="fixed bottom-14 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm">
                    <Alert
                        color={alert.type === "success" ? "success" : "danger"}
                        variant="solid"
                        title={alert.title}
                        description={alert.message}
                        onClose={() => setAlert(null)}
                    />
                </div>
            )}

            <Modal
                isOpen={isOpen}
                placement="center"
                size="xs"
                isDismissable={false}
                onOpenChange={(open) => {
                    if (!isLoading) onClose();
                }}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">결제하기</ModalHeader>
                    <ModalBody>
                        {!item ? (
                            <p className="text-red-500 font-semibold text-center">Error: No item selected</p>
                        ) : (
                            <>
                                {/* Item name and quantity controls */}
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

                                {/* Payment Method Selection using RadioGroup */}
                                <RadioGroup
                                    orientation="horizontal"
                                    value={paymentMethod}
                                    onValueChange={(val: string) => {
                                        setPaymentMethod(val);
                                        setPaymentId(""); // reset the input
                                    }}
                                    isRequired
                                >
                                    <Radio value="venmo">Venmo</Radio>
                                    <Radio value="zelle">Zelle</Radio>
                                </RadioGroup>

                                {/* Payment ID Input */}
                                <Input
                                    value={paymentId}
                                    autoFocus
                                    isClearable
                                    isRequired
                                    color={isPaymentIdInvalid ? "danger" : "success"}
                                    isInvalid={isPaymentIdInvalid}
                                    label={
                                        paymentMethod === "venmo"
                                            ? "Venmo ID"
                                            : paymentMethod === "zelle"
                                              ? "Zelle Email or Number"
                                              : "Venmo or Zelle"
                                    }
                                    placeholder={
                                        paymentMethod === "venmo"
                                            ? "@yourVenmo"
                                            : paymentMethod === "zelle"
                                              ? "your.zelle"
                                              : "Select a payment method first"
                                    }
                                    type="text"
                                    variant="bordered"
                                    onValueChange={setPaymentId}
                                    disabled={isPaymentMethodInvalid || isLoading}
                                />

                                {/* Table Number Selection */}
                                <Select
                                    isRequired
                                    className="max-w-xs mt-4"
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
                            variant="shadow"
                            fullWidth
                            isDisabled={isLoading || isPaymentMethodInvalid || isPaymentIdInvalid || isTableNumberInvalid}
                            isLoading={isLoading}
                            onPress={handleBuyNow}
                        >
                            {isLoading ? "결제 중..." : `결제하기 $${totalPrice}`}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default BuyNow;
