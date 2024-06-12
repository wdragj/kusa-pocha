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

import { ItemType } from "./itemTypes";

interface EditItemTypeProps {
  editItemTypeModal: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  };
  fetchItemTypes: () => void;
  itemType: ItemType;
}

const EditItemType: React.FC<EditItemTypeProps> = ({
  editItemTypeModal,
  fetchItemTypes,
  itemType,
}) => {
  const { isOpen, onClose } = editItemTypeModal;
  const [editedItemTypeName, setEditedItemTypeName] = useState<string>(
    itemType.name,
  );

  useEffect(() => {
    if (isOpen && itemType) {
      setEditedItemTypeName(itemType.name);
    }
  }, [isOpen, itemType]);

  const iseditedItemTypeNameInvalid = useMemo(
    () => editedItemTypeName === "",
    [editedItemTypeName],
  );

  const handleEditItemType = async () => {
    try {
      const response = await fetch(`/api/itemTypes/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: itemType.id,
          name: editedItemTypeName,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        console.log(
          `Item type edited successfully with id: ${data.id} and name: ${data.name}`,
        );
        fetchItemTypes(); // Fetch item types again to update the list
      }
    } catch (error) {
      console.error(`Failed to edit item type:`, error);
    }
  };

  return (
    <Modal isOpen={isOpen} placement="center" size="xs" onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Edit item type: {editedItemTypeName}
        </ModalHeader>

        <ModalBody>
          <Input
            autoFocus
            isClearable
            isRequired
            color={iseditedItemTypeNameInvalid ? "danger" : "success"}
            description="Name of item type"
            errorMessage={`Please enter a item type name`}
            isInvalid={iseditedItemTypeNameInvalid}
            label="Name"
            placeholder="Type name"
            type="text"
            value={editedItemTypeName}
            variant="bordered"
            onValueChange={setEditedItemTypeName}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button
            color="primary"
            isDisabled={iseditedItemTypeNameInvalid}
            variant="shadow"
            onPress={async () => {
              await handleEditItemType();
              onClose();
            }}
          >
            Change
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditItemType;
