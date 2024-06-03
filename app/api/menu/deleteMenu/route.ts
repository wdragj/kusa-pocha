// api/menu/deleteMenu/route.ts

import { deleteMenuById } from "@/lib/db";

export async function DELETE(request: Request) {
  try {
    const { menuId } = await request.json();

    if (!menuId) {
      return new Response(
        JSON.stringify({ error: "Menu ID not received on backend." }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 404,
        },
      );
    }

    const deleteMenuResponse = await deleteMenuById(menuId);

    console.log("DB API Response", deleteMenuResponse[0]);

    return new Response(JSON.stringify(deleteMenuResponse[0]), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
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
