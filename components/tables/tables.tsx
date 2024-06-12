"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import EditTable from "./editTable";
import DeleteTable from "./deleteTable";
import CreateTable from "./createTable";

import { subtitle } from "@/components/primitives";

export interface Table {
  id: number;
  number: number;
  created_at: string;
}

export default function Tables() {
  // Tables state
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  // Modals for items
  const createTableModal = useDisclosure(); // Create table modal
  const deleteTableModal = useDisclosure(); // Delete table modal
  const editTableModal = useDisclosure(); // Edit table modal

  // Fetch tables from the server
  const fetchTables = async () => {
    try {
      const response = await fetch("/api/tables");
      const data = await response.json();

      console.log(data);

      setTables(data);
    } catch (error) {
      console.error("Failed to fetch tables:", error);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []); // Empty array ensures it runs only on mount

  return (
    <section className="flex flex-col items-center justify-center gap-2">
      <div className="flex flex-row items-center justify-center gap-1">
        <h1 className={subtitle()}>Tables</h1>
        <Button
          isIconOnly
          color="primary"
          radius="full"
          size="sm"
          variant="light"
          onPress={() => {
            createTableModal.onOpen();
          }}
        >
          <AddIcon fontSize="small" />
        </Button>
      </div>
      <div className="flex flex-row items-center justify-center gap-4">
        {tables.map((table) => (
          <Card key={table.id} className="flex w-[130px]" radius="sm">
            <CardBody className="pb-1">
              <p className="text-sm font-bold text-center">
                Table {table.number}
              </p>
            </CardBody>
            <CardFooter className="flex flex-row justify-around pt-0">
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

        {selectedTable && (
          <>
            <EditTable
              editTableModal={editTableModal}
              fetchTables={fetchTables}
              table={selectedTable!} // Non-null assertion since it will be set before modal opens
            />
            <DeleteTable
              deleteTableModal={deleteTableModal}
              fetchTables={fetchTables}
              table={selectedTable}
            />
          </>
        )}
      </div>
      <CreateTable
        createTableModal={createTableModal}
        fetchTables={fetchTables}
      />
    </section>
  );
}
