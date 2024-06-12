// api/tables/create/route.ts

import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { number } = await request.json();

    console.log("Request body:", { number });

    const { data, error } = await supabase
      .from("tables")
      .insert([
        {
          id: number,
          number: number,
        },
      ])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return new Response(JSON.stringify({ message: "Table not inserted" }), {
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
    console.error("Error creating table:", error);

    return new Response(JSON.stringify({ message: "Error inserting table" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
