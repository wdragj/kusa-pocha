"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@heroui/react";

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
    const [alert, setAlert] = useState<{ type: "success" | "danger"; title: string; message: string } | null>(null);

    const isVenmoIdInvalid = useMemo(() => venmoId.trim() === "", [venmoId]);
    const isTableNumberInvalid = useMemo(() => tableNumber === 0, [tableNumber]);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setVenmoId("");
            setTableNumber(0);
            setAlert(null);
        }
    }, [isOpen]);

    const handlePurchase = async () => {
        if (isVenmoIdInvalid || isTableNumberInvalid) return;

        setIsLoading(true);
        setAlert(null); // Reset alert before making request

        try {
            await onPurchase(venmoId, tableNumber);
            setAlert({ type: "success", title: "Purchase Successful", message: "Your purchase was successful!" });
            onClose(); // Close modal after successful purchase
        } catch (error) {
            console.error("Error processing purchase:", error);
            setAlert({ type: "danger", title: "Purchase Failed", message: "An error occurred while processing your purchase." });
        } finally {
            setIsLoading(false);
            setTimeout(() => setAlert(null), 4000); // Hide alert after 4 seconds
        }
    };

    return (
        <>
            {/* Alert Notification - Positioned at the Bottom */}
            {alert && (
                <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm">
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
                    if (!isLoading) onClose(); // Allow closing only if not loading
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
                            label="테이블 번호"
                            placeholder="테이블 번호를 고르세요"
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
                            fullWidth
                            isDisabled={isLoading || isVenmoIdInvalid || isTableNumberInvalid}
                            isLoading={isLoading}
                            onPress={handlePurchase}
                        >
                            {isLoading ? "결제 중..." : `결제하기 ($${grandTotal.toFixed(2)})`}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default PurchaseModal;
