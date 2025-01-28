// api/orders/create/route.ts

import { createClient } from "@/utils/supabase/server";
import { user } from "@nextui-org/theme";

export async function POST(request: Request) {
    try {
        const supabase = createClient();

        const { userLoginName, userId, userEmail, userImage, tableNumber, venmoId, order, status, totalPrice } = await request.json();

        console.log("Request body:", { userLoginName, userId, userEmail, userImage, tableNumber, venmoId, order, status, totalPrice });

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
                    order: order,
                    status: status,
                    total_price: totalPrice,
                },
            ])
            .select();

        if (error) {
            throw new Error(error.message);
        }

        if (!data) {
            return new Response(JSON.stringify({ message: "Order not inserted" }), {
                headers: { "Content-Type": "application/json" },
                status: 404,
            });
        } else {
            return new Response(JSON.stringify(data[0]), {
                headers: { "Content-Type": "application/json" },
                status: 200,
            });
        }
    } catch (error) {
        console.error("Error inserting orders:", error);

        return new Response(JSON.stringify({ message: "Error inserting order" }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
}
