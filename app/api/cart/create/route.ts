// api/cart/create/route.ts

import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
    try {
        const supabase = createClient();
        const { userLoginName, userId, userEmail, order } = await request.json();

        console.log("Request body:", { userLoginName, userId, userEmail, order });

        // Verify User Authentication
        const { data: authSession, error: authError } = await supabase.auth.getUser();
        if (authError || !authSession?.user || authSession.user.id !== userId) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                headers: { "Content-Type": "application/json" },
                status: 401,
            });
        }

        // Fetch Current User's Cart
        const { data: user, error: fetchError } = await supabase
            .from("users")
            .select("cart")
            .eq("id", userId)
            .single();

        if (fetchError) {
            throw new Error(`Failed to fetch user cart: ${fetchError.message}`);
        }

        const currentCart = user?.cart || []; // Default to empty array if cart is null

        // Function to Merge Cart Items
        const combineCartItems = (cartItems: any[]) => {
            return cartItems.reduce((acc: any[], item) => {
                const existingItem = acc.find((i) => i.itemId === item.itemId);

                if (existingItem) {
                    existingItem.quantity += item.quantity;
                    existingItem.totalPrice = existingItem.quantity * existingItem.price;
                } else {
                    acc.push({ ...item });
                }

                return acc;
            }, []);
        };

        // Merge Current Cart with New Order
        const updatedCart = combineCartItems([...currentCart, ...order]);

        // Update Cart in Database
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
