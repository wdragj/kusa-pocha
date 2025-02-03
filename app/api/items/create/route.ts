// api/items/create/route.ts

import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
    try {
        const supabase = createClient();
        
        // Get the authenticated user
        const { data: authUser, error: authError } = await supabase.auth.getUser();

        if (authError || !authUser?.user) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                headers: { "Content-Type": "application/json" },
                status: 401, // Unauthorized
            });
        }

        // Fetch the user's role
        const { data: userData, error: roleError } = await supabase
            .from("users")
            .select("role")
            .eq("id", authUser.user.id)
            .single();

        if (roleError || !userData) {
            return new Response(JSON.stringify({ message: "Failed to verify user role" }), {
                headers: { "Content-Type": "application/json" },
                status: 500,
            });
        }

        // Check if the user is an admin
        if (userData.role !== "admin") {
            return new Response(JSON.stringify({ message: "Forbidden: Admins only" }), {
                headers: { "Content-Type": "application/json" },
                status: 403, // Forbidden
            });
        }

        // Extract item data from request
        const { name, price, organization, type, img } = await request.json();

        console.log("Request body:", { name, price, organization, type, img });

        // Insert the item into the database
        const { data, error } = await supabase
            .from("items")
            .insert([
                {
                    name: name,
                    price: price,
                    organization: organization,
                    type: type,
                    img: img,
                },
            ])
            .select();

        if (error) {
            throw new Error(error.message);
        }

        if (!data) {
            return new Response(JSON.stringify({ message: "Item not inserted" }), {
                headers: { "Content-Type": "application/json" },
                status: 404,
            });
        }

        return new Response(JSON.stringify(data[0]), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });

    } catch (error) {
        console.error("Error inserting item:", error);

        return new Response(JSON.stringify({ message: "Error inserting item" }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
}
