"use client";

import React, { useEffect, useState } from "react";
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

interface CreateItemProps {
    fetchItems: () => Promise<void>;
    organizations: Organization[];
    itemTypes: ItemType[];
    preselectedItemType?: string;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

const CreateItem: React.FC<CreateItemProps> = ({ fetchItems, organizations, itemTypes, preselectedItemType, isOpen, onOpenChange }) => {
    const [newItemName, setNewItemName] = useState<string>("");
    const [newItemPrice, setNewItemPrice] = useState<string>("");
    const [newItemOrganizationName, setNewItemOrganizationName] = useState<string>("");
    const [newItemType, setNewItemType] = useState<string | undefined>(preselectedItemType);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Reset modal inputs when the modal opens
    useEffect(() => {
        if (isOpen) {
            setNewItemName("");
            setNewItemPrice("");
            setNewItemOrganizationName("");
            setNewItemType(preselectedItemType);
        }
    }, [isOpen, preselectedItemType]);

    // Check if all required fields are filled
    const isFormValid =
        newItemName.trim() !== "" &&
        newItemPrice.trim() !== "" &&
        parseFloat(newItemPrice) > 0 &&
        newItemOrganizationName.trim() !== "" &&
        newItemType !== undefined;

    // Function to handle item creation
    const handleCreateItem = async () => {
        if (!isFormValid) return;

        setIsLoading(true);
        try {
            const response = await fetch("/api/items/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newItemName,
                    price: parseFloat(newItemPrice),
                    organization: newItemOrganizationName,
                    type: newItemType,
                    img: "",
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create item");
            }

            await fetchItems(); // Refresh the item list
            onOpenChange(false); // Close the modal
        } catch (error) {
            console.error("Error creating item:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            placement="center"
            size="xs"
            isDismissable={!isLoading} // Prevent closing while loading
            onOpenChange={(open) => {
                if (!isLoading) onOpenChange(open); // Allow closing only if not loading
            }}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">{newItemName === "" ? `새 메뉴` : `새 메뉴: ${newItemName}`}</ModalHeader>
                <ModalBody>
                    <Input autoFocus isClearable label="이름" placeholder="메뉴 이름" value={newItemName} onValueChange={setNewItemName} />
                    <Input isClearable label="가격" placeholder="0.00" type="number" value={newItemPrice} onValueChange={setNewItemPrice} />
                    <Select
                        label="동아리"
                        placeholder="동아리을 선택하세요"
                        selectedKeys={[newItemOrganizationName]}
                        onChange={(e) => setNewItemOrganizationName(e.target.value)}
                    >
                        {organizations.map((organization) => (
                            <SelectItem key={organization.name}>{organization.name}</SelectItem>
                        ))}
                    </Select>
                    <Select
                        label="메뉴 종류"
                        placeholder="메뉴 종류을 선택하세요"
                        selectedKeys={[newItemType!]}
                        onChange={(e) => setNewItemType(e.target.value)}
                    >
                        {itemTypes.map((itemType) => (
                            <SelectItem key={itemType.name}>{itemType.name}</SelectItem>
                        ))}
                    </Select>
                </ModalBody>
                <ModalFooter className="flex flex-row justify-center items-center">
                    <Button color="danger" variant="flat" isDisabled={isLoading} onPress={() => onOpenChange(false)}>
                        취소
                    </Button>
                    <Button
                        color="primary"
                        isDisabled={!isFormValid || isLoading}
                        fullWidth
                        variant="shadow"
                        isLoading={isLoading} // Show loading state
                        onPress={handleCreateItem}
                    >
                        {isLoading ? "만드는 중..." : "만들기"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateItem;
