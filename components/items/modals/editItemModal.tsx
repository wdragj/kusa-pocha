"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@heroui/react";

interface Organization {
    id: number;
    name: string;
    created_at: string;
}

interface ItemType {
    id: number;
    name: string;
    created_at: string;
}

interface EditItemProps {
    editItemModal: {
        isOpen: boolean;
        onOpen: () => void;
        onClose: () => void;
    };
    fetchItems: () => void;
    item: {
        created_at: string;
        id: number;
        img: string;
        name: string;
        organization: string;
        price: number;
        type: string;
    };
    organizations: Organization[];
    itemTypes: ItemType[];
}

const EditItem: React.FC<EditItemProps> = ({ editItemModal, fetchItems, item, organizations, itemTypes }) => {
    const { isOpen, onClose } = editItemModal;
    const [editedItemName, setEditedItemName] = useState<string>("");
    const [editedItemPrice, setEditedItemPrice] = useState<string>("0.00");
    const [editedItemOrganizationName, setEditedItemOrganizationName] = useState<string>("");
    const [editedItemType, setEditedItemType] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<{ type: "success" | "danger" | "warning"; title: string; message: string } | null>(null);

    useEffect(() => {
        if (isOpen && item) {
            setEditedItemName(item.name);
            setEditedItemPrice(item.price.toString());
            setEditedItemOrganizationName(item.organization);
            setEditedItemType(item.type);
        }
    }, [isOpen, item]);

    const validateEditedItemPrice = (price: string) => {
        const numberValue = parseFloat(price);
        return !isNaN(numberValue) && numberValue >= 0;
    };

    const isEditedItemNameInvalid = useMemo(() => editedItemName === "", [editedItemName]);
    const isEditedItemOrganizationNameInvalid = useMemo(() => editedItemOrganizationName === "", [editedItemOrganizationName]);
    const isEditedItemTypeInvalid = useMemo(() => editedItemType === "", [editedItemType]);

    const isEditedItemPriceInvalid = useMemo(() => {
        if (editedItemPrice === "") return true;
        return validateEditedItemPrice(editedItemPrice) ? false : true;
    }, [editedItemPrice]);

    const hasChanges = useMemo(() => {
        if (!item) return false; // If item is null, no changes

        return (
            editedItemName !== item.name ||
            editedItemPrice !== item.price.toString() ||
            editedItemOrganizationName !== item.organization ||
            editedItemType !== item.type
        );
    }, [item, editedItemName, editedItemPrice, editedItemOrganizationName, editedItemType]);

    // function to handle item edit
    const handleEditItem = async () => {
        if (!hasChanges) {
            setAlert({ type: "warning", title: "No Changes Detected", message: "You didn't change any fields." });
            setTimeout(() => setAlert(null), 4000);
            onClose();
            return;
        }

        setIsLoading(true);
        setAlert(null); // Reset alert before making request

        try {
            const response = await fetch(`/api/items/edit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: item.id,
                    name: editedItemName,
                    price: editedItemPrice,
                    organization: editedItemOrganizationName,
                    type: editedItemType,
                    img: "",
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to edit item");
            }

            setAlert({ type: "success", title: "Item edited", message: `Item "${editedItemName}" has been edited successfully` });

            const data = await response.json();
            // console.log(
            //     `Item edited successfully with name: ${data.name}, price: ${data.price}, organization: ${data.organization}, type: ${data.type}`
            // );

            fetchItems(); // Fetch updated item list
            onClose();
        } catch (error) {
            console.error(`Failed to edit item:`, error);
            setAlert({ type: "danger", title: "Error", message: `Failed to edit item "${editedItemName}"` });
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
                    if (!isLoading) onClose();
                }}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 text-center">{item ? `"${item.name}" 수정` : "수정하기"}</ModalHeader>

                    <ModalBody>
                        <Input
                            autoFocus
                            isClearable
                            isRequired
                            color={isEditedItemNameInvalid ? "danger" : "success"}
                            description="메뉴 이름"
                            errorMessage="메뉴 이름을 입력하세요"
                            isInvalid={isEditedItemNameInvalid}
                            label="이름"
                            placeholder="삼겹살"
                            type="text"
                            value={editedItemName}
                            variant="bordered"
                            onValueChange={setEditedItemName}
                        />
                        <Input
                            isClearable
                            isRequired
                            color={isEditedItemPriceInvalid ? "danger" : "success"}
                            description="메뉴 가격 (예: 12.99)"
                            errorMessage="0.00 이상 가격을 입력하세요"
                            isInvalid={isEditedItemPriceInvalid}
                            label="가격"
                            placeholder="0.00"
                            startContent={
                                <div className="pointer-events-none flex items-center">
                                    <span className="text-default-400 text-small">$</span>
                                </div>
                            }
                            type="number"
                            value={editedItemPrice}
                            variant="bordered"
                            onValueChange={setEditedItemPrice}
                        />
                        <Select
                            isRequired
                            className="max-w-xs"
                            label="동아리"
                            placeholder="동아리을 선택하세요"
                            selectedKeys={[editedItemOrganizationName]}
                            onChange={(e) => setEditedItemOrganizationName(e.target.value)}
                        >
                            {organizations.map((organization) => (
                                <SelectItem key={organization.name}>{organization.name}</SelectItem>
                            ))}
                        </Select>
                        <Select
                            isRequired
                            className="max-w-xs"
                            label="메뉴 종류"
                            placeholder="메뉴 종류을 선택하세요"
                            selectedKeys={[editedItemType]}
                            onChange={(e) => setEditedItemType(e.target.value)}
                        >
                            {itemTypes.map((itemType) => (
                                <SelectItem key={itemType.name}>{itemType.name}</SelectItem>
                            ))}
                        </Select>
                    </ModalBody>
                    <ModalFooter className="flex flex-row justify-center gap-4 w-full">
                        <Button color="danger" variant="flat" isDisabled={isLoading} onPress={onClose}>
                            취소
                        </Button>
                        <Button
                            color="primary"
                            variant="shadow"
                            isDisabled={
                                isLoading ||
                                isEditedItemNameInvalid ||
                                isEditedItemPriceInvalid ||
                                isEditedItemOrganizationNameInvalid ||
                                isEditedItemTypeInvalid
                            }
                            isLoading={isLoading}
                            fullWidth
                            onPress={handleEditItem}
                        >
                            {isLoading ? "저장 중..." : "저장하기"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default EditItem;
