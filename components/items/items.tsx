"use client";

import React, { useEffect, useState } from "react";
import { useDisclosure } from "@nextui-org/react";

import { subtitle } from "../primitives";

// Modal components
import ItemsDefaultView from "./itemsDefaultView";

import { createClient } from "@/utils/supabase/client";
import { useSession } from "@/context/sessionContext";

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
    const { session, isLoading } = useSession();

    // Items state
    const [items, setItems] = useState<Item[]>([]);
    const [itemsLoaded, setItemsLoaded] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    // Organizations state
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
    const [tables, setTables] = useState<Table[]>([]);

    // Modals for items
    const deleteItemModal = useDisclosure();
    const editItemModal = useDisclosure();
    const youMustBeSignedInModal = useDisclosure();
    const buyNowModal = useDisclosure();
    const addToCartModal = useDisclosure();

    // Fetch items from the server
    const fetchItems = async () => {
        try {
            const response = await fetch("/api/items");
            const data = await response.json();
            setItems(data);
            setItemsLoaded(true);
        } catch (error) {
            console.error("Failed to fetch menus:", error);
            setItemsLoaded(true);
        }
    };

    // Fetch organizations from the server
    const fetchOrganizations = async () => {
        try {
            const response = await fetch("/api/organizations");
            const data = await response.json();
            setOrganizations(data);
        } catch (error) {
            console.error("Failed to fetch organizations:", error);
        }
    };

    // Fetch item types from the server
    const fetchItemTypes = async () => {
        try {
            const response = await fetch("/api/itemTypes");
            const data = await response.json();
            setItemTypes(data);
        } catch (error) {
            console.error("Failed to fetch item types:", error);
        }
    };

    // Fetch tables from the server
    const fetchTables = async () => {
        try {
            const response = await fetch("/api/tables");
            const data = await response.json();
            setTables(data);
        } catch (error) {
            console.error("Failed to fetch tables:", error);
        }
    };

    useEffect(() => {
        fetchItems();
        fetchOrganizations();
        fetchItemTypes();
        fetchTables();
    }, []); // Runs once on mount

    return (
        <section className="flex flex-col items-center justify-center gap-4">
            {itemTypes.map((itemType) => (
                <React.Fragment key={itemType.id}>
                    <h1 key={itemType.id} className={subtitle()}>
                        {itemType.name}
                    </h1>

                    <ItemsDefaultView
                        deleteItemModal={deleteItemModal}
                        editItemModal={editItemModal}
                        fetchItems={fetchItems}
                        itemTypeToDisplay={itemType.name}
                        itemTypes={itemTypes}
                        items={items}
                        itemsLoaded={itemsLoaded}
                        organizations={organizations}
                        selectedItem={selectedItem}
                        tables={tables}
                        setSelectedItem={setSelectedItem}
                        youMustBeSignedInModal={youMustBeSignedInModal}
                        buyNowModal={buyNowModal}
                        addToCartModal={addToCartModal}
                    />
                </React.Fragment>
            ))}
        </section>
    );
}
