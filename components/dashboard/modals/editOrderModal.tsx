"use client";

import { useEffect, useState } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";

interface EditOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: { id: string; table_number: number; venmo_id: string } | null;
    refreshOrders: () => void;
}

export default function EditOrderModal({ isOpen, onClose, order, refreshOrders }: EditOrderModalProps) {
    const [tableNumber, setTableNumber] = useState<string>("");
    const [venmoId, setVenmoId] = useState<string>("");

    useEffect(() => {
        if (isOpen && order) {
            setTableNumber(order.table_number.toString());
            setVenmoId(order.venmo_id);
        }
    }, [isOpen, order]);

    const handleEditOrder = async () => {
        if (!order) return;

        try {
            const response = await fetch(`/api/orders/edit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId: order.id,
                    table_number: Number(tableNumber),
                    venmo_id: venmoId,
                }),
            });

            if (!response.ok) throw new Error("Failed to update order");

            refreshOrders();
            onClose();
        } catch (error) {
            console.error("Error updating order:", error);
        }
    };

    return (
        <Modal isOpen={isOpen} placement="center" size="xs" onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader>Edit Order</ModalHeader>
                <ModalBody>
                    <Input label="Table Number" value={tableNumber} onValueChange={setTableNumber} />
                    <Input label="Venmo ID" value={venmoId} onValueChange={setVenmoId} />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Cancel
                    </Button>
                    <Button color="primary" onPress={handleEditOrder}>
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
