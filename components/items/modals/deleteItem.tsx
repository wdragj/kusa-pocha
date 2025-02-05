"use client";

import React, { useState } from "react";
import { Button, Modal, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

interface DeleteItemProps {
    deleteItemModal: {
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
}

const DeleteItem: React.FC<DeleteItemProps> = ({ deleteItemModal, fetchItems, item }) => {
    const { isOpen, onClose } = deleteItemModal;
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Function to handle item deletion
    const handleDeleteItem = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/items/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: item.id }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete item");
            }

            const data = await response.json();
            console.log(data.message);

            await fetchItems(); // Refresh the item list
            onClose(); // Close modal after deletion
        } catch (error) {
            console.error("Failed to delete item:", error);
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
                <ModalHeader className="flex flex-col gap-1 text-center">{item ? `"${item.name}"을 삭제하시겠습니까?` : "삭제하기"}</ModalHeader>
                <ModalFooter className="flex flex-row justify-center gap-4 w-full">
                    <Button color="danger" variant="flat" isDisabled={isLoading} onPress={onClose}>
                        취소
                    </Button>
                    <Button color="danger" variant="shadow" isDisabled={isLoading} isLoading={isLoading} fullWidth onPress={handleDeleteItem}>
                        {isLoading ? "삭제 중..." : "삭제하기"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeleteItem;
