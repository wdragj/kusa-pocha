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
  // ItemTypes state
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
  const [selectedItemType, setSelectedItemType] = useState<ItemType | null>(
    null,
  );

  // Modals for item types
  const createItemTypeModal = useDisclosure(); // Create item type modal
  const deleteItemTypeModal = useDisclosure(); // Delete item type modal
  const editItemTypeModal = useDisclosure(); // Edit item type modal

  // Fetch item types from the server
  const fetchItemTypes = async () => {
    try {
      const response = await fetch("/api/itemTypes");
      const data = await response.json();

      console.log(data);

      setItemTypes(data);
    } catch (error) {
      console.error("Failed to fetch item types:", error);
    }
  };

  useEffect(() => {
    fetchItemTypes();
  }, []); // Empty array ensures it runs only on mount

  return (
    <section className="flex flex-col items-center justify-center gap-2">
      <div className="flex flex-row items-center justify-center gap-1">
        <h1 className={subtitle()}>Item Types</h1>
        <Button
          isIconOnly
          color="primary"
          radius="full"
          size="sm"
          variant="light"
          onPress={() => {
            createItemTypeModal.onOpen();
          }}
        >
          <AddIcon fontSize="small" />
        </Button>
      </div>
      <div className="flex flex-row items-center justify-center gap-4">
        {itemTypes.map((itemType) => (
          <Card key={itemType.id} className="flex w-[130px]" radius="sm">
            <CardBody className="pb-1">
              <p className="text-sm font-bold text-center">{itemType.name}</p>
            </CardBody>
            <CardFooter className="flex flex-row justify-around pt-0">
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

        {selectedItemType && (
          <>
            <EditItemType
              editItemTypeModal={editItemTypeModal}
              fetchItemTypes={fetchItemTypes}
              itemType={selectedItemType!} // Non-null assertion since it will be set before modal opens
            />
            <DeleteItemType
              deleteItemTypeModal={deleteItemTypeModal}
              fetchItemTypes={fetchItemTypes}
              itemType={selectedItemType}
            />
          </>
        )}
      </div>
      <CreateItemType
        createItemTypeModal={createItemTypeModal}
        fetchItemTypes={fetchItemTypes}
      />
    </section>
  );
}
