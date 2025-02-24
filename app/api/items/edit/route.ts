// api/items/edit/route.ts

import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
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

    // Extract item details from request
    const { id, name, price, organization, type, img } = await request.json();

    console.log("Request body:", { id, name, price, organization, type, img });

    // Update the item in the database
    const { data, error } = await supabase
      .from("items")
      .update({
        name: name,
        price: price,
        organization: organization,
        type: type,
        // img: img,
      })
      .eq("id", id)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return new Response(JSON.stringify({ message: "Item not updated" }), {
        headers: { "Content-Type": "application/json" },
        status: 404,
      });
    }

    return new Response(JSON.stringify(data[0]), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error updating item:", error);

    return new Response(JSON.stringify({ message: "Error updating item" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
