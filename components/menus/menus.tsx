/* eslint-disable jsx-a11y/no-autofocus */
"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  ScrollShadow,
  Skeleton,
  useDisclosure,
} from "@nextui-org/react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { subtitle } from "../primitives";

// Menu components
import CreateItem from "./createItem";
import DeleteItem from "./deleteItem";
// import EditMenu from "./editMenu";
import EditItem from "./editItem";

// Drink components
// import CreateDrink from "./drinks/createDrink";
// import DeleteDrink from "./drinks/deleteDrink";
// import EditDrink from "./drinks/editDrink";

interface Menu {
  id: number;
  name: string;
  price: number;
  organization: string;
  img: string;
  createdAt: string;
}

interface Drinks {
  id: number;
  name: string;
  price: number;
  organization: string;
  img: string;
  createdAt: string;
}

export default function Menus() {
  // Menus state
  const [menus, setMenus] = useState<Menu[]>([]);
  const [menusLoaded, setMenusLoaded] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  // Drinks state
  const [drinks, setDrinks] = useState<Drinks[]>([]);
  const [drinksLoaded, setDrinksLoaded] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState<Drinks | null>(null);

  // Modals for menus
  const deleteMenuModal = useDisclosure(); // Delete menu modal
  const editMenuModal = useDisclosure(); // Edit menu modal

  // Modals for drinks
  const deleteDrinkModal = useDisclosure(); // Delete drink modal
  const editDrinkModal = useDisclosure(); // Edit drink modal

  // Fetch menus from the server
  const fetchMenus = async () => {
    try {
      const response = await fetch("/api/menus/menu");
      const data = await response.json();

      console.log(data);

      setMenus(data);
      setMenusLoaded(true);
    } catch (error) {
      console.error("Failed to fetch menus:", error);
      setMenusLoaded(true);
    }
  };

  // Fetch drinks from the server
  const fetchDrinks = async () => {
    try {
      const response = await fetch("/api/menus/drink");
      const data = await response.json();

      console.log(data);

      setDrinks(data);
      setDrinksLoaded(true);
    } catch (error) {
      console.error("Failed to fetch drinks:", error);
      setDrinksLoaded(true);
    }
  };

  useEffect(() => {
    fetchMenus();
    fetchDrinks();
  }, []); // Empty array ensures it runs only on mount

  return (
    <section className="flex flex-col items-center justify-center gap-4">
      {/*<-------------------- Menu -------------------->*/}
      <h1 className={subtitle()}>Menu</h1>

      {/*<-------------------- Mobile View -------------------->*/}
      <ScrollShadow hideScrollBar className="w-[296px] h-[286px] md:hidden">
        {/* <CreateItem fetchItems={fetchMenus} item="menu" /> */}
        <div className="flex flex-row flex-nowrap gap-4">
          {menusLoaded
            ? menus.map((menu) => (
                <Card
                  key={menu.id}
                  className="flex-shrink-0 w-[260px] h-[280px]"
                >
                  <CardHeader className="py-2 px-4 flex flex-row gap-2 justify-between">
                    <h4 className="font-bold text-large">{menu.name}</h4>
                    <div className="flex flex-row-reverse gap-2">
                      <Button
                        isIconOnly
                        color="danger"
                        radius="full"
                        size="sm"
                        variant="light"
                        onPress={() => {
                          setSelectedMenu(menu);
                          deleteMenuModal.onOpen();
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
                          setSelectedMenu(menu);
                          editMenuModal.onOpen();
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </Button>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody className="p-0 m-0 overflow-hidden w-[260px] h-[120px]">
                    <Image
                      alt="Card background"
                      className="p-0 m-0 object-cover scale-125 rounded-xl"
                      src={menu.img}
                    />
                  </CardBody>
                  <Divider />
                  <CardFooter className="px-4 flex flex-row gap-2 justify-between">
                    <h4 className="font-bold text-large">${menu.price}</h4>
                    <div className="flex flex-row gap-2">
                      <Button
                        className="text-tiny"
                        color="success"
                        radius="full"
                        size="sm"
                        variant="shadow"
                      >
                        Buy Now
                      </Button>
                      <Button
                        color="warning"
                        radius="full"
                        size="sm"
                        variant="shadow"
                      >
                        <ShoppingCartIcon />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            : Array(4)
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
          <DeleteItem
            deleteItemModal={deleteMenuModal}
            fetchItems={fetchMenus}
            item={selectedMenu!} // Non-null assertion since it will be set before modal opens
            itemType="menu"
          />
          <EditItem
            editItemModal={editMenuModal}
            fetchItems={fetchMenus}
            item={selectedMenu!} // Non-null assertion since it will be set before modal opens
            itemType="menu"
          />
        </div>
      </ScrollShadow>

      {/*<-------------------- Default View -------------------->*/}
      <div className="hidden gap-4 md:grid md:grid-cols-4 md:gap-4 xl:grid-cols-8">
        <CreateItem fetchItems={fetchMenus} item="menu" />
        {menusLoaded
          ? menus.map((menu) => (
              <Card key={menu.id} className="col-span-2 sm:col-span-2">
                <CardHeader className="py-2 px-4 flex flex-row gap-2 justify-between">
                  <h4 className="font-bold text-large">{menu.name}</h4>
                  <div className="flex flex-row-reverse gap-2">
                    <Button
                      isIconOnly
                      color="danger"
                      radius="full"
                      size="sm"
                      variant="light"
                      onPress={() => {
                        setSelectedMenu(menu);
                        deleteMenuModal.onOpen();
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
                        setSelectedMenu(menu);
                        editMenuModal.onOpen();
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </Button>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="p-0 m-0 overflow-hidden w-[260px] h-[120px]">
                  <Image
                    alt="Card background"
                    className="p-0 m-0 object-cover scale-125 rounded-xl"
                    src={menu.img}
                  />
                </CardBody>
                <Divider />
                <CardFooter className="px-4 flex flex-row gap-2 justify-between">
                  <h4 className="font-bold text-large">${menu.price}</h4>
                  <div className="flex flex-row gap-2">
                    <Button
                      className="text-tiny"
                      color="success"
                      radius="full"
                      size="sm"
                      variant="shadow"
                    >
                      Buy Now
                    </Button>
                    <Button
                      color="warning"
                      radius="full"
                      size="sm"
                      variant="shadow"
                    >
                      <ShoppingCartIcon />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          : Array(4)
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
        <DeleteItem
          deleteItemModal={deleteMenuModal}
          fetchItems={fetchMenus}
          item={selectedMenu!} // Non-null assertion since it will be set before modal opens
          itemType="menu"
        />
        <EditItem
          editItemModal={editMenuModal}
          fetchItems={fetchMenus}
          item={selectedMenu!} // Non-null assertion since it will be set before modal opens
          itemType="menu"
        />
      </div>
      {/*<---------------------------------------------->*/}

      {/*<-------------------- Drinks -------------------->*/}
      <h1 className={subtitle()}>Drinks</h1>

      {/*<-------------------- Mobile View -------------------->*/}
      <ScrollShadow hideScrollBar className="w-[296px] h-[286px] md:hidden">
        <div className="flex flex-row flex-nowrap gap-4">
          {/* <CreateItem fetchItems={fetchDrinks} item="drink" /> */}
          {drinksLoaded
            ? drinks.map((drink) => (
                <Card
                  key={drink.id}
                  className="flex-shrink-0 w-[260px] h-[280px]"
                >
                  <CardHeader className="py-2 px-4 flex flex-row gap-2 justify-between">
                    <h4 className="font-bold text-large">{drink.name}</h4>
                    <div className="flex flex-row-reverse gap-2">
                      <Button
                        isIconOnly
                        color="danger"
                        radius="full"
                        size="sm"
                        variant="light"
                        onPress={() => {
                          setSelectedDrink(drink);
                          deleteDrinkModal.onOpen();
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
                          setSelectedDrink(drink);
                          editDrinkModal.onOpen();
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </Button>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody className="p-0 m-0 overflow-hidden w-[260px] h-[120px]">
                    <Image
                      alt="Card background"
                      className="p-0 m-0 object-cover scale-125 rounded-xl"
                      src={drink.img}
                    />
                  </CardBody>
                  <Divider />
                  <CardFooter className="px-4 flex flex-row gap-2 justify-between">
                    <h4 className="font-bold text-large">${drink.price}</h4>
                    <div className="flex flex-row gap-2">
                      <Button
                        className="text-tiny"
                        color="success"
                        radius="full"
                        size="sm"
                        variant="shadow"
                      >
                        Buy Now
                      </Button>
                      <Button
                        color="warning"
                        radius="full"
                        size="sm"
                        variant="shadow"
                      >
                        <ShoppingCartIcon />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            : Array(4)
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
          <DeleteItem
            deleteItemModal={deleteDrinkModal}
            fetchItems={fetchDrinks}
            item={selectedDrink!} // Non-null assertion since it will be set before modal opens
            itemType="drink"
          />
          <EditItem
            editItemModal={editDrinkModal}
            fetchItems={fetchDrinks}
            item={selectedDrink!} // Non-null assertion since it will be set before modal opens
            itemType="drink"
          />
        </div>
      </ScrollShadow>

      {/*<-------------------- Default View -------------------->*/}
      <div className="hidden gap-4 md:grid md:grid-cols-4 md:gap-4 xl:grid-cols-8">
        <CreateItem fetchItems={fetchDrinks} item="drink" />
        {drinksLoaded
          ? drinks.map((drink) => (
              <Card key={drink.id} className="col-span-2 sm:col-span-2">
                <CardHeader className="py-2 px-4 flex flex-row gap-2 justify-between">
                  <h4 className="font-bold text-large">{drink.name}</h4>
                  <div className="flex flex-row-reverse gap-2">
                    <Button
                      isIconOnly
                      color="danger"
                      radius="full"
                      size="sm"
                      variant="light"
                      onPress={() => {
                        setSelectedDrink(drink);
                        deleteDrinkModal.onOpen();
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
                        setSelectedDrink(drink);
                        editDrinkModal.onOpen();
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </Button>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="p-0 m-0 overflow-hidden w-[260px] h-[120px]">
                  <Image
                    alt="Card background"
                    className="p-0 m-0 object-cover scale-125 rounded-xl"
                    src={drink.img}
                  />
                </CardBody>
                <Divider />
                <CardFooter className="px-4 flex flex-row gap-2 justify-between">
                  <h4 className="font-bold text-large">${drink.price}</h4>
                  <div className="flex flex-row gap-2">
                    <Button
                      className="text-tiny"
                      color="success"
                      radius="full"
                      size="sm"
                      variant="shadow"
                    >
                      Buy Now
                    </Button>
                    <Button
                      color="warning"
                      radius="full"
                      size="sm"
                      variant="shadow"
                    >
                      <ShoppingCartIcon />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          : Array(4)
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
        <DeleteItem
          deleteItemModal={deleteDrinkModal}
          fetchItems={fetchDrinks}
          item={selectedDrink!} // Non-null assertion since it will be set before modal opens
          itemType="drink"
        />
        <EditItem
          editItemModal={editDrinkModal}
          fetchItems={fetchDrinks}
          item={selectedDrink!} // Non-null assertion since it will be set before modal opens
          itemType="drink"
        />
      </div>
    </section>
  );
}
