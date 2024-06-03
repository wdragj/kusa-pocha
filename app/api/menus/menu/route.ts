// api/menus/menu/route.ts

import { getMenus } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const menus = await getMenus();

    console.log("API Response", menus);

    if (!menus) {
      return new Response(JSON.stringify({ error: "Failed to fetch menus" }), {
        headers: {
          "Content-Type": "application/json",
        },
        status: 404,
      });
    } else {
      return new Response(JSON.stringify(menus), {
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
