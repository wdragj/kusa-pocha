// api/itemTypes/create/route.ts

import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { name } = await request.json();

    console.log("Request body:", { name });

    const { data, error } = await supabase
      .from("itemTypes")
      .insert([
        {
          name: name,
        },
      ])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return new Response(
        JSON.stringify({ message: "Item type not inserted" }),
        {
          headers: { "Content-Type": "application/json" },
          status: 404,
        },
      );
    } else {
      return new Response(JSON.stringify(data[0]), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }
  } catch (error) {
    console.error("Error creating item type:", error);

    return new Response(
      JSON.stringify({ message: "Error inserting item type" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
}
