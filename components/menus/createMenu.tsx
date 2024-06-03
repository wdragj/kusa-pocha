/* eslint-disable jsx-a11y/no-autofocus */
"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  useDisclosure,
} from "@nextui-org/react";
import { useMemo, useState } from "react";

interface CreateMenuProps {
  fetchMenus: () => Promise<void>;
}

const CreateMenu: React.FC<CreateMenuProps> = ({ fetchMenus }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newMenuName, setNewMenuName] = useState<string>("");
  const [newMenuPrice, setNewMenuPrice] = useState<string>("");
  const [newMenuOrganizationName, setNewMenuOrganizationName] =
    useState<string>("");

  // Validate new menu price that it is not negative (newMenuPrice is a string)
  const validateNewMenuPrice = (newMenuPrice: string) => {
    const numberValue = parseFloat(newMenuPrice);

    return !isNaN(numberValue) && numberValue >= 0;
  };

  const isNewMenuNameInvalid = useMemo(() => newMenuName === "", [newMenuName]);
  const isNewMenuOrganizationNameInvalid = useMemo(
    () => newMenuOrganizationName === "",
    [newMenuOrganizationName],
  );

  const isNewMenuPriceInvalid = useMemo(() => {
    if (newMenuPrice === "") return true;

    return validateNewMenuPrice(newMenuPrice) ? false : true;
  }, [newMenuPrice]);

  // function to handle menu creation
  const handleCreateMenu = async (
    newMenuName: string,
    newMenuPrice: string,
    newMenuOrganizationName: string,
  ) => {
    try {
      const response = await fetch("/api/menu/createMenu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newMenuName,
          price: newMenuPrice,
          organization: newMenuOrganizationName,
          img: "https://nextui.org/images/hero-card.jpeg",
        }),
      });

      if (response.ok) {
        const data = await response.json();

        console.log(
          `Menu created successfully with row count: ${data.rowCount}`,
        );
        fetchMenus(); // Fetch menus again to update the list
      }
    } catch (error) {
      console.error("Failed to create menu:", error);
    }
  };

  return (
    <>
      <Card
        isPressable
        className="col-span-2 w-[260px] h-[226px]"
        onPress={onOpen}
      >
        <div>
          <CardHeader className="h-[48px] py-2 px-4 flex flex-row gap-2 justify-between">
            <Skeleton className="w-2/5 rounded-full">
              <div className="h-6 w-2/5 rounded-lg bg-default-300" />
            </Skeleton>
            Add Menu
          </CardHeader>

          <CardBody className="py-0 px-4">
            <Skeleton className="rounded-lg px-4 bg-default-200 hover:hidden">
              <div className="h-[120px]">
                <p className="z-1">hi</p>
              </div>
            </Skeleton>
          </CardBody>

          <CardFooter className="h-[56px] px-4 flex flex-row gap-2 justify-between">
            <Skeleton className="rounded-full">
              <div className="h-6 w-[65px] rounded-lg bg-default-300" />
            </Skeleton>
            <div className="flex flex-row gap-2">
              <Skeleton className="rounded-full">
                <div className="w-[74.56px] h-[32px] bg-default-300" />
              </Skeleton>
              <Skeleton className="rounded-full">
                <div className="w-[64px] h-[34px] bg-default-300" />
              </Skeleton>
            </div>
          </CardFooter>
        </div>
      </Card>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {newMenuName === "" ? "New Menu" : `New Menu: ${newMenuName}`}
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  isClearable
                  isRequired
                  color={isNewMenuNameInvalid ? "danger" : "success"}
                  description="Name of menu"
                  errorMessage="Please enter a menu name"
                  isInvalid={isNewMenuNameInvalid}
                  label="Menu Name"
                  placeholder="삼겹살"
                  type="text"
                  variant="bordered"
                  onValueChange={setNewMenuName}
                />
                <Input
                  isClearable
                  isRequired
                  color={isNewMenuPriceInvalid ? "danger" : "success"}
                  description="Price of menu. e.g. 12.99"
                  errorMessage="Please enter a price that is greater than or equal to 0.00"
                  isInvalid={isNewMenuPriceInvalid}
                  label="Price"
                  placeholder="0.00"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">$</span>
                    </div>
                  }
                  type="number"
                  variant="bordered"
                  onValueChange={setNewMenuPrice}
                />
                <Input
                  isClearable
                  isRequired
                  color={
                    isNewMenuOrganizationNameInvalid ? "danger" : "success"
                  }
                  description="Name of organization selling the menu"
                  errorMessage="Please enter a organization name"
                  isInvalid={isNewMenuOrganizationNameInvalid}
                  label="Organization Name"
                  placeholder="KUSA"
                  type="text"
                  variant="bordered"
                  onValueChange={setNewMenuOrganizationName}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  isDisabled={
                    isNewMenuNameInvalid ||
                    isNewMenuPriceInvalid ||
                    isNewMenuOrganizationNameInvalid
                  }
                  variant="shadow"
                  onPress={async () => {
                    await handleCreateMenu(
                      newMenuName,
                      newMenuPrice,
                      newMenuOrganizationName,
                    );
                    onClose();
                  }}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateMenu;
