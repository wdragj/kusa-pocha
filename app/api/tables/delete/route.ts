// api/tables/delete/route.ts

import { createClient } from "@/utils/supabase/server";

export async function DELETE(request: Request) {
  try {
    const supabase = createClient();
    const { id } = await request.json();

    console.log("Request body:", { id });

    const { error } = await supabase.from("tables").delete().eq("id", id);

    if (error) {
      console.error(`Error deleting table with id: ${id}`);
      throw new Error(error.message);
    } else {
      return new Response(
        JSON.stringify({
          message: `Table with id: ${id} deleted successfully.`,
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200,
        },
      );
    }
  } catch (error) {
    console.error("Error deleting table", error);

    return new Response(JSON.stringify({ message: "Error deleting table" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
