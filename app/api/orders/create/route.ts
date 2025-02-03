// api/orders/create/route.ts

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
        const { userLoginName, userId, userEmail, userImage, tableNumber, venmoId, order, status, totalPrice } = await request.json();

        console.log("Request body:", { userLoginName, userId, userEmail, userImage, tableNumber, venmoId, order, status, totalPrice });

        // Validate input
        if (!userId || !order || !Array.isArray(order) || order.length === 0) {
            return new Response(JSON.stringify({ message: "Invalid order data" }), {
                headers: { "Content-Type": "application/json" },
                status: 400,
            });
        }

        // Ensure user ID matches authenticated user
        if (authUser.user.id !== userId) {
            return new Response(JSON.stringify({ message: "Forbidden: Cannot create order for another user" }), {
                headers: { "Content-Type": "application/json" },
                status: 403, // Forbidden
            });
        }

        // Ensure order items are formatted correctly
        const formattedOrder = order.map((item) => ({
            itemId: item.itemId.toString(),
            itemName: item.itemName,
            quantity: Number(item.quantity),
            price: Number(item.price).toFixed(2),
            type: item.type,
            organization: item.organization,
            totalPrice: Number(item.totalPrice).toFixed(2),
        }));

        // Insert into orders table
        const { data, error } = await supabase
            .from("orders")
            .insert([
                {
                    user_login_name: userLoginName,
                    user_id: userId,
                    user_email: userEmail,
                    user_image: userImage,
                    table_number: tableNumber,
                    venmo_id: venmoId,
                    order: formattedOrder,
                    status: status,
                    total_price: Number(totalPrice).toFixed(2),
                },
            ])
            .select();

        if (error) {
            throw new Error(error.message);
        }

        if (!data || data.length === 0) {
            return new Response(JSON.stringify({ message: "Order not inserted" }), {
                headers: { "Content-Type": "application/json" },
                status: 404,
            });
        }

        return new Response(JSON.stringify({ message: "Order inserted successfully", order: data[0] }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("Error inserting orders:", error);

        return new Response(JSON.stringify({ message: "Error inserting order" }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
}
