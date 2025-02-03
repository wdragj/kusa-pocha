// api/tables/edit/route.ts

import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
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

    // Extract table details from request
    const { id, number } = await request.json();
    console.log("Request body:", { id, number });

    // Update the table
    const { data, error } = await supabase
      .from("tables")
      .update({
        number: number, // Update only the number, don't change the ID
      })
      .eq("id", id)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return new Response(JSON.stringify({ message: "Table not updated" }), {
        headers: { "Content-Type": "application/json" },
        status: 404,
      });
    }

    return new Response(JSON.stringify(data[0]), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error editing table:", error);

    return new Response(JSON.stringify({ message: "Error updating table" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
