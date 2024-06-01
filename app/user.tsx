// "use client";

import Image from "next/image";
import { Button } from "@nextui-org/button";

import { auth, signIn, signOut } from "@/lib/auth";

export async function User() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return (
      <form
        action={async () => {
          // "use server";
          await signIn("kakao");
        }}
      >
        <Button />
      </form>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Image
        alt={`${user.name} avatar`}
        className="h-8 w-8 rounded-full"
        height={32}
        src={user.image!}
        width={32}
      />
      <span>{user.name}</span>
      <form
        action={async () => {
          // 'use server';
          await signOut();
        }}
      >
        <Button type="submit" />
      </form>
    </div>
  );
}
