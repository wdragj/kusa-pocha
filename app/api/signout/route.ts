// /api/signout.ts

"use server";

import { auth, signOut } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user;
  const res = await signOut();

  if (!user) {
    // User is signed out
    return new Response(res, { status: 200 });
  } else {
    // Failed to sign out
    return new Response("Failed to sign out", { status: 500 });
  }
}
