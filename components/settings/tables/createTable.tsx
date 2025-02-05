"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

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
    const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);
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
                if (!open) setNewTableNumber(""); // Reset input when modal closes
                onClose();
            }}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">테이블 생성: {newTableNumber}</ModalHeader>

                <ModalBody>
                    <Input
                        autoFocus
                        isClearable
                        isRequired
                        color={isNewTableNumberInvalid ? "danger" : "success"}
                        description={`테이블 번호`}
                        errorMessage={`0 보다 큰 테이블 번호를 입력해 주세요`}
                        isInvalid={isNewTableNumberInvalid}
                        label="번호"
                        placeholder="테이블 번호"
                        type="number"
                        value={newTableNumber.toString()}
                        variant="bordered"
                        onValueChange={(value) => setNewTableNumber(value === "" ? "" : Number(value))}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                        취소
                    </Button>
                    <Button
                        color="primary"
                        isLoading={isLoading}
                        isDisabled={isNewTableNumberInvalid || isLoading}
                        variant="shadow"
                        fullWidth
                        onPress={async () => {
                            await handleCreateTable();
                            onClose();
                        }}
                    >
                        {isLoading ? "생성 중..." : "생성"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateTable;
