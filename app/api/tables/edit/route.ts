// api/tables/edit/route.ts

import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { id, number } = await request.json();

    console.log("Request body:", { id, number });

    const { data, error } = await supabase
      .from("tables")
      .update({
        id: number,
        number: number,
      })
      .eq("id", id)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return new Response(JSON.stringify({ message: "Table not updated" }), {
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
    console.error("Error editing table:", error);

    return new Response(JSON.stringify({ message: "Error updating table" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
