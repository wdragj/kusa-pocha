"use client";

import React, { useState } from "react";
import { Alert, Button, Modal, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

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
    const [alert, setAlert] = useState<{ type: "success" | "danger"; title: string; message: string } | null>(null);

    // Function to handle item deletion
    const handleDeleteItem = async () => {
        setIsLoading(true);
        setAlert(null); // Reset alert before making request

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

            setAlert({ type: "success", title: "Item deleted", message: `Item "${item.name}" has been deleted successfully` });

            const data = await response.json();
            console.log(data.message);

            await fetchItems(); // Refresh the item list
            onClose(); // Close modal after deletion
        } catch (error) {
            console.error("Failed to delete item:", error);
            setAlert({ type: "danger", title: "Error", message: `Failed to delete item "${item.name}"` });
        } finally {
            setIsLoading(false);
            setTimeout(() => setAlert(null), 4000); // Hide alert after 4 seconds
        }
    };

    return (
        <>
            {/* Alert Notification - Positioned at the Bottom */}{" "}
            {alert && (
                <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm">
                    <Alert
                        color={alert.type === "success" ? "success" : "danger"}
                        variant="faded"
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
        </>
    );
};

export default DeleteItem;
