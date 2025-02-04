"use client";

import { useState } from "react";
import { Button, Modal, ModalFooter, ModalContent, ModalHeader } from "@nextui-org/react";

import { useSession } from "@/context/sessionContext";

interface DeleteOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string | null;
    refreshOrders: () => void;
}

export default function DeleteOrderModal({ isOpen, onClose, orderId, refreshOrders }: DeleteOrderModalProps) {
    const { session } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteOrder = async () => {
        if (!orderId || !session?.id) return;

        setIsLoading(true); // Start loading state

        try {
            const response = await fetch(`/api/orders/delete`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, userId: session.id }),
            });

            if (!response.ok) throw new Error("Failed to delete order");

            refreshOrders();
            onClose();
        } catch (error) {
            console.error("Error deleting order:", error);
        } finally {
            setIsLoading(false); // Stop loading state
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            placement="center"
            size="xs"
            isDismissable={!isLoading} // Prevent closing while loading
            onOpenChange={(open) => {
                if (!isLoading) onClose(); // Allow closing only if not loading
            }}
        >
            <ModalContent>
                <ModalHeader>주문을 삭제 하시겠습니까?</ModalHeader>
                <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose} isDisabled={isLoading}>
                        취소
                    </Button>
                    <Button
                        color="danger"
                        fullWidth
                        variant="shadow"
                        onPress={handleDeleteOrder}
                        isLoading={isLoading} // Show loading state
                        isDisabled={isLoading} // Disable button while loading
                    >
                        {isLoading ? "삭제 중..." : "삭제"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
