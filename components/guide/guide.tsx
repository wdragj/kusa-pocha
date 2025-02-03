"use client";

import React from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";

import { subtitle } from "@/components/primitives";

export default function Guide() {
    const defaultContent =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

    return (
        <section className="flex flex-col items-center justify-center gap-2">
            <div className="text-center">
                <h1 className={`${subtitle()} font-semibold`}>쿠사포차 이용 가이드</h1>
            </div>
            <Accordion variant="shadow">
                <AccordionItem key="1" aria-label="KUSA Guide 1" title="제목 1">
                    {defaultContent}
                </AccordionItem>
                <AccordionItem key="2" aria-label="KUSA Guide 2" title="제목 2">
                    {defaultContent}
                </AccordionItem>
                <AccordionItem key="3" aria-label="KUSA Guide 3" title="제목 3">
                    {defaultContent}
                </AccordionItem>
            </Accordion>
        </section>
    );
}
