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

    const isVenmoIdInvalid = useMemo(() => venmoId === "", [venmoId]);
    const isTableNumberInvalid = useMemo(() => tableNumber === 0, [tableNumber]);

    return (
        <Modal isOpen={isOpen} placement="center" size="xs" onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    결제하기
                </ModalHeader>
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
                        selectedKeys={[tableNumber.toString()]}
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
                        onPress={() => {
                            if (tableNumber !== 0) {
                                onPurchase(venmoId, tableNumber);
                            }
                        }}
                    >
                        결제하기 ${grandTotal.toFixed(2)}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default PurchaseModal;
