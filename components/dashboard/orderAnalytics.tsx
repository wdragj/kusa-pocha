"use client";

import { Card, CardBody } from "@nextui-org/react";

import { subtitle } from "../primitives";

export default function ProfitAnalytics() {
  return (
    <>
      <h1 className={subtitle()}>Order Analytics</h1>
      <section className="flex flex-row items-center justify-center gap-4">
        <Card className="flex w-[120px]" radius="sm">
          <CardBody>
            <p className="text-sm font-bold text-default-500">TOTAL</p>
            <p className="text-xl font-bold pt-2">54</p>
            {/* <p className="text-sm">Orders: 20</p> */}
          </CardBody>
        </Card>

        <Card className="flex w-[120px]" radius="sm">
          <CardBody>
            <p className="text-sm font-bold text-default-500">COMPLETED</p>
            <p className="text-xl font-bold pt-2">40</p>
            {/* <p className="text-sm">Orders: 12</p> */}
          </CardBody>
        </Card>

        <Card className="flex w-[120px]" radius="sm">
          <CardBody>
            <p className="text-sm font-bold text-default-500">DECLINED</p>
            <p className="text-xl font-bold pt-2">14</p>
            {/* <p className="text-sm">Orders: 12</p> */}
          </CardBody>
        </Card>
      </section>
    </>
  );
}
