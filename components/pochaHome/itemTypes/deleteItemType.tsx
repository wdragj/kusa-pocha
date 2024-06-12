"use client";

import React from "react";
import {
  Button,
  Modal,
  ModalFooter,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";

import { ItemType } from "./itemTypes";

interface DeleteItemTypeProps {
  deleteItemTypeModal: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  };
  fetchItemTypes: () => void;
  itemType: ItemType;
}

const DeleteItemType: React.FC<DeleteItemTypeProps> = ({
  deleteItemTypeModal,
  fetchItemTypes,
  itemType,
}) => {
  const { isOpen, onClose } = deleteItemTypeModal;

  const handleDeleteItemType = async () => {
    try {
      const response = await fetch(`/api/itemTypes/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: itemType.id }),
      });

      if (response.ok) {
        console.log(`Item type deleted successfully with id: ${itemType.id}`);
        fetchItemTypes(); // Fetch item types again to update the list
      }
    } catch (error) {
      console.error(`Failed to delete item type:`, error);
    }
  };

  return (
    <Modal isOpen={isOpen} placement="center" size="xs" onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Delete {itemType.name}?
        </ModalHeader>
        <ModalFooter className="justify-center gap-4">
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button
            color="danger"
            variant="shadow"
            onPress={async () => {
              await handleDeleteItemType();
              onClose();
            }}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteItemType;
