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

interface EditItemProps {
  editItemModal: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  };
  fetchItems: () => void;
  item: {
    id: number;
    name: string;
    price: number;
    organization: string;
    img: string;
    createdAt: string;
  };
  itemType: string;
}

const EditItem: React.FC<EditItemProps> = ({
  editItemModal,
  fetchItems,
  item,
  itemType,
}) => {
  const { isOpen, onClose } = editItemModal;
  const [editedItemName, setEditedItemName] = useState<string>("");
  const [editedItemPrice, setEditedItemPrice] = useState<string>("0.00");
  const [editedItemOrganizationName, setEditedItemOrganizationName] =
    useState<string>("");

  useEffect(() => {
    if (isOpen && item) {
      setEditedItemName(item.name);
      setEditedItemPrice(item.price.toString());
      setEditedItemOrganizationName(item.organization);
    }
  }, [isOpen, item]);

  // Validate new item price that it is not negative (editedItemPrice is a string)
  const validateeditedItemPrice = (editedItemPrice: string) => {
    const numberValue = parseFloat(editedItemPrice);

    return !isNaN(numberValue) && numberValue >= 0;
  };

  const iseditedItemNameInvalid = useMemo(
    () => editedItemName === "",
    [editedItemName],
  );
  const iseditedItemOrganizationNameInvalid = useMemo(
    () => editedItemOrganizationName === "",
    [editedItemOrganizationName],
  );

  const iseditedItemPriceInvalid = useMemo(() => {
    if (editedItemPrice === "") return true;

    return validateeditedItemPrice(editedItemPrice) ? false : true;
  }, [editedItemPrice]);

  // function to handle item edit
  const handleEditItem = async () => {
    try {
      const response = await fetch(`/api/menus/${itemType}/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: item.id,
          editedName: editedItemName,
          editedPrice: editedItemPrice,
          editedOrganization: editedItemOrganizationName,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        console.log(
          `${itemType} edited successfully on ${itemType}Id: ${data.updatedId}`,
        );
        fetchItems();
      }
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error);
    }
  };

  return (
    <Modal isOpen={isOpen} placement="center" size="xs" onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Edit {itemType}: {editedItemName}
        </ModalHeader>

        <ModalBody>
          <Input
            autoFocus
            isClearable
            isRequired
            color={iseditedItemNameInvalid ? "danger" : "success"}
            description={`Name of ${itemType}`}
            errorMessage={`Please enter a ${itemType} name`}
            isInvalid={iseditedItemNameInvalid}
            label="Name"
            placeholder="삼겹살"
            type="text"
            value={editedItemName}
            variant="bordered"
            onValueChange={setEditedItemName}
          />
          <Input
            isClearable
            isRequired
            color={iseditedItemPriceInvalid ? "danger" : "success"}
            description={`Price of ${itemType}. e.g. 12.99`}
            errorMessage="Please enter a price that is greater than or equal to 0.00"
            isInvalid={iseditedItemPriceInvalid}
            label="Price"
            placeholder="0.00"
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">$</span>
              </div>
            }
            type="number"
            value={editedItemPrice}
            variant="bordered"
            onValueChange={setEditedItemPrice}
          />
          <Input
            isClearable
            isRequired
            color={iseditedItemOrganizationNameInvalid ? "danger" : "success"}
            description={`Name of organization selling the ${itemType}`}
            errorMessage="Please enter a organization name"
            isInvalid={iseditedItemOrganizationNameInvalid}
            label="Organization name"
            placeholder="KUSA"
            type="text"
            value={editedItemOrganizationName}
            variant="bordered"
            onValueChange={setEditedItemOrganizationName}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button
            color="primary"
            isDisabled={
              iseditedItemNameInvalid ||
              iseditedItemPriceInvalid ||
              iseditedItemOrganizationNameInvalid
            }
            variant="shadow"
            onPress={async () => {
              await handleEditItem();
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

export default EditItem;
