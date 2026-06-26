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
// INVOICE ENHANCED CRUD
// ==========================================

export async function updateInvoice(
  tenantCode: string | null,
  invoiceId: string,
  invoiceData: { clientName?: string; description?: string; amount?: number; status?: string }
) {
  const tenantId = await getTenantId(tenantCode);
  const userId = getUserId(tenantId);

  const updates: Record<string, unknown> = {
    updated_by: userId,
    updated_at: new Date().toISOString(),
  };

  if (invoiceData.status) {
    updates.status = invoiceData.status;
  }
  if (invoiceData.amount !== undefined) {
    updates.subtotal_amount = invoiceData.amount;
    updates.total_amount = invoiceData.amount;
    updates.balance_amount = invoiceData.amount - (0); // recalc based on payments
  }

  const { data, error } = await supabaseAdmin
    .from("invoices")
    .update(updates)
    .eq("id", invoiceId)
    .eq("tenant_id", tenantId)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) {
    console.error("Error updating invoice:", error);
    throw new Error(error.message);
  }

  revalidatePath(`/dashboard/invoices`);
  return data;
}

export async function softDeleteInvoice(
  tenantCode: string | null,
  invoiceId: string,
  reason: string
) {
  const tenantId = await getTenantId(tenantCode);
  const userId = getUserId(tenantId);

  const { data, error } = await supabaseAdmin
    .from("invoices")
    .update({
      status: "ANULADA",
      deleted_at: new Date().toISOString(),
      deleted_by: userId,
      delete_reason: reason,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", invoiceId)
    .eq("tenant_id", tenantId)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) {
    console.error("Error deleting invoice:", error);
    throw new Error(error.message);
  }

  revalidatePath(`/dashboard/invoices`);
  return data;
}

export async function getInvoiceDetail(tenantCode: string | null, invoiceId: string) {
  const tenantId = await getTenantId(tenantCode);

  const { data, error } = await supabaseAdmin
    .from("invoices")
    .select(`
      *,
      clients (id, legal_name, tax_id, email, phone, address, city, country),
      invoice_items (*),
      invoice_taxes (*),
      payments (*)
    `)
    .eq("id", invoiceId)
    .eq("tenant_id", tenantId)
    .is("deleted_at", null)
    .single();

  if (error) {
    console.error("Error fetching invoice detail:", error);
    throw new Error(error.message);
  }

  return data;
}

// ==========================================
// FILE EXPORTS — INVENTORY
// ==========================================

export async function exportInventoryToExcel(tenantCode?: string | null) {
  const tenantId = await getTenantId(tenantCode);

  const { data, error } = await supabaseAdmin
    .from("inventory_stock")
    .select(`
      quantity,
      reserved_quantity,
      available_quantity,
      warehouses (warehouse_code, name),
      inventory_items (item_code, name, category, unit_type)
    `)
    .eq("tenant_id", tenantId);

  if (error) {
    console.error("Error exporting inventory:", error);
    throw new Error(error.message);
  }

  return (data || []).map((row: Record<string, unknown>) => {
    const wh = row.warehouses as Record<string, unknown> | null;
    const item = row.inventory_items as Record<string, unknown> | null;
    return {
      Bodega: wh?.warehouse_code || "",
      "Nombre Bodega": wh?.name || "",
      "Código Artículo": item?.item_code || "",
      "Descripción": item?.name || "",
      Categoría: item?.category || "",
      Unidad: item?.unit_type || "",
      "Cantidad Física": Number(row.quantity),
      "Cantidad Reservada": Number(row.reserved_quantity),
      "Cantidad Disponible": Number(row.available_quantity),
    };
  });
}

export async function exportInvoicesToExcel(tenantCode?: string | null) {
  const tenantId = await getTenantId(tenantCode);

  const { data, error } = await supabaseAdmin
    .from("invoices")
    .select(`
      invoice_code,
      invoice_date,
      due_date,
      subtotal_amount,
      tax_amount,
      total_amount,
      paid_amount,
      balance_amount,
      status,
      clients (legal_name, tax_id)
    `)
    .eq("tenant_id", tenantId)
    .is("deleted_at", null)
    .order("invoice_date", { ascending: false });

  if (error) {
    console.error("Error exporting invoices:", error);
    throw new Error(error.message);
  }

  return (data || []).map((inv: Record<string, unknown>) => ({
    "Folio Factura": inv.invoice_code,
    "Fecha Emisión": inv.invoice_date ? String(inv.invoice_date).substring(0, 10) : "",
    "Fecha Vencimiento": inv.due_date ? String(inv.due_date).substring(0, 10) : "",
    Cliente: (inv.clients as Record<string, unknown>)?.legal_name || "",
    NIT: (inv.clients as Record<string, unknown>)?.tax_id || "",
    Subtotal: Number(inv.subtotal_amount),
    IVA: Number(inv.tax_amount),
    Total: Number(inv.total_amount),
    Pagado: Number(inv.paid_amount),
    Saldo: Number(inv.balance_amount),
    Estado: inv.status,
  }));
}

export async function exportPurchaseOrdersToExcel(tenantCode?: string | null) {
  const tenantId = await getTenantId(tenantCode);

  const { data, error } = await supabaseAdmin
    .from("purchase_orders")
    .select(`
      po_code,
      order_date,
      expected_delivery_date,
      actual_delivery_date,
      total_amount,
      currency,
      status,
      payment_status,
      vendors (legal_name, vendor_code)
    `)
    .eq("tenant_id", tenantId)
    .is("deleted_at", null)
    .order("order_date", { ascending: false });

  if (error) {
    console.error("Error exporting POs:", error);
    throw new Error(error.message);
  }

  return (data || []).map((po: Record<string, unknown>) => ({
    "Folio OC": po.po_code,
    "Fecha Orden": po.order_date ? String(po.order_date).substring(0, 10) : "",
    "Fecha Entrega Esperada": po.expected_delivery_date ? String(po.expected_delivery_date).substring(0, 10) : "",
    "Fecha Entrega Real": po.actual_delivery_date ? String(po.actual_delivery_date).substring(0, 10) : "",
    Proveedor: (po.vendors as Record<string, unknown>)?.legal_name || "",
    Total: Number(po.total_amount),
    Moneda: po.currency,
    Estado: po.status,
    "Estado Pago": po.payment_status,
  }));
}

// ==========================================
// INVOICE PDF DATA
// ==========================================

export async function getInvoicePdfData(tenantCode: string | null, invoiceId: string) {
  const tenantId = await getTenantId(tenantCode);

  const { data, error } = await supabaseAdmin
    .from("invoices")
    .select(`
      id,
      invoice_code,
      invoice_date,
      due_date,
      subtotal_amount,
      tax_amount,
      total_amount,
      paid_amount,
      balance_amount,
      status,
      clients (legal_name, tax_id, email, phone, address, city, country),
      invoice_items (description, quantity, unit_price, line_total),
      tenant_settings:tenant_id!inner (config_value)
    `)
    .eq("id", invoiceId)
    .eq("tenant_id", tenantId)
    .is("deleted_at", null)
    .single();

  if (error) {
    console.error("Error fetching invoice PDF data:", error);
    throw new Error(error.message);
  }

  return data;
}

// ==========================================
// PRODUCT FILES (CAD, PDFs) FROM STORAGE
// ==========================================

export async function getProductFiles(productId: string, tenantCode?: string | null) {
  const tenantId = await getTenantId(tenantCode);

  const { data, error } = await supabaseAdmin
    .from("product_files")
    .select(`
      id,
      file_type,
      sort_order,
      media_assets (id, file_name, file_path, file_size, mime_type)
    `)
    .eq("product_id", productId)
    .eq("tenant_id", tenantId);

  if (error) {
    console.error("Error fetching product files:", error);
    throw new Error(error.message);
  }

  return (data || []).map((row: Record<string, unknown>) => {
    const asset = row.media_assets as Record<string, unknown> | null;
    return {
      id: row.id,
      fileType: row.file_type,
      fileName: asset?.file_name || "Archivo sin nombre",
      filePath: asset?.file_path || "",
      fileSize: Number(asset?.file_size || 0),
      mimeType: asset?.mime_type || "application/octet-stream",
    };
  });
}

export async function getSignedFileUrl(filePath: string, tenantCode?: string | null) {
  const { data, error } = await supabaseAdmin.storage
    .from("documents")
    .createSignedUrl(filePath, 3600); // 1 hour expiry

  if (error) {
    console.error("Error creating signed URL:", error);
    throw new Error("No se pudo generar el enlace de descarga.");
  }

  return data.signedUrl;
}