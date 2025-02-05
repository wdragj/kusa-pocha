"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

import { ItemType } from "./itemTypes";

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

    useEffect(() => {
        if (isOpen && itemType) {
            setEditedItemTypeName(itemType.name);
        }
    }, [isOpen, itemType]);

    const iseditedItemTypeNameInvalid = useMemo(() => editedItemTypeName === "", [editedItemTypeName]);

    const handleEditItemType = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/itemTypes/edit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: itemType.id,
                    name: editedItemTypeName,
                }),
            });

            if (response.ok) {
                const data = await response.json();

                console.log(`Item type edited successfully with id: ${data.id} and name: ${data.name}`);
                fetchItemTypes(); // Fetch item types again to update the list
            }
        } catch (error) {
            console.error(`Failed to edit item type:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} placement="center" size="xs" isDismissable={false} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">메뉴 종류 수정: {itemType.name}</ModalHeader>

                <ModalBody>
                    <Input
                        autoFocus
                        isClearable
                        isRequired
                        color={iseditedItemTypeNameInvalid ? "danger" : "success"}
                        description="메뉴 종류 이름"
                        errorMessage={`메뉴 종류 이름을 입력해 주세요`}
                        isInvalid={iseditedItemTypeNameInvalid}
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
                        isDisabled={iseditedItemTypeNameInvalid || isLoading}
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
    );
};

export default EditItemType;
