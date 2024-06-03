// api/menus/drink/delete/route.ts

import { deleteDrinkById } from "@/lib/db";

export async function DELETE(request: Request) {
  try {
    const { itemId } = await request.json();

    if (!itemId) {
      return new Response(
        JSON.stringify({ error: "Drink ID not received on backend." }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 404,
        },
      );
    }

    const deleteDrinkResponse = await deleteDrinkById(itemId);

    console.log("DB API Response", deleteDrinkResponse[0]);

    return new Response(JSON.stringify(deleteDrinkResponse[0]), {
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
