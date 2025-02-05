"use client";

import React, { useState } from "react";
import { Button, Modal, ModalFooter, ModalContent, ModalHeader } from "@heroui/react";

interface Table {
    id: number;
    number: number;
    created_at: string;
}

interface DeleteTableProps {
    deleteTableModal: {
        isOpen: boolean;
        onOpen: () => void;
        onClose: () => void;
    };
    fetchTables: () => void;
    table: Table | null;
}

const DeleteTable: React.FC<DeleteTableProps> = ({ deleteTableModal, fetchTables, table }) => {
    const { isOpen, onClose } = deleteTableModal;
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteTable = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/tables/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: table?.id,
                }),
            });

            if (response.ok) {
                console.log(`Table deleted successfully with id: ${table?.id}`);
                fetchTables(); // Fetch tables again to update the list
            }
        } catch (error) {
            console.error(`Failed to delete table:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} placement="center" size="xs" isDismissable={false} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">{table?.number}번 테이블을 삭제 하시겠습니까?</ModalHeader>
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
                            await handleDeleteTable();
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

export default DeleteTable;
