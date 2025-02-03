"use client";

import React from "react";
import {
  Button,
  Modal,
  ModalFooter,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";

interface Table {
  id: number;
  number: number;
  created_at: string;
}

interface DeleteTableProps {
  deleteTableModal: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  };
  fetchTables: () => void;
  table: Table | null;
}

const DeleteTable: React.FC<DeleteTableProps> = ({
  deleteTableModal,
  fetchTables,
  table,
}) => {
  const { isOpen, onClose } = deleteTableModal;

  const handleDeleteTable = async () => {
    try {
      const response = await fetch(`/api/tables/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: table?.id,
        }),
      });

      if (response.ok) {
        console.log(`Table deleted successfully with id: ${table?.id}`);
        fetchTables(); // Fetch tables again to update the list
      }
    } catch (error) {
      console.error(`Failed to delete table:`, error);
    }
  };

  return (
    <Modal isOpen={isOpen} placement="center" size="xs" onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Delete table {table?.number}?
        </ModalHeader>
        <ModalFooter className="justify-center gap-4">
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button
            color="danger"
            variant="shadow"
            onPress={async () => {
              await handleDeleteTable();
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

export default DeleteTable;
