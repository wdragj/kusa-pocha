// api/orders/delete/route.ts

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

        // Extract request data
        const { orderId, userId } = await request.json();

        console.log("Deleting Order:", { orderId, userId });

        // Validate input
        if (!orderId || !userId) {
            return new Response(JSON.stringify({ message: "Invalid order data" }), {
                headers: { "Content-Type": "application/json" },
                status: 400,
            });
        }

        // Ensure user ID matches authenticated user
        if (authUser.user.id !== userId) {
            return new Response(JSON.stringify({ message: "Forbidden: Cannot delete order for another user" }), {
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

        // Delete the order from the database
        const { error: deleteError } = await supabase
            .from("orders")
            .delete()
            .eq("id", orderId);

        if (deleteError) {
            throw new Error(deleteError.message);
        }

        return new Response(JSON.stringify({ message: "Order deleted successfully" }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("Error deleting order:", error);

        return new Response(JSON.stringify({ message: "Error deleting order" }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
}
