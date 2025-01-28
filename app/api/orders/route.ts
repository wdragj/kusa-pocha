// api/orders/route.ts

import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    let { data: orders, error } = await supabase
      .from("orders")
      .select()
      .order("created_at", { ascending: false });

    console.log("orders data:", orders);

    if (error) {
      throw new Error(error.message);
    }

    if (!orders) {
      return new Response(JSON.stringify({ message: "orders not found" }), {
        headers: { "Content-Type": "application/json" },
        status: 404,
      });
    } else {
      return new Response(JSON.stringify(orders), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }
  } catch (error) {
    console.error("Error fetching orders:", error);

    return new Response(JSON.stringify({ message: "Error fetching orders" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
