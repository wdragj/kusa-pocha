/* eslint-disable jsx-a11y/no-autofocus */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

interface CreateItemTypeProps {
  createItemTypeModal: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  };
  fetchItemTypes: () => void;
}

const CreateItemType: React.FC<CreateItemTypeProps> = ({
  createItemTypeModal,
  fetchItemTypes,
}) => {
  const { isOpen, onClose } = createItemTypeModal;
  const [newItemTypeName, setNewItemTypeName] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setNewItemTypeName(newItemTypeName);
    }
  }, [isOpen]);

  const isNewItemTypeNameInvalid = useMemo(
    () => newItemTypeName === "",
    [newItemTypeName],
  );

  // Function to reset input values
  const resetInputValues = () => {
    setNewItemTypeName("");
  };

  const handleCreateItemType = async () => {
    try {
      const response = await fetch(`/api/itemTypes/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newItemTypeName,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        console.log(
          `Item type created successfully with id: ${data.id} and name: ${data.name}`,
        );
        fetchItemTypes(); // Fetch item types again to update the list
      }
    } catch (error) {
      console.error(`Failed to create item type:`, error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      placement="center"
      size="xs"
      onOpenChange={(open) => {
        if (!open) resetInputValues();
        onClose();
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col">
          Create Item Type: {newItemTypeName}
        </ModalHeader>

        <ModalBody>
          <Input
            autoFocus
            isClearable
            isRequired
            color={isNewItemTypeNameInvalid ? "danger" : "success"}
            description="Name of item type"
            errorMessage={`Please enter a item type name`}
            isInvalid={isNewItemTypeNameInvalid}
            label="Name"
            placeholder="Item type name"
            type="text"
            value={newItemTypeName}
            variant="bordered"
            onValueChange={setNewItemTypeName}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button
            color="primary"
            isDisabled={isNewItemTypeNameInvalid}
            variant="shadow"
            onPress={async () => {
              await handleCreateItemType();
              onClose();
            }}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateItemType;
