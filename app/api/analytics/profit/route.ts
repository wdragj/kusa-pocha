// api/analytics/profit/route.ts

import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = createClient();

    // Fetch all organizations
    const { data: organizations, error: orgError } = await supabase.from("organizations").select("name");

    if (orgError) throw new Error(`Failed to fetch organizations: ${orgError.message}`);

    // Fetch all orders with their `order` JSONB field
    const { data: orders, error: orderError } = await supabase.from("orders").select("order");

    if (orderError) throw new Error(`Failed to fetch orders: ${orderError.message}`);

    // Initialize profit storage
    let totalProfit = 0;
    const profitPerOrg: Record<string, number> = {};

    // Initialize all organizations with 0 profit
    organizations.forEach((org) => {
      profitPerOrg[org.name] = 0;
    });

    // Loop through each order entry
    orders.forEach((orderEntry) => {
      if (!orderEntry.order) return;

      orderEntry.order.forEach((item: any) => {
        const org = item.organization;
        const itemProfit = parseFloat(item.totalPrice) || 0;

        totalProfit += itemProfit; // Add to total profit

        if (profitPerOrg[org] !== undefined) {
          profitPerOrg[org] += itemProfit; // Sum up per organization
        } else {
          profitPerOrg[org] = itemProfit;
        }
      });
    });

    return new Response(
      JSON.stringify({
        totalProfit: totalProfit.toFixed(2),
        profitPerOrg: Object.keys(profitPerOrg).reduce((acc, key) => {
          acc[key] = profitPerOrg[key].toFixed(2);
          return acc;
        }, {} as Record<string, string>), // Ensure values are fixed to 2 decimal places
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching profit analytics:", error);
    return new Response(JSON.stringify({ message: "Error fetching profit analytics" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
