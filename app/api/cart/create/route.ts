// api/cart/create/route.ts

import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
    try {
        const supabase = createClient();
        const { userLoginName, userId, userEmail, order } = await request.json();

        console.log("Request body:", { userLoginName, userId, userEmail, order });

        // Fetch the current cart
        const { data: user, error: fetchError } = await supabase
            .from("users")
            .select("cart")
            .eq("id", userId)
            .single();

        if (fetchError) {
            throw new Error(`Failed to fetch user cart: ${fetchError.message}`);
        }

        const currentCart = user?.cart || []; // Default to empty array if cart is null

        // Function to combine cart items
        const combineCartItems = (cartItems: any[]) => {
            return cartItems.reduce((acc: any[], item) => {
                const existingItem = acc.find((i) => i.itemId === item.itemId);

                if (existingItem) {
                    // If item exists, update its quantity and totalPrice
                    existingItem.quantity += item.quantity;
                    existingItem.totalPrice = existingItem.quantity * existingItem.price;
                } else {
                    // Otherwise, add it to the accumulator
                    acc.push({ ...item });
                }

                return acc;
            }, []);
        };

        // Merge the existing cart with the new order
        const updatedCart = combineCartItems([...currentCart, ...order]);

        // Update the cart in the database
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
