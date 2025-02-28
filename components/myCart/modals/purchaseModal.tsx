"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, RadioGroup, Radio } from "@heroui/react";

interface PurchaseModalProps {
    purchaseModal: {
        isOpen: boolean;
        onOpen: () => void;
        onClose: () => void;
    };
    onPurchase: (paymentMethod: string, paymentId: string, tableNumber: number) => Promise<void>;
    grandTotal: number;
    tables: { id: number; number: number }[];
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ purchaseModal, onPurchase, grandTotal, tables }) => {
    const { isOpen, onClose } = purchaseModal;
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [paymentId, setPaymentId] = useState<string>("");
    const [tableNumber, setTableNumber] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isPaymentMethodInvalid = useMemo(() => paymentMethod === "", [paymentMethod]);
    const isPaymentIdInvalid = useMemo(() => paymentId.trim() === "", [paymentId]);
    const isTableNumberInvalid = useMemo(() => tableNumber === 0, [tableNumber]);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setPaymentMethod("");
            setPaymentId("");
            setTableNumber(0);
        }
    }, [isOpen]);

    const handlePurchase = async () => {
        if (isPaymentMethodInvalid || isPaymentIdInvalid || isTableNumberInvalid) return;
        setIsLoading(true);
        try {
            await onPurchase(paymentMethod, paymentId, tableNumber);
            onClose();
        } catch (error) {
            console.error("Error processing purchase:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
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
                <ModalHeader className="flex flex-col gap-1 text-center">결제하기</ModalHeader>
                <ModalBody>
                    {/* Payment Method Selection using RadioGroup */}
                    <RadioGroup
                        label="결제 수단"
                        orientation="horizontal"
                        value={paymentMethod}
                        onValueChange={(val: string) => {
                            setPaymentMethod(val);
                            setPaymentId(""); // Reset payment ID on method change
                        }}
                        isRequired
                        className="flex flex-row gap-4 mt-4"
                    >
                        <Radio value="venmo">Venmo</Radio>
                        <Radio value="zelle">Zelle</Radio>
                    </RadioGroup>

                    {/* Payment ID Input */}
                    <Input
                        autoFocus
                        isClearable
                        isRequired
                        color={isPaymentIdInvalid ? "danger" : "success"}
                        isInvalid={isPaymentIdInvalid}
                        label={paymentMethod === "venmo" ? "Venmo ID" : paymentMethod === "zelle" ? "Zelle Email or Number" : "결제 정보"}
                        placeholder={
                            paymentMethod === "venmo" ? "@yourVenmo" : paymentMethod === "zelle" ? "your.zelle@example.com" : "결제 수단을 선택하세요"
                        }
                        type="text"
                        variant="bordered"
                        value={paymentId}
                        onValueChange={setPaymentId}
                        disabled={paymentMethod === "" || isLoading}
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
                                Table {table.number}
                            </SelectItem>
                        ))}
                    </Select>
                </ModalBody>
                <ModalFooter className="flex flex-row justify-center gap-4 w-full">
                    <Button color="danger" variant="flat" isDisabled={isLoading} onPress={onClose}>
                        취소
                    </Button>
                    <Button
                        color="primary"
                        variant="shadow"
                        fullWidth
                        isDisabled={isLoading || isPaymentMethodInvalid || isPaymentIdInvalid || isTableNumberInvalid}
                        isLoading={isLoading}
                        onPress={handlePurchase}
                    >
                        {isLoading ? "결제 중..." : `결제하기 ($${grandTotal.toFixed(2)})`}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default PurchaseModal;
