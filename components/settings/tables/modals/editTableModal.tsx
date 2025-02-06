"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Alert, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

interface Table {
    id: number;
    number: number;
    created_at: string;
}

interface EditTableProps {
    editTableModal: {
        isOpen: boolean;
        onOpen: () => void;
        onClose: () => void;
    };
    fetchTables: () => void;
    table: Table;
}

const EditTable: React.FC<EditTableProps> = ({ editTableModal, fetchTables, table }) => {
    const { isOpen, onClose } = editTableModal;
    const [editedTableNumber, setEditedTableNumber] = useState<number | "">(table.number);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState<{ type: "success" | "danger" | "warning"; title: string; message: string } | null>(null);

    useEffect(() => {
        if (isOpen && table) {
            setEditedTableNumber(table.number);
        }
    }, [isOpen, table]);

    const isEditedTableNumberInvalid = useMemo(() => {
        if (editedTableNumber === "") {
            return true;
        }

        const parsedNumber = Number(editedTableNumber);

        return parsedNumber <= 0 || !Number.isInteger(parsedNumber);
    }, [editedTableNumber]);

    const hasChanges = useMemo(() => editedTableNumber !== table.number, [editedTableNumber, table]);

    const handleEditTable = async () => {
        if (!hasChanges) {
            setAlert({ type: "warning", title: "No Changes Detected", message: "You didn't change any fields." });
            setTimeout(() => setAlert(null), 4000);
            onClose();
            return;
        }

        setIsLoading(true);
        setAlert(null); // Reset alert before making request

        try {
            const response = await fetch(`/api/tables/edit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: table.id, number: editedTableNumber }),
            });

            if (!response.ok) throw new Error("Failed to edit table");

            setAlert({ type: "success", title: "Success", message: `Table number "${editedTableNumber}" has been edited successfully.` });

            fetchTables();
            onClose();
        } catch (error) {
            setAlert({ type: "danger", title: "Error", message: `Failed to edit table: ${editedTableNumber}` });
        } finally {
            setIsLoading(false);
            setTimeout(() => setAlert(null), 4000);
        }
    };

    return (
        <>
            {/* Alert Notification - Positioned at the Bottom */}
            {alert && (
                <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm">
                    <Alert color={alert.type} variant="solid" title={alert.title} description={alert.message} onClose={() => setAlert(null)} />
                </div>
            )}

            <Modal isOpen={isOpen} placement="center" size="xs" isDismissable={false} onOpenChange={onClose}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">테이블 수정: {table.number}</ModalHeader>

                    <ModalBody>
                        <Input
                            autoFocus
                            isClearable
                            isRequired
                            color={isEditedTableNumberInvalid ? "danger" : "success"}
                            description="테이블 번호"
                            errorMessage="0 보다 큰 테이블 번호를 입력해 주세요"
                            isInvalid={isEditedTableNumberInvalid}
                            label="번호"
                            placeholder="테이블 번호"
                            type="number"
                            value={editedTableNumber.toString()}
                            variant="bordered"
                            onValueChange={(value) => setEditedTableNumber(value === "" ? "" : Number(value))}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="flat" onPress={onClose}>
                            취소
                        </Button>
                        <Button
                            color="primary"
                            isLoading={isLoading}
                            isDisabled={isEditedTableNumberInvalid || isLoading}
                            variant="shadow"
                            fullWidth
                            onPress={async () => {
                                await handleEditTable();
                                onClose();
                            }}
                        >
                            {isLoading ? "저장 중..." : "저장"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default EditTable;
