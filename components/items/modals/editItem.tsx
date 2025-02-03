"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";

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

    // function to handle item edit
    const handleEditItem = async () => {
        setIsLoading(true);
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
                    img: "https://nextui.org/images/hero-card.jpeg",
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to edit item");
            }

            const data = await response.json();
            console.log(
                `Item edited successfully with name: ${data.name}, price: ${data.price}, organization: ${data.organization}, type: ${data.type}`
            );

            await fetchItems(); // Fetch updated item list
            onClose();
        } catch (error) {
            console.error(`Failed to edit item:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            placement="center"
            size="xs"
            isDismissable={!isLoading} // Prevent closing while saving
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
                        description="아이템 이름"
                        errorMessage="아이템 이름을 입력하세요"
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
                        description="아이템 가격 (예: 12.99)"
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
                        label="아이템 종류"
                        placeholder="아이템 종류을 선택하세요"
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
    );
};

export default EditItem;
