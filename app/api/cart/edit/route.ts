// api/cart/edit/route.ts

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

        const { userId, updatedCart } = await request.json();

        // Ensure the logged-in user matches the provided userId
        if (authUser.user.id !== userId) {
            return new Response(JSON.stringify({ message: "Forbidden" }), {
                headers: { "Content-Type": "application/json" },
                status: 403, // Forbidden
            });
        }

        console.log("Updating entire cart for user:", { userId, updatedCart });

        // Replace the cart in the database
        const { data, error: updateError } = await supabase
            .from("users")
            .update({ cart: updatedCart })
            .eq("id", userId)
            .select();

        if (updateError) {
            throw new Error(`Failed to update cart: ${updateError.message}`);
        }

        return new Response(JSON.stringify({ message: "Cart updated successfully", data }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("Error updating cart:", error);

        return new Response(JSON.stringify({ message: "Error updating cart" }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
}
