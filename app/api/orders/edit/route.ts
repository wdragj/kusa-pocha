// api/orders/edit/route.ts

import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = createClient();

    // Get the authenticated user
    const { data: authUser, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser?.user) {
      return new Response(
        JSON.stringify({ message: "Unauthorized: Please log in" }),
        {
          headers: { "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    // Fetch user role
    const { data: userRoleData, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", authUser.user.id)
      .single();

    if (roleError || userRoleData?.role !== "admin") {
      return new Response(
        JSON.stringify({ message: "Forbidden: Admins only" }),
        {
          headers: { "Content-Type": "application/json" },
          status: 403,
        }
      );
    }

    // Extract request data (note: expecting paymentId and paymentMethod instead of venmoId)
    const { orderId, tableNumber, paymentId, paymentMethod, order, totalPrice } = await request.json();

    console.log("Editing Order:", {
      orderId,
      tableNumber,
      paymentId,
      paymentMethod,
      order,
      totalPrice,
    });

    if (!orderId) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        {
          headers: { "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Check if the order exists
    const { data: existingOrder, error: findError } = await supabase
      .from("orders")
      .select("id")
      .eq("id", orderId)
      .single();

    if (findError || !existingOrder) {
      return new Response(
        JSON.stringify({ message: "Order not found" }),
        {
          headers: { "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    // Prepare updated fields
    const updatedFields: Record<string, any> = {};
    if (tableNumber !== undefined) updatedFields["table_number"] = tableNumber;
    if (paymentId !== undefined) updatedFields["payment_id"] = paymentId;
    if (paymentMethod !== undefined) updatedFields["payment_method"] = paymentMethod;
    if (totalPrice !== undefined)
      updatedFields["total_price"] = Number(totalPrice).toFixed(2);

    // Update order items if provided
    if (order && Array.isArray(order)) {
      updatedFields["order"] = order.map((item) => {
        const updatedTotalPrice = Number(item.quantity) * Number(item.price);
        return {
          itemId: item.itemId.toString(),
          itemName: item.itemName,
          quantity: Number(item.quantity),
          price: Number(item.price).toFixed(2),
          type: item.type,
          organization: item.organization,
          totalPrice: updatedTotalPrice.toFixed(2),
        };
      });
    }

    // Update the order in the database
    const { error: updateError } = await supabase
      .from("orders")
      .update(updatedFields)
      .eq("id", orderId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return new Response(
      JSON.stringify({ message: "Order updated successfully" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating order:", error);
    return new Response(
      JSON.stringify({ message: "Error updating order" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
