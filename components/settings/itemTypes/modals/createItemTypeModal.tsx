"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

interface CreateItemTypeProps {
    createItemTypeModal: {
        isOpen: boolean;
        onOpen: () => void;
        onClose: () => void;
    };
    fetchItemTypes: () => void;
}

const CreateItemType: React.FC<CreateItemTypeProps> = ({ createItemTypeModal, fetchItemTypes }) => {
    const { isOpen, onClose } = createItemTypeModal;
    const [newItemTypeName, setNewItemTypeName] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState<{ type: "success" | "danger" | "warning"; title: string; message: string } | null>(null);

    useEffect(() => {
        if (isOpen) {
            setNewItemTypeName(newItemTypeName);
        }
    }, [isOpen]);

    const isNewItemTypeNameInvalid = useMemo(() => newItemTypeName === "", [newItemTypeName]);

    // Function to reset input values
    const resetInputValues = () => {
        setNewItemTypeName("");
    };

    const handleCreateItemType = async () => {
        setIsLoading(true);
        setAlert(null); // Reset alert before making request

        try {
            const response = await fetch(`/api/itemTypes/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: newItemTypeName,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to create item type: ${response.statusText}`);
            }

            setAlert({ type: "success", title: "Success", message: `Item type created successfully with name: ${newItemTypeName}` });

            const data = await response.json();
            fetchItemTypes(); // Fetch item types again to update the list
        } catch (error) {
            setAlert({ type: "danger", title: "Error", message: `Failed to create item type: ${newItemTypeName}` });
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
                    <Alert color={alert.type} variant="solid" title={alert.title} description={alert.message} onClose={() => setAlert(null)} />
                </div>
            )}
            <Modal
                isOpen={isOpen}
                placement="center"
                size="xs"
                isDismissable={false}
                onOpenChange={(open) => {
                    if (!open) resetInputValues(); // Reset input when modal closes
                    onClose();
                }}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col">메뉴 종류 생성: {newItemTypeName}</ModalHeader>

                    <ModalBody>
                        <Input
                            autoFocus
                            isClearable
                            isRequired
                            color={isNewItemTypeNameInvalid ? "danger" : "success"}
                            description="메뉴 종류 이름"
                            errorMessage={`메뉴 종류 이름을 입력해 주세요`}
                            isInvalid={isNewItemTypeNameInvalid}
                            label="이름"
                            placeholder="메뉴 종류 이름"
                            type="text"
                            value={newItemTypeName}
                            variant="bordered"
                            onValueChange={setNewItemTypeName}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="flat" onPress={onClose}>
                            취소
                        </Button>
                        <Button
                            color="primary"
                            isDisabled={isNewItemTypeNameInvalid || isLoading}
                            isLoading={isLoading}
                            fullWidth
                            variant="shadow"
                            onPress={async () => {
                                await handleCreateItemType();
                                onClose();
                            }}
                        >
                            {isLoading ? "생성 중..." : "생성하기"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CreateItemType;
