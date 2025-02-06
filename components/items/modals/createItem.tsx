"use client";

import React, { useEffect, useState } from "react";
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
    const [alert, setAlert] = useState<{ type: "success" | "danger"; title: string; message: string } | null>(null);

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
        setAlert(null); // Reset alert before making request

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

            setAlert({ type: "success", title: "Success", message: `Item "${newItemName}" has been created successfully` });

            await fetchItems(); // Refresh the item list
            onOpenChange(false); // Close the modal
        } catch (error) {
            console.error("Error creating item:", error);
            setAlert({ type: "danger", title: "Error", message: `Failed to create item "${newItemName}"` });
        } finally {
            setIsLoading(false);
            setTimeout(() => setAlert(null), 4000); // Hide alert after 4 seconds
        }
    };

    return (
        <>
            {/* Alert Notification - Positioned at the Bottom */}{" "}
            {alert && (
                <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm">
                    <Alert
                        color={alert.type === "success" ? "success" : "danger"}
                        variant="faded"
                        title={alert.title}
                        description={alert.message}
                        onClose={() => setAlert(null)}
                    />
                </div>
            )}
            <Modal
                isOpen={isOpen}
                placement="center"
                size="xs"
                isDismissable={false}
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
        </>
    );
};

export default CreateItem;
