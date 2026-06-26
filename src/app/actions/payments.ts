"use server";

import { supabaseAdmin } from "@/utils/supabase";
import { revalidatePath } from "next/cache";

// ==========================================
// HELPERS
// ==========================================

async function getTenantId(tenantCode?: string | null): Promise<string> {
  if (tenantCode === "apex") return "b0000000-0000-0000-0000-000000000000";
  return "a0000000-0000-0000-0000-000000000000";
}

function getUserId(tenantId: string): string {
  return tenantId === "b0000000-0000-0000-0000-000000000000"
    ? "b9000000-0000-0000-0000-000000000000"
    : "a9000000-0000-0000-0000-000000000000";
}

// ==========================================
// WOMPI PAYMENT GATEWAY
// ==========================================

export async function getPaymentGateway(tenantCode?: string | null) {
  const tenantId = await getTenantId(tenantCode);
  const { data, error } = await supabaseAdmin
    .from("payment_gateways")
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("gateway_type", "WOMPI")
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Error fetching payment gateway:", error);
    return null;
  }
  return data;
}

export async function createWompiCheckout(
  tenantCode: string | null,
  invoiceId: string,
  amount: number,
  customerEmail: string,
  customerName: string
) {
  const tenantId = await getTenantId(tenantCode);
  const userId = getUserId(tenantId);

  // Get gateway config
  const gateway = await getPaymentGateway(tenantCode);
  if (!gateway) {
    throw new Error("Pasarela de pagos no configurada para este tenant.");
  }

  const publicKey = gateway.public_key as string;
  const apiUrl = (gateway.api_url as string) || "https://sandbox.wompi.co/v1";
  const environment = gateway.environment as string;

  // Generate unique reference
  const reference = `INV-${invoiceId.substring(0, 8)}-${Date.now()}`;

  // Create transaction record (PENDING)
  const { data: transaction, error: txError } = await supabaseAdmin
    .from("payment_transactions")
    .insert({
      tenant_id: tenantId,
      invoice_id: invoiceId,
      gateway_id: gateway.id,
      reference_id: reference,
      status: "PENDING",
      amount,
      currency: "COP",
      customer_email: customerEmail,
      customer_name: customerName,
      created_by: userId,
    })
    .select()
    .single();

  if (txError) {
    console.error("Error creating transaction:", txError);
    throw new Error(txError.message);
  }

  // Update invoice with payment link reference
  await supabaseAdmin
    .from("invoices")
    .update({
      payment_link: `${apiUrl}/checkout/${reference}`,
      payment_token: reference,
      payment_status: "PENDING",
      payment_provider: "WOMPI",
      updated_by: userId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", invoiceId)
    .eq("tenant_id", tenantId);

  // For sandbox/demo: generate a simulated checkout URL
  // In production, this would call Wompi's API to create a real checkout session
  let checkoutUrl: string;
  if (environment === "sandbox") {
    // Sandbox mode: return a simulated checkout URL
    checkoutUrl = `https://sandbox.wompi.co/v1/checkout/${reference}`;
  } else {
    checkoutUrl = `${apiUrl}/checkout/${reference}`;
  }

  return {
    transactionId: transaction.id,
    reference,
    checkoutUrl,
    publicKey,
    environment,
    amount,
    currency: "COP",
  };
}

export async function processWompiWebhook(
  payload: {
    event: string;
    data: {
      id: string;
      reference_id?: string;
      status: string;
      amount_in_cents: number;
      currency: string;
      customer_email?: string;
      payment_method_type?: string;
    };
  }
) {
  // Find transaction by reference
  const referenceId = payload.data.reference_id || payload.data.id;

  const { data: transaction, error: txError } = await supabaseAdmin
    .from("payment_transactions")
    .select("*")
    .eq("reference_id", referenceId)
    .maybeSingle();

  if (txError || !transaction) {
    console.error("Transaction not found for webhook:", referenceId);
    throw new Error("Transacción no encontrada.");
  }

  const newStatus = payload.data.status === "APPROVED" ? "APPROVED"
    : payload.data.status === "DECLINED" ? "DECLINED"
    : payload.data.status === "VOIDED" ? "VOIDED"
    : "ERROR";

  // Update transaction
  const { error: updateError } = await supabaseAdmin
    .from("payment_transactions")
    .update({
      transaction_id: payload.data.id,
      status: newStatus,
      payment_method_type: payload.data.payment_method_type || null,
      gateway_response: payload as unknown as Record<string, unknown>,
      webhook_payload: payload as unknown as Record<string, unknown>,
      webhook_received_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", transaction.id);

  if (updateError) {
    console.error("Error updating transaction:", updateError);
    throw new Error(updateError.message);
  }

  // If approved, create payment record and update invoice
  if (newStatus === "APPROVED" && transaction.invoice_id) {
    const amount = Number(payload.data.amount_in_cents) / 100;
    const tenantId = transaction.tenant_id as string;
    const userId = getUserId(tenantId);

    // Get invoice to find client
    const { data: invoice } = await supabaseAdmin
      .from("invoices")
      .select("client_id, invoice_code, paid_amount, balance_amount, total_amount")
      .eq("id", transaction.invoice_id)
      .single();

    if (invoice) {
      // Create payment record
      const { count: payCount } = await supabaseAdmin
        .from("payments")
        .select("id", { count: "exact", head: true })
        .eq("tenant_id", tenantId);

      const paySeq = (payCount || 0) + 1;
      const paymentCode = `PAG-2026-${String(paySeq).padStart(4, "0")}`;

      const { data: payment, error: payError } = await supabaseAdmin
        .from("payments")
        .insert({
          tenant_id: tenantId,
          payment_code: paymentCode,
          client_id: invoice.client_id,
          invoice_id: transaction.invoice_id,
          payment_date: new Date().toISOString().substring(0, 10),
          payment_method: payload.data.payment_method_type === "CARD" ? "Tarjeta" : "PSE",
          reference_number: payload.data.id,
          amount,
          status: "APLICADO",
          created_by: userId,
        })
        .select()
        .single();

      if (payError) {
        console.error("Error creating payment:", payError);
      }

      // Update invoice amounts
      const newPaid = Number(invoice.paid_amount || 0) + amount;
      const newBalance = Number(invoice.total_amount) - newPaid;
      const newInvoiceStatus = newBalance <= 0 ? "PAGADA"
        : newPaid > 0 ? "PARCIALMENTE_PAGADA"
        : "EMITIDA";

      await supabaseAdmin
        .from("invoices")
        .update({
          paid_amount: newPaid,
          balance_amount: Math.max(0, newBalance),
          status: newInvoiceStatus,
          payment_status: newStatus,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", transaction.invoice_id);

      // Create reconciliation
      if (payment) {
        await supabaseAdmin.from("payment_reconciliations").insert({
          tenant_id: tenantId,
          transaction_id: transaction.id,
          payment_id: payment.id,
          reconciled_amount: amount,
          status: "CONCILIADA",
          reconciled_by: userId,
        });
      }
    }
  }

  revalidatePath("/portal");
  revalidatePath("/dashboard/invoices");
  return { success: true, status: newStatus };
}

// ==========================================
// PAYMENT HISTORY (PORTAL)
// ==========================================

export async function getPaymentHistory(tenantCode?: string | null) {
  const tenantId = await getTenantId(tenantCode);
  const { data, error } = await supabaseAdmin
    .from("payments")
    .select(`
      id,
      payment_code,
      payment_date,
      payment_method,
      reference_number,
      amount,
      status,
      invoices (invoice_code)
    `)
    .eq("tenant_id", tenantId)
    .is("deleted_at", null)
    .order("payment_date", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching payment history:", error);
    throw new Error(error.message);
  }

  return (data || []).map((p: Record<string, unknown>) => ({
    id: p.id,
    code: p.payment_code,
    date: p.payment_date ? String(p.payment_date).substring(0, 10) : "",
    method: p.payment_method,
    reference: p.reference_number || "",
    amount: Number(p.amount),
    status: p.status,
    invoiceCode: (p.invoices as Record<string, unknown>)?.invoice_code || "",
  }));
}