"use server";

import { Link } from "@nextui-org/react";

import { signOut } from "@/lib/auth";

export default async function SignOutDropdown() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Link color="primary" href="/" type="submit">
        Sign Out
      </Link>
    </form>
  );
}
