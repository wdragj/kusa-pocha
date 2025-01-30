"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";

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
        }
    };

    return (
        <Modal isOpen={isOpen} placement="center" size="xs" onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Edit Table: {table.number}</ModalHeader>

                <ModalBody>
                    <Input
                        autoFocus
                        isClearable
                        isRequired
                        color={isEditedTableNumberInvalid ? "danger" : "success"}
                        description="Number of table"
                        errorMessage="Please enter a table number greater than 0 and an integer."
                        isInvalid={isEditedTableNumberInvalid}
                        label="Number"
                        placeholder="Table Number"
                        type="number"
                        value={editedTableNumber.toString()}
                        variant="bordered"
                        onValueChange={(value) => setEditedTableNumber(value === "" ? "" : Number(value))}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Close
                    </Button>
                    <Button
                        color="primary"
                        isDisabled={isEditedTableNumberInvalid}
                        variant="shadow"
                        onPress={async () => {
                            await handleEditTable();
                            onClose();
                        }}
                    >
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditTable;
