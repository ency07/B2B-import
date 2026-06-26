import { NextRequest, NextResponse } from "next/server";
import { processWompiWebhook } from "@/app/actions/payments";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.event || !body.data) {
      return NextResponse.json(
        { error: "Payload inválido: falta 'event' o 'data'" },
        { status: 400 }
      );
    }

    console.log(`[Wompi Webhook] Event: ${body.event}, Reference: ${body.data?.reference_id || body.data?.id}`);

    // Process the webhook
    const result = await processWompiWebhook(body);

    return NextResponse.json({ received: true, ...result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error interno del servidor";
    console.error("[Wompi Webhook] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Wompi may send GET for verification
export async function GET() {
  return NextResponse.json({ status: "Wompi webhook endpoint active" });
}