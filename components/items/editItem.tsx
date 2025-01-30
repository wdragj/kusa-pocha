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

    useEffect(() => {
        if (isOpen && item) {
            setEditedItemName(item.name);
            setEditedItemPrice(item.price.toString());
            setEditedItemOrganizationName(item.organization);
            setEditedItemType(item.type);
        }
    }, [isOpen, item]);

    // Validate new item price that it is not negative (editedItemPrice is a string)
    const validateeditedItemPrice = (editedItemPrice: string) => {
        const numberValue = parseFloat(editedItemPrice);

        return !isNaN(numberValue) && numberValue >= 0;
    };

    const iseditedItemNameInvalid = useMemo(() => editedItemName === "", [editedItemName]);
    const iseditedItemOrganizationNameInvalid = useMemo(() => editedItemOrganizationName === "", [editedItemOrganizationName]);
    const isEditedItemTypeInvalid = useMemo(() => editedItemType === "", [editedItemType]);

    const iseditedItemPriceInvalid = useMemo(() => {
        if (editedItemPrice === "") return true;

        return validateeditedItemPrice(editedItemPrice) ? false : true;
    }, [editedItemPrice]);

    // function to handle item edit
    const handleEditItem = async () => {
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

            if (response.ok) {
                const data = await response.json();

                console.log(
                    `Item edited successfully with name: ${data.name}, price: ${data.price}, organization: ${data.organization}, type: ${data.type}`
                );
                fetchItems(); // Fetch items again to update the list
            }
        } catch (error) {
            console.error(`Failed to create item:`, error);
        }
    };

    return (
        <Modal isOpen={isOpen} placement="center" size="xs" onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Edit item: {item ? item.name : ""}</ModalHeader>

                <ModalBody>
                    <Input
                        autoFocus
                        isClearable
                        isRequired
                        color={iseditedItemNameInvalid ? "danger" : "success"}
                        description={`Name of item`}
                        errorMessage={`Please enter a item name`}
                        isInvalid={iseditedItemNameInvalid}
                        label="Name"
                        placeholder="삼겹살"
                        type="text"
                        value={editedItemName}
                        variant="bordered"
                        onValueChange={setEditedItemName}
                    />
                    <Input
                        isClearable
                        isRequired
                        color={iseditedItemPriceInvalid ? "danger" : "success"}
                        description={`Price of item. e.g. 12.99`}
                        errorMessage="Please enter a price that is greater than or equal to 0.00"
                        isInvalid={iseditedItemPriceInvalid}
                        label="Price"
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
                        label="Organization"
                        placeholder="Select an organization"
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
                        label="Item Type"
                        placeholder="Select an item type"
                        selectedKeys={[editedItemType]}
                        onChange={(e) => setEditedItemType(e.target.value)}
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
                    <Button
                        color="primary"
                        isDisabled={
                            iseditedItemNameInvalid || iseditedItemPriceInvalid || iseditedItemOrganizationNameInvalid || isEditedItemTypeInvalid
                        }
                        variant="shadow"
                        onPress={async () => {
                            await handleEditItem();
                            onClose();
                        }}
                    >
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditItem;
