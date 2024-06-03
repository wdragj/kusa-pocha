"use client";

import React from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

interface DeleteMenuProps {
  deleteMenuModal: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  };
  fetchMenus: () => void;
  menuId: number;
  menuName: string;
}

const DeleteMenu: React.FC<DeleteMenuProps> = ({
  deleteMenuModal,
  fetchMenus,
  menuId,
  menuName,
}) => {
  const { isOpen, onClose } = deleteMenuModal;

  // function to handle menu deletion
  const handleDeleteMenu = async () => {
    try {
      const response = await fetch("/api/menu/deleteMenu", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ menuId }),
      });

      if (response.ok) {
        const data = await response.json();

        console.log(`Menu deleted successfully with menuId: ${data.deletedId}`);

        fetchMenus();
      }
    } catch (error) {
      console.error("Error deleting menu:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} size="xs" onOpenChange={onClose}>
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">
            Delete menu: {menuName}?
          </ModalHeader>
          <ModalFooter className="justify-center gap-4">
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button
              color="primary"
              onPress={async () => {
                await handleDeleteMenu();
                onClose();
              }}
            >
              Delete
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default DeleteMenu;
