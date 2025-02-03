"use client";

import { Button, Card, CardBody, CardFooter, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import CreateItemType from "./createItemType";
import EditItemType from "./editItemType";
import DeleteItemType from "./deleteItemType";

import { subtitle } from "@/components/primitives";

export interface ItemType {
    id: number;
    name: string;
    created_at: string;
}

export default function ItemTypes() {
    const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
    const [selectedItemType, setSelectedItemType] = useState<ItemType | null>(null);

    // Modal State Management
    const createItemTypeModal = useDisclosure();
    const deleteItemTypeModal = useDisclosure();
    const editItemTypeModal = useDisclosure();

    // Fetch ItemTypes
    const fetchItemTypes = async () => {
        try {
            const response = await fetch("/api/itemTypes");
            const data = await response.json();
            setItemTypes(data);
        } catch (error) {
            console.error("Failed to fetch item types:", error);
        }
    };

    useEffect(() => {
        fetchItemTypes();
    }, []);

    return (
        <section className="flex flex-col items-center justify-center gap-4 w-full px-4">
            {/* Header with Responsive Layout */}
            <div className="inline-flex items-center gap-x-1">
                <h1 className={subtitle()}>메뉴 종류</h1>
                <Button isIconOnly color="primary" radius="full" size="sm" variant="light" onPress={createItemTypeModal.onOpen}>
                    <AddIcon fontSize="small" />
                </Button>
            </div>

            {/* Responsive Grid Layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full max-w-3xl">
                {itemTypes.map((itemType) => (
                    <Card key={itemType.id} className="flex w-full sm:w-[140px]" radius="sm">
                        <CardBody className="pb-1">
                            <p className="text-sm font-bold text-center">{itemType.name}</p>
                        </CardBody>
                        <CardFooter className="flex justify-between p-2">
                            <Button
                                isIconOnly
                                color="warning"
                                radius="full"
                                size="sm"
                                variant="light"
                                onPress={() => {
                                    setSelectedItemType(itemType);
                                    editItemTypeModal.onOpen();
                                }}
                            >
                                <EditIcon fontSize="small" />
                            </Button>
                            <Button
                                isIconOnly
                                color="danger"
                                radius="full"
                                size="sm"
                                variant="light"
                                onPress={() => {
                                    setSelectedItemType(itemType);
                                    deleteItemTypeModal.onOpen();
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Modals */}
            <CreateItemType createItemTypeModal={createItemTypeModal} fetchItemTypes={fetchItemTypes} />
            {selectedItemType && (
                <>
                    <EditItemType editItemTypeModal={editItemTypeModal} fetchItemTypes={fetchItemTypes} itemType={selectedItemType} />
                    <DeleteItemType deleteItemTypeModal={deleteItemTypeModal} fetchItemTypes={fetchItemTypes} itemType={selectedItemType} />
                </>
            )}
        </section>
    );
}
