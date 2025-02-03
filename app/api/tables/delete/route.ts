// api/tables/delete/route.ts

import { createClient } from "@/utils/supabase/server";

export async function DELETE(request: Request) {
  try {
    const supabase = createClient();

    // Get the authenticated user
    const { data: authUser, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser?.user) {
      return new Response(JSON.stringify({ message: "Unauthorized: Please log in" }), {
        headers: { "Content-Type": "application/json" },
        status: 401, // Unauthorized
      });
    }

    // Fetch user's role
    const { data: user, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", authUser.user.id)
      .single();

    if (roleError) {
      return new Response(JSON.stringify({ message: "Error fetching user role" }), {
        headers: { "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Check if user is an admin
    if (user.role !== "admin") {
      return new Response(JSON.stringify({ message: "Forbidden: Admin access required" }), {
        headers: { "Content-Type": "application/json" },
        status: 403, // Forbidden
      });
    }

    // Extract table ID from request
    const { id } = await request.json();
    console.log("Request body:", { id });

    // Delete the table
    const { error } = await supabase.from("tables").delete().eq("id", id);

    if (error) {
      console.error(`Error deleting table with id: ${id}`);
      throw new Error(error.message);
    }

    return new Response(
      JSON.stringify({
        message: `Table with id: ${id} deleted successfully.`,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting table", error);

    return new Response(JSON.stringify({ message: "Error deleting table" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
