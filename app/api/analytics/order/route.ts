// api/analytics/order/route.ts

import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = createClient();

    // Fetch order counts for different statuses
    const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact" });
    const { count: pendingOrders } = await supabase.from("orders").select("*", { count: "exact" }).eq("status", "pending");
    const { count: inProgressOrders } = await supabase.from("orders").select("*", { count: "exact" }).eq("status", "in_progress");
    const { count: completedOrders } = await supabase.from("orders").select("*", { count: "exact" }).eq("status", "complete");
    const { count: declinedOrders } = await supabase.from("orders").select("*", { count: "exact" }).eq("status", "declined");

    return new Response(
      JSON.stringify({
        totalOrders,
        pendingOrders,
        inProgressOrders,
        completedOrders,
        declinedOrders,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching order analytics:", error);
    return new Response(JSON.stringify({ message: "Error fetching order analytics" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
