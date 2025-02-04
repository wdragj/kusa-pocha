import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
    try {
        const supabase = createClient();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const userRole = searchParams.get("role");

        if (!userId || !userRole) {
            return new Response(JSON.stringify({ message: "Missing userId or role" }), {
                headers: { "Content-Type": "application/json" },
                status: 400,
            });
        }

        let query = supabase
            .from("orders")
            .select("id, order_number, user_id, user_login_name, user_email, user_image, table_number, venmo_id, order, total_price, status, created_at")
            .order("created_at", { ascending: false });

        if (userRole !== "admin") {
            query = query.eq("user_id", userId); // Normal users only see their own orders
        }

        const { data: orders, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        return new Response(JSON.stringify(orders ?? []), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("Error fetching orders:", error);

        return new Response(JSON.stringify({ message: "Error fetching orders" }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
}
