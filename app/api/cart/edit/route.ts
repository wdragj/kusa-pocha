// api/cart/edit/route.ts

import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
    try {
        const supabase = createClient();
        
        const { userId, updatedCart } = await request.json();

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
