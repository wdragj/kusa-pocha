// api/menus/drink/route.ts

import { getDrinks } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const drinks = await getDrinks();

    console.log("API Response", drinks);

    if (!drinks) {
      return new Response(JSON.stringify({ error: "Failed to fetch drinks" }), {
        headers: {
          "Content-Type": "application/json",
        },
        status: 404,
      });
    } else {
      return new Response(JSON.stringify(drinks), {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      });
    }
  } catch (error) {
    console.error("Error processing request:", error);

    return new Response(JSON.stringify({ error: "Error processing request" }), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 500,
    });
  }
}
