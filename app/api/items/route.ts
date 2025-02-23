// api/items/route.ts

import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    let { data: items, error } = await supabase
      .from("items")
      .select()
      .order("created_at", { ascending: true });

    console.log("Items data:", items);

    if (error) {
      throw new Error(error.message);
    }

    if (!items) {
      return new Response(JSON.stringify({ message: "Items not found" }), {
        headers: { "Content-Type": "application/json" },
        status: 404,
      });
    } else {
      return new Response(JSON.stringify(items), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }
  } catch (error) {
    console.error("Error fetching items:", error);

    return new Response(JSON.stringify({ message: "Error fetching items" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
