"use client";

import React from "react";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Image, Skeleton } from "@nextui-org/react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import CreateItem from "./createItem";
import DeleteItem from "./deleteItem";
import EditItem from "./editItem";
import YouMustBeSignedIn from "./youMustBeSignedIn";
import BuyNow from "./buyNow";
import AddToCart from "./addToCart";

import { useSession } from "@/context/sessionContext";

interface Item {
    created_at: string;
    id: number;
    img: string;
    name: string;
    organization: string;
    price: number;
    type: string;
}

interface Organization {
    id: number;
    name: string;
    created_at: string;
}

interface ItemType {
    id: number;
    name: string;
    created_at: string;
}

interface Table {
    id: number;
    number: number;
    created_at: string;
}

interface DefaultViewProps {
    items: Item[];
    itemsLoaded: boolean;
    deleteItemModal: any;
    editItemModal: any;
    youMustBeSignedInModal: any;
    buyNowModal: any;
    addToCartModal: any;
    fetchItems: () => Promise<void>;
    itemTypes: ItemType[];
    organizations: Organization[];
    tables: Table[];
    itemTypeToDisplay: string;
    setSelectedItem: React.Dispatch<React.SetStateAction<Item | null>>;
    selectedItem: Item | null;
}

const ItemsDefaultView: React.FC<DefaultViewProps> = ({
    items,
    itemsLoaded,
    deleteItemModal,
    editItemModal,
    youMustBeSignedInModal,
    buyNowModal,
    addToCartModal,
    fetchItems,
    itemTypes,
    organizations,
    tables,
    itemTypeToDisplay,
    setSelectedItem,
    selectedItem,
}) => {
    const { session, isLoading } = useSession();

    return (
        <div className="hidden gap-4 md:grid md:grid-cols-4 md:gap-4 xl:grid-cols-8">
            {session?.role === "admin" && ( // Only admins can create items
                <CreateItem fetchItems={fetchItems} itemTypes={itemTypes} organizations={organizations} />
            )}
            {itemsLoaded
                ? items
                      .filter((item) => item.type === itemTypeToDisplay)
                      .map((item) => (
                          <Card key={item.id} className="col-span-2 sm:col-span-2">
                              <CardHeader className="py-2 px-4 flex flex-row gap-2 justify-between">
                                  <h4 className="font-bold text-large">{item.name}</h4>
                                  {session?.role === "admin" && ( // Only admins can edit/delete
                                      <div className="flex flex-row-reverse gap-2">
                                          <Button
                                              isIconOnly
                                              color="danger"
                                              radius="full"
                                              size="sm"
                                              variant="light"
                                              onPress={() => {
                                                  setSelectedItem(item);
                                                  deleteItemModal.onOpen();
                                              }}
                                          >
                                              <DeleteIcon fontSize="small" />
                                          </Button>
                                          <Button
                                              isIconOnly
                                              color="warning"
                                              radius="full"
                                              size="sm"
                                              variant="light"
                                              onPress={() => {
                                                  setSelectedItem(item);
                                                  editItemModal.onOpen();
                                              }}
                                          >
                                              <EditIcon fontSize="small" />
                                          </Button>
                                      </div>
                                  )}
                              </CardHeader>
                              <Divider />
                              <CardBody className="p-0 m-0 overflow-hidden w-[260px] h-[120px]">
                                  <Image alt="Card background" className="p-0 m-0 object-cover scale-125 rounded-xl" src={item.img} />
                              </CardBody>
                              <Divider />
                              <CardFooter className="px-4 flex flex-row gap-2 justify-between">
                                  <h4 className="font-bold text-large">${item.price}</h4>
                                  <div className="flex flex-row gap-2">
                                      <Button
                                          className="text-tiny"
                                          color="success"
                                          radius="full"
                                          size="sm"
                                          variant="shadow"
                                          onPress={() => {
                                              setSelectedItem(item);
                                              session ? buyNowModal.onOpen() : youMustBeSignedInModal.onOpen(); // Require sign-in
                                          }}
                                      >
                                          Buy Now
                                      </Button>
                                      <Button
                                          color="warning"
                                          radius="full"
                                          size="sm"
                                          variant="shadow"
                                          onPress={() => {
                                              setSelectedItem(item);
                                              session ? addToCartModal.onOpen() : youMustBeSignedInModal.onOpen(); // Require sign-in
                                          }}
                                      >
                                          <ShoppingCartIcon />
                                      </Button>
                                  </div>
                              </CardFooter>
                          </Card>
                      ))
                : Array(1)
                      .fill(0)
                      .map((_, index) => (
                          <Card key={index} className="col-span-2 w-[260px] h-[226px]">
                              <div>
                                  <CardHeader className="h-[48px] py-2 px-4 flex flex-row gap-2">
                                      <Skeleton className="w-2/5 rounded-full">
                                          <div className="h-6 w-2/5 rounded-lg bg-default-300" />
                                      </Skeleton>
                                  </CardHeader>
                                  <CardBody className="py-0 px-4">
                                      <Skeleton className="rounded-lg px-4 bg-default-200">
                                          <div className="h-[120px]" />
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
                      ))}
            <DeleteItem deleteItemModal={deleteItemModal} fetchItems={fetchItems} item={selectedItem!} />
            <EditItem
                editItemModal={editItemModal}
                fetchItems={fetchItems}
                item={selectedItem!}
                itemTypes={itemTypes}
                organizations={organizations}
            />
            <YouMustBeSignedIn youMustBeSignedInModal={youMustBeSignedInModal} />
            <BuyNow
                buyNowModal={buyNowModal}
                fetchItems={fetchItems}
                item={selectedItem!}
                itemTypes={itemTypes}
                organizations={organizations}
                tables={tables}
            />
            <AddToCart
                addToCartModal={addToCartModal}
                fetchItems={fetchItems}
                item={selectedItem!}
                itemTypes={itemTypes}
                organizations={organizations}
                session={session}
            />
        </div>
    );
};

export default ItemsDefaultView;
