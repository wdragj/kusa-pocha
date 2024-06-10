// api/items/create/route.ts

import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { name, price, organization, type, img } = await request.json();

    console.log("Request body:", { name, price, organization, type, img });

    const { data, error } = await supabase
      .from("items")
      .insert([
        {
          name: name,
          price: price,
          organization: organization,
          type: type,
          img: img,
        },
      ])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return new Response(JSON.stringify({ message: "Item not inserted" }), {
        headers: { "Content-Type": "application/json" },
        status: 404,
      });
    } else {
      return new Response(JSON.stringify(data[0]), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }
  } catch (error) {
    console.error("Error fetching items:", error);

    return new Response(JSON.stringify({ message: "Error inserting item" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
