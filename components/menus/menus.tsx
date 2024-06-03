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

import CreateMenu from "./createMenu";
import DeleteMenu from "./deleteMenu";

interface Menu {
  id: number;
  name: string;
  price: number;
  organization: string;
  img: string;
  createdAt: string;
}

export default function Menus() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [menusLoaded, setMenusLoaded] = useState(false);
  const deleteMenuModal = useDisclosure();
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);
  const [selectedMenuName, setSelectedMenuName] = useState<string>("");

  // Fetch menus from the server
  const fetchMenus = async () => {
    try {
      const response = await fetch("/api/menu");
      const data = await response.json();

      console.log(data);

      setMenus(data);
      setMenusLoaded(true);
    } catch (error) {
      console.error("Failed to fetch menus:", error);
      setMenusLoaded(true);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []); // Empty array ensures it runs only on mount

  return (
    <section className="flex flex-col items-center justify-center gap-4">
      {/*<-------------------- Menu -------------------->*/}
      <h1 className={subtitle()}>Menu</h1>

      {/*<-------------------- Mobile View -------------------->*/}
      <ScrollShadow hideScrollBar className="w-[296px] h-[286px] md:hidden">
        <div className="flex flex-row flex-nowrap gap-4">
          <Card className="flex-shrink-0 w-[260px] h-[280px]">
            <CardHeader className="py-2 px-4 flex flex-row gap-2 justify-between">
              <h4 className="font-bold text-large">나가사끼 짬뽕</h4>
              <div className="flex flex-row-reverse gap-2">
                <Button isIconOnly color="primary" radius="full" size="sm">
                  <DeleteIcon fontSize="small" />
                </Button>
                <Button isIconOnly color="primary" radius="full" size="sm">
                  <EditIcon fontSize="small" />
                </Button>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="p-0 m-0 overflow-hidden w-[304px] h-[180px]">
              <Image
                alt="Card background"
                className="p-0 m-0 object-cover scale-125 rounded-xl"
                src="https://nextui.org/images/hero-card-complete.jpeg"
                // src="https://nextui.org/images/card-example-6.jpeg"
              />
            </CardBody>
            <Divider />
            <CardFooter className="px-4 flex flex-row gap-2 justify-between">
              <h4 className="font-bold text-large">$12.99</h4>
              <div className="flex flex-row gap-2">
                <Button
                  className="text-tiny"
                  color="primary"
                  radius="full"
                  size="sm"
                >
                  Buy Now
                </Button>
                <Button color="primary" radius="full" size="sm">
                  <ShoppingCartIcon />
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card className="flex-shrink-0 w-[260px] h-[280px]">
            <CardHeader className="py-2 px-4 flex flex-row gap-2 justify-between">
              <h4 className="font-bold text-large">김치찌게</h4>
              <div className="flex flex-row-reverse gap-2">
                <Button isIconOnly color="primary" radius="full" size="sm">
                  <DeleteIcon fontSize="small" />
                </Button>
                <Button isIconOnly color="primary" radius="full" size="sm">
                  <EditIcon fontSize="small" />
                </Button>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="p-0 m-0 overflow-hidden w-[304px] h-[180px]">
              <Image
                alt="Card background"
                className="p-0 m-0 object-cover scale-125 rounded-xl"
                // src="https://nextui.org/images/hero-card-complete.jpeg"
                src="https://nextui.org/images/card-example-6.jpeg"
              />
            </CardBody>
            <Divider />
            <CardFooter className="px-4 flex flex-row gap-2 justify-between">
              <h4 className="font-bold text-large">$12.99</h4>
              <div className="flex flex-row gap-2">
                <Button
                  className="text-tiny"
                  color="primary"
                  radius="full"
                  size="sm"
                >
                  Buy Now
                </Button>
                <Button color="primary" radius="full" size="sm">
                  <ShoppingCartIcon />
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card className="flex-shrink-0 w-[260px] h-[280px]">
            <CardHeader className="py-2 px-4 flex flex-row gap-2 justify-between">
              <h4 className="font-bold text-large">김치찌게</h4>
              <div className="flex flex-row-reverse gap-2">
                <Button isIconOnly color="primary" radius="full" size="sm">
                  <DeleteIcon fontSize="small" />
                </Button>
                <Button isIconOnly color="primary" radius="full" size="sm">
                  <EditIcon fontSize="small" />
                </Button>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="p-0 m-0 overflow-hidden w-[304px] h-[180px]">
              <Image
                alt="Card background"
                className="p-0 m-0 object-cover scale-125 rounded-xl"
                // src="https://nextui.org/images/hero-card-complete.jpeg"
                src="https://nextui.org/images/card-example-6.jpeg"
              />
            </CardBody>
            <Divider />
            <CardFooter className="px-4 flex flex-row gap-2 justify-between">
              <h4 className="font-bold text-large">$12.99</h4>
              <div className="flex flex-row gap-2">
                <Button
                  className="text-tiny"
                  color="primary"
                  radius="full"
                  size="sm"
                >
                  Buy Now
                </Button>
                <Button color="primary" radius="full" size="sm">
                  <ShoppingCartIcon />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </ScrollShadow>

      {/*<-------------------- Default View -------------------->*/}
      <div className="hidden gap-4 md:grid md:grid-cols-4 md:gap-4 xl:grid-cols-8">
        {menusLoaded
          ? menus.map((menu) => (
              <Card key={menu.id} className="col-span-2 sm:col-span-2">
                <CardHeader className="py-2 px-4 flex flex-row gap-2 justify-between">
                  <h4 className="font-bold text-large">{menu.name}</h4>
                  <div className="flex flex-row-reverse gap-2">
                    <Button
                      isIconOnly
                      color="primary"
                      radius="full"
                      size="sm"
                      onPress={() => {
                        setSelectedMenuId(menu.id);
                        setSelectedMenuName(menu.name);
                        deleteMenuModal.onOpen();
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </Button>
                    <Button isIconOnly color="primary" radius="full" size="sm">
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
                      color="primary"
                      radius="full"
                      size="sm"
                    >
                      Buy Now
                    </Button>
                    <Button color="primary" radius="full" size="sm">
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
        <DeleteMenu
          deleteMenuModal={deleteMenuModal}
          fetchMenus={fetchMenus}
          menuId={selectedMenuId!} // Non-null assertion since it will be set before modal opens
          menuName={selectedMenuName}
        />
        <CreateMenu fetchMenus={fetchMenus} />
      </div>
      {/*<---------------------------------------------->*/}

      {/*<-------------------- Drinks -------------------->*/}
      <h1 className={subtitle()}>Drinks</h1>

      {/*<-------------------- Mobile View -------------------->*/}
      <ScrollShadow hideScrollBar className="w-[296px] h-[286px] md:hidden">
        <div className="flex flex-row flex-nowrap gap-4">
          <Card className="flex-shrink-0 w-[260px] h-[280px]">
            <CardHeader className="py-2 px-4 flex flex-row gap-2 justify-between">
              <h4 className="font-bold text-large">소주</h4>
              <div className="flex flex-row-reverse gap-2">
                <Button isIconOnly color="primary" radius="full" size="sm">
                  <DeleteIcon fontSize="small" />
                </Button>
                <Button isIconOnly color="primary" radius="full" size="sm">
                  <EditIcon fontSize="small" />
                </Button>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="p-0 m-0 overflow-hidden w-[304px] h-[180px]">
              <Image
                alt="Card background"
                className="p-0 m-0 object-cover scale-125 rounded-xl"
                src="https://nextui.org/images/hero-card-complete.jpeg"
                // src="https://nextui.org/images/card-example-6.jpeg"
              />
            </CardBody>
            <Divider />
            <CardFooter className="px-4 flex flex-row gap-2 justify-between">
              <h4 className="font-bold text-large">$12.99</h4>
              <div className="flex flex-row gap-2">
                <Button
                  className="text-tiny"
                  color="primary"
                  radius="full"
                  size="sm"
                >
                  Buy Now
                </Button>
                <Button color="primary" radius="full" size="sm">
                  <ShoppingCartIcon />
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card className="flex-shrink-0 w-[260px] h-[280px]">
            <CardHeader className="py-2 px-4 flex flex-row gap-2 justify-between">
              <h4 className="font-bold text-large">맥주</h4>
              <div className="flex flex-row-reverse gap-2">
                <Button isIconOnly color="primary" radius="full" size="sm">
                  <DeleteIcon fontSize="small" />
                </Button>
                <Button isIconOnly color="primary" radius="full" size="sm">
                  <EditIcon fontSize="small" />
                </Button>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="p-0 m-0 overflow-hidden w-[304px] h-[180px]">
              <Image
                alt="Card background"
                className="p-0 m-0 object-cover scale-125 rounded-xl"
                // src="https://nextui.org/images/hero-card-complete.jpeg"
                src="https://nextui.org/images/card-example-6.jpeg"
              />
            </CardBody>
            <Divider />
            <CardFooter className="px-4 flex flex-row gap-2 justify-between">
              <h4 className="font-bold text-large">$12.99</h4>
              <div className="flex flex-row gap-2">
                <Button
                  className="text-tiny"
                  color="primary"
                  radius="full"
                  size="sm"
                >
                  Buy Now
                </Button>
                <Button color="primary" radius="full" size="sm">
                  <ShoppingCartIcon />
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card className="flex-shrink-0 w-[260px] h-[280px]">
            <CardHeader className="py-2 px-4 flex flex-row gap-2 justify-between">
              <h4 className="font-bold text-large">콜라</h4>
              <div className="flex flex-row-reverse gap-2">
                <Button isIconOnly color="primary" radius="full" size="sm">
                  <DeleteIcon fontSize="small" />
                </Button>
                <Button isIconOnly color="primary" radius="full" size="sm">
                  <EditIcon fontSize="small" />
                </Button>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="p-0 m-0 overflow-hidden w-[304px] h-[180px]">
              <Image
                alt="Card background"
                className="p-0 m-0 object-cover scale-125 rounded-xl"
                // src="https://nextui.org/images/hero-card-complete.jpeg"
                src="https://nextui.org/images/card-example-6.jpeg"
              />
            </CardBody>
            <Divider />
            <CardFooter className="px-4 flex flex-row gap-2 justify-between">
              <h4 className="font-bold text-large">$12.99</h4>
              <div className="flex flex-row gap-2">
                <Button
                  className="text-tiny"
                  color="primary"
                  radius="full"
                  size="sm"
                >
                  Buy Now
                </Button>
                <Button color="primary" radius="full" size="sm">
                  <ShoppingCartIcon />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </ScrollShadow>

      {/*<-------------------- Default View -------------------->*/}
      <div className="hidden gap-4 md:grid md:grid-cols-4 md:gap-4 xl:grid-cols-8">
        <Card className="col-span-2 sm:col-span-2">
          <CardHeader className="py-2 px-4 flex flex-row gap-2 justify-between">
            <h4 className="font-bold text-large">소주</h4>
            <div className="flex flex-row-reverse gap-2">
              <Button isIconOnly color="primary" radius="full" size="sm">
                <DeleteIcon fontSize="small" />
              </Button>
              <Button isIconOnly color="primary" radius="full" size="sm">
                <EditIcon fontSize="small" />
              </Button>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="p-0 m-0 overflow-hidden w-[260px] h-[120px]">
            <Image
              alt="Card background"
              className="p-0 m-0 object-cover scale-125 rounded-xl"
              src="https://nextui.org/images/hero-card-complete.jpeg"
              // src="https://nextui.org/images/card-example-6.jpeg"
            />
          </CardBody>
          <Divider />
          <CardFooter className="px-4 flex flex-row gap-2 justify-between">
            <h4 className="font-bold text-large">$12.99</h4>
            <div className="flex flex-row gap-2">
              <Button
                className="text-tiny"
                color="primary"
                radius="full"
                size="sm"
              >
                Buy Now
              </Button>
              <Button color="primary" radius="full" size="sm">
                <ShoppingCartIcon />
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card className="col-span-2 sm:col-span-2">
          <CardHeader className="py-2 px-4 flex flex-row gap-2 justify-between">
            <h4 className="font-bold text-large">맥주</h4>
            <div className="flex flex-row-reverse gap-2">
              <Button isIconOnly color="primary" radius="full" size="sm">
                <DeleteIcon fontSize="small" />
              </Button>
              <Button isIconOnly color="primary" radius="full" size="sm">
                <EditIcon fontSize="small" />
              </Button>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="p-0 m-0 overflow-hidden w-[260px] h-[120px]">
            <Image
              alt="Card background"
              className="p-0 m-0 object-cover scale-125 rounded-xl"
              // src="https://nextui.org/images/hero-card-complete.jpeg"
              src="https://nextui.org/images/card-example-6.jpeg"
            />
          </CardBody>
          <Divider />
          <CardFooter className="px-4 flex flex-row gap-2 justify-between">
            <h4 className="font-bold text-large">$12.99</h4>
            <div className="flex flex-row gap-2">
              <Button
                className="text-tiny"
                color="primary"
                radius="full"
                size="sm"
              >
                Buy Now
              </Button>
              <Button color="primary" radius="full" size="sm">
                <ShoppingCartIcon />
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card className="col-span-2 sm:col-span-2">
          <CardHeader className="py-2 px-4 flex flex-row gap-2 justify-between">
            <h4 className="font-bold text-large">콜라</h4>
            <div className="flex flex-row-reverse gap-2">
              <Button isIconOnly color="primary" radius="full" size="sm">
                <DeleteIcon fontSize="small" />
              </Button>
              <Button isIconOnly color="primary" radius="full" size="sm">
                <EditIcon fontSize="small" />
              </Button>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="p-0 m-0 overflow-hidden w-[260px] h-[120px]">
            <Image
              alt="Card background"
              className="p-0 m-0 object-cover scale-125 rounded-xl"
              src="https://nextui.org/images/hero-card-complete.jpeg"
              // src="https://nextui.org/images/card-example-6.jpeg"
            />
          </CardBody>
          <Divider />
          <CardFooter className="px-4 flex flex-row gap-2 justify-between">
            <h4 className="font-bold text-large">$12.99</h4>
            <div className="flex flex-row gap-2">
              <Button
                className="text-tiny"
                color="primary"
                radius="full"
                size="sm"
              >
                Buy Now
              </Button>
              <Button color="primary" radius="full" size="sm">
                <ShoppingCartIcon />
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card className="col-span-2 sm:col-span-2">
          <CardHeader className="py-2 px-4 flex flex-row gap-2 justify-between">
            <h4 className="font-bold text-large">사이다</h4>
            <div className="flex flex-row-reverse gap-2">
              <Button isIconOnly color="primary" radius="full" size="sm">
                <DeleteIcon fontSize="small" />
              </Button>
              <Button isIconOnly color="primary" radius="full" size="sm">
                <EditIcon fontSize="small" />
              </Button>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="p-0 m-0 overflow-hidden w-[260px] h-[120px]">
            <Image
              alt="Card background"
              className="p-0 m-0 object-cover scale-125 rounded-xl"
              // src="https://nextui.org/images/hero-card-complete.jpeg"
              src="https://nextui.org/images/card-example-6.jpeg"
            />
          </CardBody>
          <Divider />
          <CardFooter className="px-4 flex flex-row gap-2 justify-between">
            <h4 className="font-bold text-large">$9</h4>
            <div className="flex flex-row gap-2">
              <Button
                className="text-tiny"
                color="primary"
                radius="full"
                size="sm"
              >
                Buy Now
              </Button>
              <Button color="primary" radius="full" size="sm">
                <ShoppingCartIcon />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
