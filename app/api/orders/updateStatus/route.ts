// api/ordeers/updateStatus

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
        const { orderId, status } = await request.json();

        console.log("Update Order Request:", { orderId, status });

        // Validate input
        if (!orderId || !status) {
            return new Response(JSON.stringify({ message: "Invalid request: Missing orderId or status" }), {
                headers: { "Content-Type": "application/json" },
                status: 400, // Bad Request
            });
        }

        // Ensure the user is an admin
        const { data: userRole, error: roleError } = await supabase
            .from("users")
            .select("role")
            .eq("id", authUser.user.id)
            .single();

        if (roleError || !userRole || userRole.role !== "admin") {
            return new Response(JSON.stringify({ message: "Forbidden: Only admins can update order status" }), {
                headers: { "Content-Type": "application/json" },
                status: 403, // Forbidden
            });
        }

        // Update order status in the database
        const { data, error } = await supabase
            .from("orders")
            .update({ status })
            .eq("id", orderId)
            .select();

        if (error) {
            throw new Error(error.message);
        }

        if (!data || data.length === 0) {
            return new Response(JSON.stringify({ message: "Order not found or not updated" }), {
                headers: { "Content-Type": "application/json" },
                status: 404, // Not Found
            });
        }

        return new Response(JSON.stringify({ message: "Order status updated successfully", order: data[0] }), {
            headers: { "Content-Type": "application/json" },
            status: 200, // OK
        });
    } catch (error) {
        console.error("Error updating order status:", error);

        return new Response(JSON.stringify({ message: "Error updating order status" }), {
            headers: { "Content-Type": "application/json" },
            status: 500, // Internal Server Error
        });
    }
}
