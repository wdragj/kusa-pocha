// api/organizations/route.ts

import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("organizations").select();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return new Response(
        JSON.stringify({ message: "organizations not found" }),
        {
          headers: { "Content-Type": "application/json" },
          status: 404,
        },
      );
    } else {
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }
  } catch (error) {
    console.error("Error fetching organizations:", error);

    return new Response(
      JSON.stringify({ message: "Error fetching organizations" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
}
