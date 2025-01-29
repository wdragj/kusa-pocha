// api/orders/create/route.ts

import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
    try {
        const supabase = createClient();

        const { userLoginName, userId, userEmail, userImage, tableNumber, venmoId, order, status, totalPrice } = await request.json();

        console.log("Request body:", { userLoginName, userId, userEmail, userImage, tableNumber, venmoId, order, status, totalPrice });

        // Validate input
        if (!userId || !order || !Array.isArray(order) || order.length === 0) {
            return new Response(JSON.stringify({ message: "Invalid order data" }), {
                headers: { "Content-Type": "application/json" },
                status: 400,
            });
        }

        // Ensure order items are formatted correctly
        const formattedOrder = order.map((item) => ({
            itemId: item.itemId.toString(),
            itemName: item.itemName,
            quantity: Number(item.quantity), // Ensure quantity is a number
            price: Number(item.price).toFixed(2), // Convert price to a fixed decimal string
            type: item.type,
            organization: item.organization,
            totalPrice: Number(item.totalPrice).toFixed(2), // Ensure totalPrice is a valid number
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
                    order: formattedOrder, // Store formatted order
                    status: status,
                    total_price: Number(totalPrice).toFixed(2), // Ensure precision
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
