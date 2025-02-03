// api/itemTypes/delete/route.ts

import { createClient } from "@/utils/supabase/server";

export async function DELETE(request: Request) {
  try {
    const supabase = createClient();

    // Get the authenticated user
    const { data: authUser, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser?.user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        headers: { "Content-Type": "application/json" },
        status: 401, // Unauthorized
      });
    }

    // Fetch the user's role
    const { data: userData, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", authUser.user.id)
      .single();

    if (roleError || !userData) {
      return new Response(JSON.stringify({ message: "Failed to verify user role" }), {
        headers: { "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Check if the user is an admin
    if (userData.role !== "admin") {
      return new Response(JSON.stringify({ message: "Forbidden: Admins only" }), {
        headers: { "Content-Type": "application/json" },
        status: 403, // Forbidden
      });
    }

    // Extract item type ID from request
    const { id } = await request.json();

    console.log("Request body:", { id });

    // Delete the item type
    const { error } = await supabase.from("itemTypes").delete().eq("id", id);

    if (error) {
      console.error(`Error deleting item type with id: ${id}`);
      throw new Error(error.message);
    }

    return new Response(
      JSON.stringify({
        message: `Item type with id: ${id} deleted successfully.`,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting item type:", error);

    return new Response(
      JSON.stringify({ message: "Error deleting item type" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
