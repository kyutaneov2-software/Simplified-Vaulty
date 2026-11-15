// supabase/functions/create-checkout/index.ts
// IMPORT THE SERVE FUNCTION FOR DENO
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PAYMONGO_SECRET_KEY = Deno.env.get("PAYMONGO_SECRET_KEY");
const PAYMONGO_API_URL = "https://api.paymongo.com/v1";

// START THE SERVE FUNCTION
serve(async (req) => {
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
            "authorization, x-client-info, apikey, content-type",
    };

    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        // 1. Authenticate the user
        const supabaseClient = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_ANON_KEY") ?? "",
            {
                global: {
                    headers: {
                        Authorization: req.headers.get("Authorization")!,
                    },
                },
            },
        );
        const {
            data: { user },
        } = await supabaseClient.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        // 2. Get payment details from the app request
        const { amount, description, vaultId } = await req.json();
        // Amount must be in centavos (e.g., 10000 = ₱100.00)

        // 3. Create a Checkout Session with PayMongo
        const paymongoResponse = await fetch(
            `${PAYMONGO_API_URL}/checkout_sessions`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Basic Auth: secret_key as username, empty password
                    Authorization: `Basic ${btoa(PAYMONGO_SECRET_KEY + ":")}`,
                },
                body: JSON.stringify({
                    data: {
                        attributes: {
                            line_items: [
                                {
                                    name: description || "Vaulty Rental",
                                    amount: amount, // in centavos
                                    currency: "PHP",
                                    quantity: 1,
                                },
                            ],
                            payment_method_types: ["qrph"],
                            success_url: "vaulty://payment-success",
                            cancel_url: "vaulty://payment-cancelled",
                            description: "Vaulty Rental Payment",
                            // Pass the vaultId to the webhook
                            metadata: { user_id: user.id, vault_id: vaultId },
                        },
                    },
                }),
            },
        );

        const paymongoData = await paymongoResponse.json();
        if (!paymongoResponse.ok) throw new Error(JSON.stringify(paymongoData));

        return new Response(
            JSON.stringify({
                checkout_url: paymongoData.data.attributes.checkout_url,
            }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
        );
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
