"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";

interface PurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPurchase: (venmoId: string, tableNumber: number) => void;
    grandTotal: number;
    tables: { id: number; number: number }[];
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, onClose, onPurchase, grandTotal, tables }) => {
    const [venmoId, setVenmoId] = useState<string>("");
    const [tableNumber, setTableNumber] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isVenmoIdInvalid = useMemo(() => venmoId.trim() === "", [venmoId]);
    const isTableNumberInvalid = useMemo(() => tableNumber === 0, [tableNumber]);

    const handlePurchase = async () => {
        if (isVenmoIdInvalid || isTableNumberInvalid) return;

        setIsLoading(true);
        try {
            await onPurchase(venmoId, tableNumber);
            onClose(); // Close modal after successful purchase
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
            isDismissable={!isLoading} // Prevent closing while processing
            onOpenChange={(open) => {
                if (!open) {
                    setVenmoId(""); // Reset Venmo ID
                    setTableNumber(0); // Reset Table Number
                    onClose(); // Close the modal
                }
            }}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1 text-center">결제하기</ModalHeader>
                <ModalBody>
                    <Input
                        autoFocus
                        isClearable
                        isRequired
                        color={isVenmoIdInvalid ? "danger" : "success"}
                        label="Venmo Username"
                        placeholder="@yourVenmo"
                        value={venmoId}
                        onValueChange={setVenmoId}
                        variant="bordered"
                    />
                    <Select
                        isRequired
                        className="max-w-xs"
                        isInvalid={isTableNumberInvalid}
                        label="Table Number"
                        placeholder="Select a table number"
                        selectedKeys={tableNumber ? [tableNumber.toString()] : []}
                        onChange={(e) => {
                            const selectedValue = e.target.value;
                            setTableNumber(selectedValue ? parseInt(selectedValue) : 0); // Reset to 0 when deselected
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
                        isLoading={isLoading}
                        isDisabled={isLoading || isVenmoIdInvalid || isTableNumberInvalid}
                        fullWidth
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
