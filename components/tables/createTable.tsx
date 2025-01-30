"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";

interface CreateTableProps {
    createTableModal: {
        isOpen: boolean;
        onOpen: () => void;
        onClose: () => void;
    };
    fetchTables: () => void;
}

const CreateTable: React.FC<CreateTableProps> = ({ createTableModal, fetchTables }) => {
    const { isOpen, onClose } = createTableModal;
    const [newTableNumber, setNewTableNumber] = useState<number | "">("");

    useEffect(() => {
        if (isOpen) {
            setNewTableNumber("");
        }
    }, [isOpen]);

    const isNewTableNumberInvalid = useMemo(() => {
        if (newTableNumber === "") {
            return true;
        }

        const parsedNumber = Number(newTableNumber);

        return parsedNumber <= 0 || !Number.isInteger(parsedNumber);
    }, [newTableNumber]);

    const handleCreateTable = async () => {
        try {
            const response = await fetch(`/api/tables/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    number: newTableNumber,
                }),
            });

            if (response.ok) {
                const data = await response.json();

                console.log(`Table created successfully with id: ${data.id} and number: ${data.number}`);
                fetchTables(); // Fetch tables again to update the list
                onClose(); // Close the modal
            }
        } catch (error) {
            console.error(`Failed to create table:`, error);
        }
    };

    return (
        <Modal isOpen={isOpen} placement="center" size="xs" onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Create Table: {newTableNumber}</ModalHeader>

                <ModalBody>
                    <Input
                        autoFocus
                        isClearable
                        isRequired
                        color={isNewTableNumberInvalid ? "danger" : "success"}
                        description={`Number of table`}
                        errorMessage={`Please enter a table number greater than 0 and an integer.`}
                        isInvalid={isNewTableNumberInvalid}
                        label="Number"
                        placeholder="Table Number"
                        type="number"
                        value={newTableNumber.toString()}
                        variant="bordered"
                        onValueChange={(value) => setNewTableNumber(value === "" ? "" : Number(value))}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Close
                    </Button>
                    <Button
                        color="primary"
                        isDisabled={isNewTableNumberInvalid}
                        variant="shadow"
                        onPress={async () => {
                            await handleCreateTable();
                            onClose();
                        }}
                    >
                        Create
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateTable;
