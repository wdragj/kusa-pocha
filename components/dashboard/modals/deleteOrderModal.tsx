"use client";

import { useState } from "react";
import { Button, Modal, ModalFooter, ModalContent, ModalHeader } from "@nextui-org/react";

import { useSession } from "@/context/sessionContext";

interface DeleteOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: { id: string; order_number: number } | null;
    refreshOrders: () => void;
    refreshAnalytics: () => void;
}

export default function DeleteOrderModal({ isOpen, onClose, order, refreshOrders, refreshAnalytics }: DeleteOrderModalProps) {
    const { session } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteOrder = async () => {
        if (!order || !session?.id) return;

        setIsLoading(true);

        try {
            const response = await fetch(`/api/orders/delete`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: order.id, userId: session.id }),
            });

            if (!response.ok) throw new Error("Failed to delete order");

            refreshOrders(); // Refresh orders list
            refreshAnalytics(); // Refresh profit analytics
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
                if (!isLoading) onClose();
            }}
        >
            <ModalContent>
                <ModalHeader>{order ? `${order.order_number}번 주문을 삭제 하시겠습니까?` : "주문을 삭제 하시겠습니까?"}</ModalHeader>
                <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose} isDisabled={isLoading}>
                        취소
                    </Button>
                    <Button color="danger" fullWidth variant="shadow" onPress={handleDeleteOrder} isLoading={isLoading} isDisabled={isLoading}>
                        {isLoading ? "삭제 중..." : "삭제"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
