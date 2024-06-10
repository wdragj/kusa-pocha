/* eslint-disable jsx-a11y/no-autofocus */
"use client";

import React, { useEffect, useState } from "react";
import { useDisclosure } from "@nextui-org/react";

import { subtitle } from "../primitives";

// Modal components
import ItemsDefaultView from "./itemsDefaultView";

import { createClient } from "@/utils/supabase/client";

interface SessionData {
  accessToken: string;
  id: string;
  name: string;
  email: string;
  image: string;
}

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

export default function Menus() {
  const supabase = createClient();
  const [session, setSession] = useState<SessionData | null>(null);

  // useEffect to fetch session data
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        // console.log(data);

        setSession({
          accessToken: data.session.access_token,
          id: data.session.user.id,
          name: data.session.user.user_metadata.full_name,
          email: data.session.user.user_metadata.email,
          image: data.session.user.user_metadata.avatar_url,
        });
      }
    };

    fetchSession();
  }, []);

  // Items state
  const [items, setItems] = useState<Item[]>([]);
  const [itemsLoaded, setItemsLoaded] = useState(false);

  // Organizations state
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  // Item types state
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);

  // Modals for items
  const deleteItemModal = useDisclosure(); // Delete item modal
  const editItemModal = useDisclosure(); // Edit item modal

  // Modal for signed out users
  const youMustBeSignedInModal = useDisclosure(); // You must be signed in modal

  // Fetch items from the server
  const fetchItems = async () => {
    try {
      const response = await fetch("/api/items");
      const data = await response.json();

      console.log(data);

      setItems(data);
      setItemsLoaded(true);
    } catch (error) {
      console.error("Failed to fetch menus:", error);
      setItemsLoaded(true);
    }
  };

  // Fetch organizations from the server
  const fetchOrganizations = async () => {
    try {
      const response = await fetch("/api/organizations");
      const data = await response.json();

      console.log(data);

      setOrganizations(data);
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
    }
  };

  // Fetch item types from the server
  const fetchItemTypes = async () => {
    try {
      const response = await fetch("/api/itemTypes");
      const data = await response.json();

      console.log(data);

      setItemTypes(data);
    } catch (error) {
      console.error("Failed to fetch item types:", error);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchOrganizations();
    fetchItemTypes();
  }, []); // Empty array ensures it runs only on mount

  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <h1 className={subtitle()}>Foods</h1>

      {/*<-------------------- Mobile View -------------------->*/}
      {/* <ScrollShadow hideScrollBar className="w-[296px] h-[286px] md:hidden">
        <CreateItem fetchItems={fetchMenus} item="menu" />
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
                          setSelectedMenu(menu);
                          editItemModal.onOpen();
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
            deleteItemModal={deleteItemModal}
            fetchItems={fetchMenus}
            item={selectedMenu!} // Non-null assertion since it will be set before modal opens
            itemType="menu"
          />
          <EditItem
            editItemModal={editItemModal}
            fetchItems={fetchMenus}
            item={selectedMenu!} // Non-null assertion since it will be set before modal opens
            itemType="menu"
          />
        </div>
      </ScrollShadow> */}

      <ItemsDefaultView
        deleteItemModal={deleteItemModal}
        editItemModal={editItemModal}
        fetchItems={fetchItems}
        itemTypeToDisplay="Food"
        itemTypes={itemTypes}
        items={items}
        itemsLoaded={itemsLoaded}
        organizations={organizations}
        session={session}
        youMustBeSignedInModal={youMustBeSignedInModal}
      />

      <h1 className={subtitle()}>Drinks</h1>

      {/*<-------------------- Mobile View -------------------->*/}
      {/* <ScrollShadow hideScrollBar className="w-[296px] h-[286px] md:hidden">
        <div className="flex flex-row flex-nowrap gap-4">
          <CreateItem fetchItems={fetchDrinks} item="drink" />
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
      </ScrollShadow> */}

      <ItemsDefaultView
        deleteItemModal={deleteItemModal}
        editItemModal={editItemModal}
        fetchItems={fetchItems}
        itemTypeToDisplay="Drink"
        itemTypes={itemTypes}
        items={items}
        itemsLoaded={itemsLoaded}
        organizations={organizations}
        session={session}
        youMustBeSignedInModal={youMustBeSignedInModal}
      />
    </section>
  );
}
