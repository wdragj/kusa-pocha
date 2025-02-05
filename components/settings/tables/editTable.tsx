"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

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

    const handleEditTable = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/tables/edit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: table.id,
                    number: editedTableNumber,
                }),
            });

            if (response.ok) {
                const data = await response.json();

                console.log(`Table edited successfully with number: ${data.number}`);
                fetchTables(); // Fetch tables again to update the list
                onClose(); // Close the modal
            }
        } catch (error) {
            console.error(`Failed to edit table:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
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
    );
};

export default EditTable;
