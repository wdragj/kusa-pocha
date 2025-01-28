"use client";

import React from "react";
import { Button } from "@nextui-org/button";

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
      Sign In
    </Button>
  );
}
