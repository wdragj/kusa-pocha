// api/cart/route.ts

import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
    try {
        const supabase = createClient();

        // Parse the query parameters to get the userId
        const url = new URL(request.url);
        const userId = url.searchParams.get("userId");

        if (!userId) {
            return new Response(JSON.stringify({ message: "Missing userId" }), {
                headers: { "Content-Type": "application/json" },
                status: 400, // Bad Request
            });
        }

        // Fetch the cart for the given userId
        const { data: user, error } = await supabase.from("users").select("cart").eq("id", userId).single(); // Ensure we only fetch one user

        if (error) {
            throw new Error(error.message);
        }

        if (!user || !user.cart) {
            return new Response(JSON.stringify({ message: "Cart not found" }), {
                headers: { "Content-Type": "application/json" },
                status: 404, // Not Found
            });
        }

        return new Response(JSON.stringify(user.cart), {
            headers: { "Content-Type": "application/json" },
            status: 200, // OK
        });
    } catch (error) {
        console.error("Error fetching cart:", error);

        return new Response(JSON.stringify({ message: "Error fetching cart" }), {
            headers: { "Content-Type": "application/json" },
            status: 500, // Internal Server Error
        });
    }
}
