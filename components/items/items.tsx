"use client";

import React, { useEffect, useState } from "react";
import { useDisclosure, Button } from "@nextui-org/react";
import AddIcon from "@mui/icons-material/Add";

import CreateItem from "./modals/createItem";
import ItemCard from "./itemCard";
import { createClient } from "@/utils/supabase/client";
import { useSession } from "@/context/sessionContext";
import AddToCart from "./modals/addToCart";
import BuyNow from "./modals/buyNow";
import DeleteItem from "./modals/deleteItem";
import EditItem from "./modals/editItem";
import YouMustBeSignedIn from "./modals/youMustBeSignedIn";

interface Item {
    created_at: string;
    id: number;
    img: string;
    name: string;
    organization: string;
    price: number;
    type: string;
}

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

interface Table {
    id: number;
    number: number;
    created_at: string;
}

export default function Items() {
    const supabase = createClient();
    const { session } = useSession();

    const [items, setItems] = useState<Item[]>([]);
    const [itemsLoaded, setItemsLoaded] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [preselectedItemType, setPreselectedItemType] = useState<string | undefined>(undefined);

    // Modal states
    const createItemModal = useDisclosure();
    const deleteItemModal = useDisclosure();
    const editItemModal = useDisclosure();
    const buyNowModal = useDisclosure();
    const addToCartModal = useDisclosure();
    const youMustBeSignedInModal = useDisclosure(); // Added sign-in modal

    // Fetch items
    const fetchItems = async () => {
        try {
            const response = await fetch("/api/items");
            const data = await response.json();
            setItems(data);
            setItemsLoaded(true);
        } catch (error) {
            console.error("Failed to fetch items:", error);
            setItemsLoaded(true);
        }
    };

    // Fetch organizations, item types, and tables
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [orgsRes, typesRes, tablesRes] = await Promise.all([
                    fetch("/api/organizations"),
                    fetch("/api/itemTypes"),
                    fetch("/api/tables"),
                ]);

                setOrganizations(await orgsRes.json());
                setItemTypes(await typesRes.json());
                setTables(await tablesRes.json());

                await fetchItems(); // Fetch items separately
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setItemsLoaded(true);
            }
        };

        fetchData();
    }, []);

    return (
        <section className="flex flex-col items-center justify-center gap-4 w-full px-4">
            {itemTypes.map((itemType) => (
                <div key={itemType.id} className="w-full max-w-6xl">
                    {/* Title + Add Button */}
                    <div className="flex items-center justify-center gap-2 py-2">
                        <h1 className="text-lg lg:text-xl text-default-600">{itemType.name}</h1>
                        {session?.role === "admin" && (
                            <Button
                                isIconOnly
                                size="sm"
                                color="primary"
                                radius="full"
                                variant="light"
                                onPress={() => {
                                    setPreselectedItemType(itemType.name);
                                    createItemModal.onOpen();
                                }}
                            >
                                <AddIcon fontSize="small" />
                            </Button>
                        )}
                    </div>

                    {/* Display Items */}
                    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4 mt-4">
                        {itemsLoaded ? (
                            items
                                .filter((item) => item.type === itemType.name)
                                .map((item) => (
                                    <ItemCard
                                        key={item.id}
                                        item={item}
                                        setSelectedItem={setSelectedItem}
                                        session={session}
                                        onEdit={editItemModal.onOpen}
                                        onDelete={deleteItemModal.onOpen}
                                        onBuyNow={() => {
                                            if (session) {
                                                setSelectedItem(item);
                                                buyNowModal.onOpen();
                                            } else {
                                                youMustBeSignedInModal.onOpen(); // Show sign-in modal
                                            }
                                        }}
                                        onAddToCart={() => {
                                            if (session) {
                                                setSelectedItem(item);
                                                addToCartModal.onOpen();
                                            } else {
                                                youMustBeSignedInModal.onOpen(); // Show sign-in modal
                                            }
                                        }}
                                    />
                                ))
                        ) : (
                            <div className="flex justify-center items-center w-full col-span-full">
                                <p className="text-center">메뉴를 불러오는중...</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* Create Item Modal with Preselected Type */}
            <CreateItem
                fetchItems={fetchItems}
                organizations={organizations}
                itemTypes={itemTypes}
                preselectedItemType={preselectedItemType} // Pass preselected item type
                isOpen={createItemModal.isOpen}
                onOpenChange={createItemModal.onOpenChange}
            />

            {/* Modals */}
            <DeleteItem deleteItemModal={deleteItemModal} fetchItems={fetchItems} item={selectedItem!} />
            <EditItem
                editItemModal={editItemModal}
                fetchItems={fetchItems}
                item={selectedItem!}
                itemTypes={itemTypes}
                organizations={organizations}
            />
            <BuyNow
                buyNowModal={buyNowModal}
                fetchItems={fetchItems}
                item={selectedItem!}
                itemTypes={itemTypes}
                organizations={organizations}
                tables={tables}
            />
            <AddToCart addToCartModal={addToCartModal} fetchItems={fetchItems} item={selectedItem!} session={session} />

            {/* Sign-in Required Modal */}
            <YouMustBeSignedIn youMustBeSignedInModal={youMustBeSignedInModal} />
        </section>
    );
}
