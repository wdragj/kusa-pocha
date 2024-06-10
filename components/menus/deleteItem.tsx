"use client";

import React from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

interface DeleteItemProps {
  deleteItemModal: {
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
}

const DeleteItem: React.FC<DeleteItemProps> = ({
  deleteItemModal,
  fetchItems,
  item,
}) => {
  const { isOpen, onClose } = deleteItemModal;

  // console.log("Item to delete:", item);

  // function to handle item deletion
  const handleDeleteItem = async () => {
    try {
      const response = await fetch(`/api/items/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: item.id }),
      });

      if (response.ok) {
        const data = await response.json();

        console.log(data.message);

        fetchItems();
      }
    } catch (error) {
      console.error(`Failed to delete item:`, error);
    }
  };

  return (
    <Modal isOpen={isOpen} placement="center" size="xs" onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Delete {item ? `"${item.name}" ?` : ""}
        </ModalHeader>
        <ModalFooter className="justify-center gap-4">
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button
            color="danger"
            variant="shadow"
            onPress={async () => {
              await handleDeleteItem();
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

export default DeleteItem;
