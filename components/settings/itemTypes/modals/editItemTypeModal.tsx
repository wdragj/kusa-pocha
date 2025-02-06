"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

import { ItemType } from "../itemTypes";

interface EditItemTypeProps {
    editItemTypeModal: {
        isOpen: boolean;
        onOpen: () => void;
        onClose: () => void;
    };
    fetchItemTypes: () => void;
    itemType: ItemType;
}

const EditItemType: React.FC<EditItemTypeProps> = ({ editItemTypeModal, fetchItemTypes, itemType }) => {
    const { isOpen, onClose } = editItemTypeModal;
    const [editedItemTypeName, setEditedItemTypeName] = useState<string>(itemType.name);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState<{ type: "success" | "danger" | "warning"; title: string; message: string } | null>(null);

    useEffect(() => {
        if (isOpen && itemType) {
            setEditedItemTypeName(itemType.name);
        }
    }, [isOpen, itemType]);

    const isEditedItemTypeNameInvalid = useMemo(() => editedItemTypeName.trim() === "", [editedItemTypeName]);

    const hasChanges = useMemo(() => editedItemTypeName !== itemType.name, [editedItemTypeName, itemType]);

    const handleEditItemType = async () => {
        if (!hasChanges) {
            setAlert({ type: "warning", title: "No Changes Detected", message: "You didn't change any fields." });
            setTimeout(() => setAlert(null), 4000);
            onClose();
            return;
        }

        setIsLoading(true);
        setAlert(null);

        try {
            const response = await fetch(`/api/itemTypes/edit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: itemType.id, name: editedItemTypeName }),
            });

            if (!response.ok) throw new Error("Failed to edit item type");

            setAlert({ type: "success", title: "Success", message: `Item type "${editedItemTypeName}" has been edited successfully.` });

            fetchItemTypes();
            onClose();
        } catch (error) {
            setAlert({ type: "danger", title: "Error", message: `Failed to edit item type: ${editedItemTypeName}` });
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
                    <ModalHeader className="flex flex-col gap-1">메뉴 종류 수정: {itemType.name}</ModalHeader>

                    <ModalBody>
                        <Input
                            autoFocus
                            isClearable
                            isRequired
                            color={isEditedItemTypeNameInvalid ? "danger" : "success"}
                            description="메뉴 종류 이름"
                            errorMessage={`메뉴 종류 이름을 입력해 주세요`}
                            isInvalid={isEditedItemTypeNameInvalid}
                            label="이름"
                            placeholder="메뉴 종류 이름"
                            type="text"
                            value={editedItemTypeName}
                            variant="bordered"
                            onValueChange={setEditedItemTypeName}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="flat" onPress={onClose}>
                            취소
                        </Button>
                        <Button
                            color="primary"
                            fullWidth
                            isLoading={isLoading}
                            isDisabled={isEditedItemTypeNameInvalid || isLoading}
                            variant="shadow"
                            onPress={async () => {
                                await handleEditItemType();
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

export default EditItemType;
