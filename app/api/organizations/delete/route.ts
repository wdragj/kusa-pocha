// api/organizations/delete/route.ts

import { createClient } from "@/utils/supabase/server";

export async function DELETE(request: Request) {
  try {
    const supabase = createClient();
    const { id } = await request.json();

    console.log("Request body:", { id });

    const { error } = await supabase
      .from("organizations")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Error deleting orgnization with id: ${id}`);
      throw new Error(error.message);
    } else {
      return new Response(
        JSON.stringify({
          message: `Organization with id: ${id} deleted successfully.`,
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200,
        },
      );
    }
  } catch (error) {
    console.error("Error deleting organization", error);

    return new Response(
      JSON.stringify({ message: "Error deleting organization" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
}
