// supabase/functions/paymongo-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PAYMONGO_WEBHOOK_SECRET = Deno.env.get("PAYMONGO_WEBHOOK_SECRET")!;

const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

async function verifySignature(
    payload: string,
    signatureHeader: string,
    secret: string,
) {
    const parts = signatureHeader.split(",");
    const timestamp = parts.find((p) => p.startsWith("t="))?.substring(2);
    const signature =
        parts.find((p) => p.startsWith("te="))?.substring(3) ||
        parts.find((p) => p.startsWith("li="))?.substring(3);

    if (!timestamp || !signature) return false;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
    );

    const signedPayload = `${timestamp}.${payload}`;
    const expectedSignature = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(signedPayload),
    );
    const expectedHex = Array.from(new Uint8Array(expectedSignature))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    return expectedHex === signature;
}

serve(async (req) => {
    console.log("Webhook received");

    if (req.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
    }

    const rawBody = await req.text();
    const signatureHeader = req.headers.get("Paymongo-Signature") ?? "";

    const isValid = await verifySignature(
        rawBody,
        signatureHeader,
        PAYMONGO_WEBHOOK_SECRET,
    );
    if (!isValid) {
        console.error("Invalid webhook signature");
        return new Response("Invalid signature", { status: 401 });
    }
    console.log("Signature verified successfully");

    try {
        const event = JSON.parse(rawBody);

        const eventType = event.data?.attributes?.type || event.type;
        const checkoutSession = event.data?.attributes?.data || event;
        const metadata = checkoutSession.attributes?.metadata;

        console.log(`Processing Event Type: ${eventType}`);

        const isPaid =
            eventType === "checkout_session.payment.paid" ||
            checkoutSession.attributes?.payments?.[0]?.attributes?.status ===
                "paid";

        if (isPaid && metadata?.user_id && metadata?.vault_id) {
            const userId = metadata.user_id;
            const vaultId = metadata.vault_id;

            console.log(
                `Payment confirmed for User: ${userId}, Vault: ${vaultId}`,
            );

            const { data: rental, error: rentalError } = await supabaseAdmin
                .from("rentals")
                .insert({
                    user_id: userId,
                    vault_id: vaultId,
                    is_active: true,
                })
                .select()
                .single();

            if (rentalError) throw rentalError;
            console.log(`Rental created: ${rental.id}`);

            const { error: vaultError } = await supabaseAdmin
                .from("vaults")
                .update({ status: "locked" })
                .eq("id", vaultId);

            if (vaultError) throw vaultError;
            console.log(`Vault ${vaultId} locked successfully`);
        } else {
            console.log(
                "Event ignored: Not a successful payment or missing metadata.",
            );
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error: any) {
        console.error("Webhook processing error:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    }
});
