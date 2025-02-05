"use client";

import React from "react";
import { Button } from "@heroui/button";

import { signIn } from "@/auth/signIn";

export default function SignInButton() {
    return (
        <Button
            color="primary"
            href="/"
            variant="flat"
            onPress={async () => {
                await signIn();
            }}
        >
            로그인
        </Button>
    );
}
