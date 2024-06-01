"use client";

import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  ScrollShadow,
} from "@nextui-org/react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { subtitle } from "./primitives";

export default function Menus() {
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
        <Card className="col-span-2 sm:col-span-2">
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
    </section>
  );
}
