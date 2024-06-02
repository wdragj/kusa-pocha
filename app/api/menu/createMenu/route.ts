// api/menu/createMenu/route.ts

import { createMenu } from "@/lib/db";

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

    const createMenuResponse = await createMenu(name, price, organization, img);

    console.log("DB API Response", createMenuResponse);

    return new Response(JSON.stringify(createMenuResponse), {
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
