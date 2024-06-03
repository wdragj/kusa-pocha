// api/menus/drink/create/route.ts

import { createDrink } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, price, organization, img } = await request.json();

    if (!name || !price || !organization || !img) {
      return new Response(
        JSON.stringify({ error: "Fields not received on backend." }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 404,
        },
      );
    }

    const createDrinkResponse = await createDrink(
      name,
      price,
      organization,
      img,
    );

    console.log("DB API Response", createDrinkResponse);

    return new Response(JSON.stringify(createDrinkResponse), {
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
