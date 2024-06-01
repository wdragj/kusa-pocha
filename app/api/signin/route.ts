// /api/signin.ts

import { auth, signIn } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    // User is not signed in
    const res = await signIn("kakao");

    return new Response(res, { status: 200 });
  }
}
