// api/itemTypes/edit/route.ts

import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { id, name } = await request.json();

    console.log("Request body:", { id, name });

    const { data, error } = await supabase
      .from("itemTypes")
      .update({
        name: name,
      })
      .eq("id", id)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return new Response(
        JSON.stringify({ message: "Item type not updated" }),
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
    console.error("Error editing item type:", error);

    return new Response(
      JSON.stringify({ message: "Error updating item type" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
}
