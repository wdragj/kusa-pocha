"use client";

import React, { useState } from "react";
import { Button, Modal, ModalFooter, ModalContent, ModalHeader } from "@nextui-org/react";

import { ItemType } from "./itemTypes";

interface DeleteItemTypeProps {
    deleteItemTypeModal: {
        isOpen: boolean;
        onOpen: () => void;
        onClose: () => void;
    };
    fetchItemTypes: () => void;
    itemType: ItemType;
}

const DeleteItemType: React.FC<DeleteItemTypeProps> = ({ deleteItemTypeModal, fetchItemTypes, itemType }) => {
    const { isOpen, onClose } = deleteItemTypeModal;
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteItemType = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/itemTypes/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: itemType.id }),
            });

            if (response.ok) {
                console.log(`Item type deleted successfully with id: ${itemType.id}`);
                fetchItemTypes(); // Fetch item types again to update the list
            }
        } catch (error) {
            console.error(`Failed to delete item type:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} placement="center" size="xs" isDismissable={false} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">{itemType.name}를 삭제 하시겠습니까?</ModalHeader>
                <ModalFooter className="justify-center gap-4">
                    <Button color="danger" variant="flat" onPress={onClose}>
                        취소
                    </Button>
                    <Button
                        color="danger"
                        variant="shadow"
                        fullWidth
                        isLoading={isLoading}
                        isDisabled={isLoading}
                        onPress={async () => {
                            await handleDeleteItemType();
                            onClose();
                        }}
                    >
                        {isLoading ? "삭제 중..." : "삭제"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeleteItemType;
