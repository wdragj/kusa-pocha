// api/menus/drink/edit/route.ts

import { editDrinkById } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { itemId, editedName, editedPrice, editedOrganization } =
      await request.json();

    if (!itemId || !editedName || !editedPrice || !editedOrganization) {
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

    const editDrinkResponse = await editDrinkById(
      itemId,
      editedName,
      editedPrice,
      editedOrganization,
    );

    console.log("DB API Response", editDrinkResponse[0]);

    return new Response(JSON.stringify(editDrinkResponse[0]), {
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
