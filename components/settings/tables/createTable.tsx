"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Alert, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

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
    const [alert, setAlert] = useState<{ type: "success" | "danger" | "warning"; title: string; message: string } | null>(null);

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
        setAlert(null); // Reset alert before making request

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

            if (!response.ok) {
                throw new Error(`Failed to create table: ${response.statusText}`);
            }

            setAlert({ type: "success", title: "Success", message: `Table created successfully with number: ${newTableNumber}` });

            const data = await response.json();
            fetchTables(); // Fetch tables again to update the list
        } catch (error) {
            setAlert({ type: "danger", title: "Error", message: `Failed to create table: ${newTableNumber}` });
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
        </>
    );
};

export default CreateTable;
