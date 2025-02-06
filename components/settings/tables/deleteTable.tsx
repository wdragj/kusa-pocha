"use client";

import React, { useState } from "react";
import { Button, Modal, ModalFooter, ModalContent, ModalHeader, Alert } from "@heroui/react";

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
    const [alert, setAlert] = useState<{ type: "success" | "danger" | "warning"; title: string; message: string } | null>(null);

    const handleDeleteTable = async () => {
        setIsLoading(true);
        setAlert(null); // Reset alert before making request

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

            if (!response.ok) {
                throw new Error(`Failed to delete table: ${response.statusText}`);
            }

            setAlert({ type: "success", title: "Success", message: `Table deleted successfully with number: ${table?.number}` });

            const data = await response.json();
            fetchTables(); // Fetch tables again to update the list
        } catch (error) {
            setAlert({ type: "danger", title: "Error", message: `Failed to delete table: ${table?.number}` });
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
                    <Alert color={alert.type} variant="faded" title={alert.title} description={alert.message} onClose={() => setAlert(null)} />
                </div>
            )}

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
        </>
    );
};

export default DeleteTable;
