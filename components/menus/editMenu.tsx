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

interface EditMenuProps {
  editMenuModal: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  };
  fetchMenus: () => void;
  menu: {
    id: number;
    name: string;
    price: number;
    organization: string;
    img: string;
    createdAt: string;
  };
}

const EditMenu: React.FC<EditMenuProps> = ({
  editMenuModal,
  fetchMenus,
  menu,
}) => {
  const { isOpen, onClose } = editMenuModal;
  const [editedMenuName, setEditedMenuName] = useState<string>("");
  const [editedMenuPrice, setEditedMenuPrice] = useState<string>("0.00");
  const [editedMenuOrganizationName, setEditedMenuOrganizationName] =
    useState<string>("");

  useEffect(() => {
    if (isOpen && menu) {
      setEditedMenuName(menu.name);
      setEditedMenuPrice(menu.price.toString());
      setEditedMenuOrganizationName(menu.organization);
    }
  }, [isOpen, menu]);

  // Validate new menu price that it is not negative (editedMenuPrice is a string)
  const validateeditedMenuPrice = (editedMenuPrice: string) => {
    const numberValue = parseFloat(editedMenuPrice);

    return !isNaN(numberValue) && numberValue >= 0;
  };

  const iseditedMenuNameInvalid = useMemo(
    () => editedMenuName === "",
    [editedMenuName],
  );
  const iseditedMenuOrganizationNameInvalid = useMemo(
    () => editedMenuOrganizationName === "",
    [editedMenuOrganizationName],
  );

  const iseditedMenuPriceInvalid = useMemo(() => {
    if (editedMenuPrice === "") return true;

    return validateeditedMenuPrice(editedMenuPrice) ? false : true;
  }, [editedMenuPrice]);

  // function to handle menu edit
  const handleEditMenu = async () => {
    try {
      const response = await fetch("/api/menu/editMenu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          menuId: menu.id,
          editedName: editedMenuName,
          editedPrice: editedMenuPrice,
          editedOrganization: editedMenuOrganizationName,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        console.log(`Menu edited successfully on menuId: ${data.updatedId}`);
        fetchMenus();
      }
    } catch (error) {
      console.error("Error deleting menu:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Edit menu: {editedMenuName}
        </ModalHeader>

        <ModalBody>
          <Input
            autoFocus
            isClearable
            isRequired
            color={iseditedMenuNameInvalid ? "danger" : "success"}
            description="Name of menu"
            errorMessage="Please enter a menu name"
            isInvalid={iseditedMenuNameInvalid}
            label="Menu Name"
            placeholder="삼겹살"
            type="text"
            value={editedMenuName}
            variant="bordered"
            onValueChange={setEditedMenuName}
          />
          <Input
            isClearable
            isRequired
            color={iseditedMenuPriceInvalid ? "danger" : "success"}
            description="Price of menu. e.g. 12.99"
            errorMessage="Please enter a price that is greater than or equal to 0.00"
            isInvalid={iseditedMenuPriceInvalid}
            label="Price"
            placeholder="0.00"
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">$</span>
              </div>
            }
            type="number"
            value={editedMenuPrice}
            variant="bordered"
            onValueChange={setEditedMenuPrice}
          />
          <Input
            isClearable
            isRequired
            color={iseditedMenuOrganizationNameInvalid ? "danger" : "success"}
            description="Name of organization selling the menu"
            errorMessage="Please enter a organization name"
            isInvalid={iseditedMenuOrganizationNameInvalid}
            label="Organization Name"
            placeholder="KUSA"
            type="text"
            value={editedMenuOrganizationName}
            variant="bordered"
            onValueChange={setEditedMenuOrganizationName}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button
            color="primary"
            isDisabled={
              iseditedMenuNameInvalid ||
              iseditedMenuPriceInvalid ||
              iseditedMenuOrganizationNameInvalid
            }
            variant="shadow"
            onPress={async () => {
              await handleEditMenu();
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

export default EditMenu;
