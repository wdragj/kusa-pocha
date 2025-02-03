"use client";

import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    useDisclosure,
} from "@nextui-org/react";

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

    // Reset modal inputs when the modal opens
    useEffect(() => {
        if (isOpen) {
            setNewItemName("");
            setNewItemPrice("");
            setNewItemOrganizationName("");
            setNewItemType(preselectedItemType);
        }
    }, [isOpen, preselectedItemType]); // Reset when modal opens or type changes

    // Check if all required fields are filled
    const isFormValid =
        newItemName.trim() !== "" &&
        newItemPrice.trim() !== "" &&
        parseFloat(newItemPrice) > 0 &&
        newItemOrganizationName.trim() !== "" &&
        newItemType !== undefined;

    return (
        <Modal isOpen={isOpen} placement="center" size="xs" onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{newItemName === "" ? `New Item` : `New Item: ${newItemName}`}</ModalHeader>
                        <ModalBody>
                            <Input autoFocus isClearable label="Name" placeholder="Item Name" value={newItemName} onValueChange={setNewItemName} />
                            <Input isClearable label="Price" placeholder="0.00" type="number" value={newItemPrice} onValueChange={setNewItemPrice} />
                            <Select
                                label="Organization"
                                placeholder="Select an organization"
                                selectedKeys={[newItemOrganizationName]}
                                onChange={(e) => setNewItemOrganizationName(e.target.value)}
                            >
                                {organizations.map((organization) => (
                                    <SelectItem key={organization.name}>{organization.name}</SelectItem>
                                ))}
                            </Select>
                            <Select
                                label="Item Type"
                                placeholder="Select an item type"
                                selectedKeys={[newItemType!]}
                                onChange={(e) => setNewItemType(e.target.value)}
                            >
                                {itemTypes.map((itemType) => (
                                    <SelectItem key={itemType.name}>{itemType.name}</SelectItem>
                                ))}
                            </Select>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <Button color="primary" variant="shadow" isDisabled={!isFormValid}>
                                Create
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default CreateItem;
