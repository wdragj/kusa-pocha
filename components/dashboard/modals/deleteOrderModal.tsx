"use client";

import { useState } from "react";
import { Button, Modal, ModalFooter, ModalContent, ModalHeader } from "@heroui/react";

interface DeleteOrderModalProps {
    isOpen: boolean;
    onClose: () => void;

    /**
     * If deleting a single order, pass [order.id].
     * If deleting multiple orders, pass all their IDs.
     */
    orderIds?: string[];

    /**
     * Custom header text.
     * e.g. "주문을 삭제하시겠습니까?" or "3건의 주문을 삭제하시겠습니까?"
     */
    customMessage?: string;

    refreshOrders: () => void;
    refreshAnalytics: () => void;
}

export default function DeleteOrderModal({
    isOpen,
    onClose,
    orderIds, // array of IDs to delete
    customMessage, // custom text to display in modal header
    refreshOrders,
    refreshAnalytics,
}: DeleteOrderModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    // Determine which IDs to delete: single or multiple
    const finalIds = orderIds && orderIds.length > 0 ? orderIds : [];

    // If no IDs, the user can’t do anything.
    const disabled = finalIds.length === 0;

    // Provided customMessage or fallback.
    let headerText = customMessage || "주문을 삭제하시겠습니까?";

    const handleDeleteOrder = async () => {
        // No IDs or already loading => do nothing
        if (!finalIds.length) return;

        setIsLoading(true);

        try {
            // Bulk-style DELETE endpoint
            const response = await fetch(`/api/orders/delete`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderIds: finalIds }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete order(s)");
            }

            // Success, Refresh data
            refreshOrders();
            refreshAnalytics();
            onClose();
        } catch (error) {
            console.error("Error deleting order:", error);
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
                if (!isLoading && !open) {
                    onClose();
                }
            }}
        >
            <ModalContent>
                <ModalHeader>{headerText}</ModalHeader>

                <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose} isDisabled={isLoading}>
                        취소
                    </Button>

                    <Button
                        color="danger"
                        fullWidth
                        variant="shadow"
                        onPress={handleDeleteOrder}
                        isLoading={isLoading}
                        isDisabled={isLoading || disabled}
                    >
                        {isLoading ? "삭제 중..." : "삭제"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
