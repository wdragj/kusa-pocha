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
                status: 401,
            });
        }

        // Fetch user role
        const { data: userRoleData, error: roleError } = await supabase
            .from("users")
            .select("role")
            .eq("id", authUser.user.id)
            .single();

        if (roleError || userRoleData?.role !== "admin") {
            return new Response(JSON.stringify({ message: "Forbidden: Admins only" }), {
                headers: { "Content-Type": "application/json" },
                status: 403,
            });
        }

        // Extract request data
        const body = await request.json();
        const orderIds = body.orderIds;

        // Validate orderIds
        if (!Array.isArray(orderIds) || orderIds.length === 0) {
            return new Response(JSON.stringify({ message: "Invalid request: no order IDs provided" }), {
                headers: { "Content-Type": "application/json" },
                status: 400,
            });
        }

        // Delete the orders from the database
        // Using 'in' to match all rows with an id in orderIds
        const { data, error: deleteError } = await supabase
            .from("orders")
            .delete()
            .in("id", orderIds)
            .select("id"); // optional: return which IDs were actually deleted

        if (deleteError) {
            throw new Error(deleteError.message);
        }

        return new Response(
            JSON.stringify({
                message: "Orders deleted successfully",
                deletedCount: data?.length ?? 0,
                deletedIds: data?.map((row) => row.id) ?? [],
            }),
            {
                headers: { "Content-Type": "application/json" },
                status: 200,
            }
        );
    } catch (error) {
        console.error("Error deleting orders:", error);
        return new Response(JSON.stringify({ message: "Error deleting orders" }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
}
