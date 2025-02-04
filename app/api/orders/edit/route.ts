// api/orders/edit/route.ts

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

        // Extract request data
        const { orderId, userId, tableNumber, venmoId, order, status, totalPrice } = await request.json();

        console.log("Editing Order:", { orderId, userId, tableNumber, venmoId, order, status, totalPrice });

        // Validate input
        if (!orderId || !userId || !tableNumber || !venmoId || !order || !Array.isArray(order) || order.length === 0) {
            return new Response(JSON.stringify({ message: "Invalid order data" }), {
                headers: { "Content-Type": "application/json" },
                status: 400,
            });
        }

        // Ensure user ID matches authenticated user
        if (authUser.user.id !== userId) {
            return new Response(JSON.stringify({ message: "Forbidden: Cannot edit order for another user" }), {
                headers: { "Content-Type": "application/json" },
                status: 403, // Forbidden
            });
        }

        // Check if the order exists
        const { data: existingOrder, error: findError } = await supabase
            .from("orders")
            .select("id, user_id")
            .eq("id", orderId)
            .single();

        if (findError || !existingOrder) {
            return new Response(JSON.stringify({ message: "Order not found" }), {
                headers: { "Content-Type": "application/json" },
                status: 404,
            });
        }

        // Ensure the user is the owner of the order
        if (existingOrder.user_id !== userId) {
            return new Response(JSON.stringify({ message: "Unauthorized: You do not own this order" }), {
                headers: { "Content-Type": "application/json" },
                status: 403,
            });
        }

        // Format the updated order data
        const formattedOrder = order.map((item) => ({
            itemId: item.itemId.toString(),
            itemName: item.itemName,
            quantity: Number(item.quantity),
            price: Number(item.price).toFixed(2),
            type: item.type,
            organization: item.organization,
            totalPrice: Number(item.totalPrice).toFixed(2),
        }));

        // Update the order in the database
        const { error: updateError } = await supabase
            .from("orders")
            .update({
                table_number: tableNumber,
                venmo_id: venmoId,
                order: formattedOrder,
                status,
                total_price: Number(totalPrice).toFixed(2),
            })
            .eq("id", orderId);

        if (updateError) {
            throw new Error(updateError.message);
        }

        return new Response(JSON.stringify({ message: "Order updated successfully" }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("Error updating order:", error);

        return new Response(JSON.stringify({ message: "Error updating order" }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
}
