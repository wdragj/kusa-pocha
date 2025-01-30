"use client";

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
    Skeleton,
    useDisclosure,
} from "@nextui-org/react";
import { useMemo, useState } from "react";

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
}

const CreateItem: React.FC<CreateItemProps> = ({ fetchItems, organizations, itemTypes }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [newItemName, setNewItemName] = useState<string>("");
    const [newItemPrice, setNewItemPrice] = useState<string>("");
    const [newItemOrganizationName, setNewItemOrganizationName] = useState<string>("");
    const [newItemType, setNewItemType] = useState<string>("");

    // Validate new item price that it is not negative (newItemPrice is a string)
    const validateNewItemPrice = (newItemPrice: string) => {
        const numberValue = parseFloat(newItemPrice);

        return !isNaN(numberValue) && numberValue >= 0;
    };

    const isNewItemNameInvalid = useMemo(() => newItemName === "", [newItemName]);
    const isNewItemOrganizationNameInvalid = useMemo(() => newItemOrganizationName === "", [newItemOrganizationName]);
    const isNewItemTypeInvalid = useMemo(() => newItemType === "", [newItemType]);

    const isNewItemPriceInvalid = useMemo(() => {
        if (newItemPrice === "") return true;

        return validateNewItemPrice(newItemPrice) ? false : true;
    }, [newItemPrice]);

    // Function to reset input values
    const resetInputValues = () => {
        setNewItemName("");
        setNewItemPrice("");
        setNewItemOrganizationName("");
        setNewItemType("");
    };

    // function to handle item creation
    const handleCreateItem = async (newItemName: string, newItemPrice: string, newItemOrganizationName: string, newItemType: string) => {
        try {
            const response = await fetch(`/api/items/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: newItemName,
                    price: newItemPrice,
                    organization: newItemOrganizationName,
                    type: newItemType,
                    img: "https://nextui.org/images/hero-card.jpeg",
                }),
            });

            if (response.ok) {
                const data = await response.json();

                console.log(
                    `Item created successfully with name: ${data.name}, price: ${data.price}, organization: ${data.organization}, type: ${data.type}`
                );
                fetchItems(); // Fetch items again to update the list
            }
        } catch (error) {
            console.error(`Failed to create item:`, error);
        }
    };

    return (
        <>
            <Card isPressable className="col-span-2 w-[260px] h-[226px] justify-center items-center" onPress={onOpen}>
                <div>
                    <CardHeader className="h-[48px] py-2 px-4 flex flex-row gap-2 justify-between">
                        <Skeleton className="w-2/5 rounded-full">
                            <div className="h-6 w-2/5 rounded-lg bg-default-300" />
                        </Skeleton>
                        Add item
                    </CardHeader>

                    <CardBody className="py-0 px-4">
                        <Skeleton className="rounded-lg px-4 bg-default-200 hover:hidden">
                            <div className="h-[120px]">
                                <p className="z-1">hi</p>
                            </div>
                        </Skeleton>
                    </CardBody>

                    <CardFooter className="h-[56px] px-4 flex flex-row gap-2 justify-between">
                        <Skeleton className="rounded-full">
                            <div className="h-6 w-[73.5px] rounded-lg bg-default-300" />
                        </Skeleton>
                        <div className="flex flex-row gap-2">
                            <Skeleton className="rounded-full">
                                <div className="w-[74.56px] h-[32px] bg-default-300" />
                            </Skeleton>
                            <Skeleton className="rounded-full">
                                <div className="w-[64px] h-[34px] bg-default-300" />
                            </Skeleton>
                        </div>
                    </CardFooter>
                </div>
            </Card>
            <Modal
                isOpen={isOpen}
                placement="center"
                size="xs"
                onOpenChange={(open) => {
                    if (!open) resetInputValues();
                    onOpenChange();
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{newItemName === "" ? `New item` : `New item: ${newItemName}`}</ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    isClearable
                                    isRequired
                                    color={isNewItemNameInvalid ? "danger" : "success"}
                                    description={`Name of item`}
                                    errorMessage={`Please enter a item name`}
                                    isInvalid={isNewItemNameInvalid}
                                    label="Name"
                                    placeholder="삼겹살"
                                    type="text"
                                    variant="bordered"
                                    onValueChange={setNewItemName}
                                />
                                <Input
                                    isClearable
                                    isRequired
                                    color={isNewItemPriceInvalid ? "danger" : "success"}
                                    description={`Price of item. e.g. 12.99`}
                                    errorMessage="Please enter a price that is greater than or equal to 0.00"
                                    isInvalid={isNewItemPriceInvalid}
                                    label="Price"
                                    placeholder="0.00"
                                    startContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-default-400 text-small">$</span>
                                        </div>
                                    }
                                    type="number"
                                    variant="bordered"
                                    onValueChange={setNewItemPrice}
                                />
                                <Select
                                    isRequired
                                    className="max-w-xs"
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
                                    isRequired
                                    className="max-w-xs"
                                    label="Item Type"
                                    placeholder="Select an item type"
                                    selectedKeys={[newItemType]}
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
                                <Button
                                    color="primary"
                                    isDisabled={
                                        isNewItemNameInvalid || isNewItemPriceInvalid || isNewItemOrganizationNameInvalid || isNewItemTypeInvalid
                                    }
                                    variant="shadow"
                                    onPress={async () => {
                                        await handleCreateItem(newItemName, newItemPrice, newItemOrganizationName, newItemType);
                                        onClose();
                                    }}
                                >
                                    Create
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default CreateItem;
