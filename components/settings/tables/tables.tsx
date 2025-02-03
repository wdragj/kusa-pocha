"use client";

import { Button, Card, CardBody, CardFooter, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import CreateTable from "./createTable";
import EditTable from "./editTable";
import DeleteTable from "./deleteTable";

import { subtitle } from "@/components/primitives";

export interface Table {
    id: number;
    number: number;
    created_at: string;
}

export default function Tables() {
    const [tables, setTables] = useState<Table[]>([]);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);

    // Modal States
    const createTableModal = useDisclosure();
    const deleteTableModal = useDisclosure();
    const editTableModal = useDisclosure();

    // Fetch Tables
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
        fetchTables();
    }, []);

    return (
        <section className="flex flex-col items-center justify-center gap-4 w-full px-4">
            {/* Header with Responsive Layout */}
            <div className="inline-flex items-center gap-x-1">
                <h1 className={subtitle()}>Tables</h1>
                <Button isIconOnly color="primary" radius="full" size="sm" variant="light" onPress={createTableModal.onOpen}>
                    <AddIcon fontSize="small" />
                </Button>
            </div>

            {/* Responsive Grid Layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full max-w-3xl">
                {tables.map((table) => (
                    <Card key={table.id} className="flex w-full sm:w-[140px]" radius="sm">
                        <CardBody className="pb-1">
                            <p className="text-sm font-bold text-center">Table {table.number}</p>
                        </CardBody>
                        <CardFooter className="flex justify-between p-2">
                            <Button
                                isIconOnly
                                color="warning"
                                radius="full"
                                size="sm"
                                variant="light"
                                onPress={() => {
                                    setSelectedTable(table);
                                    editTableModal.onOpen();
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
                                    setSelectedTable(table);
                                    deleteTableModal.onOpen();
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Modals */}
            <CreateTable createTableModal={createTableModal} fetchTables={fetchTables} />
            {selectedTable && (
                <>
                    <EditTable editTableModal={editTableModal} fetchTables={fetchTables} table={selectedTable} />
                    <DeleteTable deleteTableModal={deleteTableModal} fetchTables={fetchTables} table={selectedTable} />
                </>
            )}
        </section>
    );
}
