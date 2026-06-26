"use server";

import { supabaseAdmin } from "@/utils/supabase";
import { revalidatePath } from "next/cache";

// Helper para obtener tenant ID (importado localmente para evitar circular deps)
async function getTenantId(tenantCode?: string | null): Promise<string> {
  if (tenantCode === "apex") {
    return "b0000000-0000-0000-0000-000000000000";
  }
  return "a0000000-0000-0000-0000-000000000000";
}

function getUserId(tenantId: string): string {
  return tenantId === "b0000000-0000-0000-0000-000000000000"
    ? "b9000000-0000-0000-0000-000000000000"
    : "a9000000-0000-0000-0000-000000000000";
}

// ==========================================
// INVENTORY ITEMS CRUD
// ==========================================

export async function getInventoryItems(tenantCode?: string | null) {
  const tenantId = await getTenantId(tenantCode);
  const { data, error } = await supabaseAdmin
    .from("inventory_items")
    .select("id, item_code, name, description, category, item_type, unit, minimum_stock, reorder_point, maximum_stock, average_cost, last_cost, status, purchase_price")
    .eq("tenant_id", tenantId)
    .is("deleted_at", null)
    .order("item_code", { ascending: true });

  if (error) {
    console.error("Error fetching inventory items:", error);
    throw new Error(error.message);
  }

  return (data || []).map((item: Record<string, unknown>) => ({
    id: item.id,
    itemCode: item.item_code,
    name: item.name,
    description: item.description || "",
    category: item.category || "",
    itemType: item.item_type,
    unit: item.unit,
    minimumStock: Number(item.minimum_stock),
    reorderPoint: Number(item.reorder_point),
    maximumStock: Number(item.maximum_stock),
    averageCost: Number(item.average_cost),
    lastCost: Number(item.last_cost),
    purchasePrice: Number((item as Record<string, unknown>).purchase_price || 0),
    status: item.status as "ACTIVO" | "INACTIVO",
  }));
}

export async function createInventoryItem(
  tenantCode: string | null,
  itemData: {
    itemCode: string;
    name: string;
    description?: string;
    category?: string;
    itemType: string;
    unit: string;
    minimumStock: number;
    reorderPoint: number;
    maximumStock: number;
    averageCost: number;
    purchasePrice: number;
  }
) {
  const tenantId = await getTenantId(tenantCode);
  const userId = getUserId(tenantId);

  // Check for duplicate item code
  const { data: existing } = await supabaseAdmin
    .from("inventory_items")
    .select("id")
    .eq("tenant_id", tenantId)
    .eq("item_code", itemData.itemCode)
    .is("deleted_at", null)
    .limit(1)
    .maybeSingle();

  if (existing) {
    throw new Error(`Ya existe un artículo con el código ${itemData.itemCode} para este tenant.`);
  }

  const { data, error } = await supabaseAdmin
    .from("inventory_items")
    .insert({
      tenant_id: tenantId,
      item_code: itemData.itemCode,
      name: itemData.name,
      description: itemData.description || null,
      category: itemData.category || null,
      item_type: itemData.itemType,
      unit: itemData.unit,
      minimum_stock: itemData.minimumStock,
      reorder_point: itemData.reorderPoint,
      maximum_stock: itemData.maximumStock,
      average_cost: itemData.averageCost,
      last_cost: itemData.purchasePrice,
      purchase_price: itemData.purchasePrice,
      status: "ACTIVO",
      created_by: userId,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating inventory item:", error);
    throw new Error(error.message);
  }

  revalidatePath(`/dashboard/inventory`);
  return data;
}

export async function updateInventoryItem(
  tenantCode: string | null,
  itemId: string,
  itemData: {
    name: string;
    description?: string;
    category?: string;
    itemType: string;
    unit: string;
    minimumStock: number;
    reorderPoint: number;
    maximumStock: number;
    averageCost: number;
    purchasePrice: number;
    status: string;
  }
) {
  const tenantId = await getTenantId(tenantCode);
  const userId = getUserId(tenantId);

  const { data, error } = await supabaseAdmin
    .from("inventory_items")
    .update({
      name: itemData.name,
      description: itemData.description || null,
      category: itemData.category || null,
      item_type: itemData.itemType,
      unit: itemData.unit,
      minimum_stock: itemData.minimumStock,
      reorder_point: itemData.reorderPoint,
      maximum_stock: itemData.maximumStock,
      average_cost: itemData.averageCost,
      last_cost: itemData.purchasePrice,
      purchase_price: itemData.purchasePrice,
      status: itemData.status,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", itemId)
    .eq("tenant_id", tenantId)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) {
    console.error("Error updating inventory item:", error);
    throw new Error(error.message);
  }

  revalidatePath(`/dashboard/inventory`);
  return data;
}

export async function softDeleteInventoryItem(
  tenantCode: string | null,
  itemId: string,
  reason: string
) {
  const tenantId = await getTenantId(tenantCode);
  const userId = getUserId(tenantId);

  const { data, error } = await supabaseAdmin
    .from("inventory_items")
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by: userId,
      delete_reason: reason,
      status: "INACTIVO",
      updated_by: userId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", itemId)
    .eq("tenant_id", tenantId)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) {
    console.error("Error soft-deleting inventory item:", error);
    throw new Error(error.message);
  }

  revalidatePath(`/dashboard/inventory`);
  return data;
}

// ==========================================
// PURCHASE ORDERS CRUD
// ==========================================

export async function getVendors(tenantCode?: string | null) {
  const tenantId = await getTenantId(tenantCode);
  const { data, error } = await supabaseAdmin
    .from("vendors")
    .select("id, vendor_code, legal_name, tax_id, contact_name, contact_email, contact_phone, city, payment_terms, status")
    .eq("tenant_id", tenantId)
    .is("deleted_at", null)
    .order("legal_name", { ascending: true });

  if (error) {
    console.error("Error fetching vendors:", error);
    throw new Error(error.message);
  }

  return (data || []).map((v: Record<string, unknown>) => ({
    id: v.id,
    code: v.vendor_code,
    name: v.legal_name,
    taxId: v.tax_id || "",
    contactName: v.contact_name || "",
    contactEmail: v.contact_email || "",
    contactPhone: v.contact_phone || "",
    city: v.city || "",
    paymentTerms: Number(v.payment_terms || 30),
    status: v.status as "ACTIVO" | "INACTIVO" | "SUSPENDIDO",
  }));
}

export async function createVendor(
  tenantCode: string | null,
  vendorData: {
    legalName: string;
    taxId?: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    city?: string;
    paymentTerms?: number;
  }
) {
  const tenantId = await getTenantId(tenantCode);
  const userId = getUserId(tenantId);

  const { count } = await supabaseAdmin
    .from("vendors")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenantId);

  const seq = (count || 0) + 1;
  const code = `PROV-${String(seq).padStart(4, "0")}`;

  const { data, error } = await supabaseAdmin
    .from("vendors")
    .insert({
      tenant_id: tenantId,
      vendor_code: code,
      legal_name: vendorData.legalName,
      tax_id: vendorData.taxId || null,
      contact_name: vendorData.contactName || null,
      contact_email: vendorData.contactEmail || null,
      contact_phone: vendorData.contactPhone || null,
      city: vendorData.city || "Bogotá",
      country: "Colombia",
      payment_terms: vendorData.paymentTerms || 30,
      status: "ACTIVO",
      created_by: userId,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating vendor:", error);
    throw new Error(error.message);
  }

  revalidatePath(`/dashboard/purchases`);
  return data;
}

export async function getPurchaseOrders(tenantCode?: string | null) {
  const tenantId = await getTenantId(tenantCode);
  const { data, error } = await supabaseAdmin
    .from("purchase_orders")
    .select(`
      id,
      po_code,
      order_date,
      expected_delivery_date,
      actual_delivery_date,
      subtotal_amount,
      tax_amount,
      total_amount,
      currency,
      status,
      payment_status,
      notes,
      vendors ( legal_name, vendor_code )
    `)
    .eq("tenant_id", tenantId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching purchase orders:", error);
    throw new Error(error.message);
  }

  return (data || []).map((po: Record<string, unknown>) => ({
    id: po.id,
    code: po.po_code,
    vendorName: (po.vendors as Record<string, unknown>)?.legal_name || "Sin proveedor",
    vendorCode: (po.vendors as Record<string, unknown>)?.vendor_code || "",
    orderDate: po.order_date ? String(po.order_date).substring(0, 10) : "",
    expectedDeliveryDate: po.expected_delivery_date ? String(po.expected_delivery_date).substring(0, 10) : "",
    actualDeliveryDate: po.actual_delivery_date ? String(po.actual_delivery_date).substring(0, 10) : "",
    subtotalAmount: Number(po.subtotal_amount),
    taxAmount: Number(po.tax_amount),
    totalAmount: Number(po.total_amount),
    currency: po.currency || "COP",
    status: po.status as "BORRADOR" | "ENVIADA" | "APROBADA" | "EN_CAMINO" | "RECIBIDO_PARCIAL" | "RECIBIDO" | "CANCELADA",
    paymentStatus: po.payment_status as "PENDIENTE" | "PARCIALMENTE_PAGADA" | "PAGADA",
    notes: po.notes || "",
  }));
}

export async function getPurchaseOrderDetail(
  tenantCode: string | null,
  poId: string
) {
  const tenantId = await getTenantId(tenantCode);
  const { data: po, error: poError } = await supabaseAdmin
    .from("purchase_orders")
    .select(`
      *,
      vendors ( id, legal_name, vendor_code, tax_id, contact_email, contact_phone, city, payment_terms ),
      purchase_order_items ( id, line_number, description, quantity, unit, unit_price, line_total, received_quantity, quality_checked, item_id, inventory_items ( item_code, name, unit ) )
    `)
    .eq("id", poId)
    .eq("tenant_id", tenantId)
    .is("deleted_at", null)
    .single();

  if (poError || !po) {
    console.error("Error fetching PO detail:", poError);
    throw new Error(poError?.message || "Orden de compra no encontrada.");
  }

  return po;
}

export async function createPurchaseOrder(
  tenantCode: string | null,
  poData: {
    vendorId: string;
    expectedDeliveryDate?: string;
    notes?: string;
    items: {
      description: string;
      quantity: number;
      unit: string;
      unitPrice: number;
      itemId?: string;
    }[];
  }
) {
  const tenantId = await getTenantId(tenantCode);
  const userId = getUserId(tenantId);

  // Validate vendor
  const { data: vendor, error: vendorErr } = await supabaseAdmin
    .from("vendors")
    .select("id, legal_name")
    .eq("id", poData.vendorId)
    .eq("tenant_id", tenantId)
    .is("deleted_at", null)
    .single();

  if (vendorErr || !vendor) {
    throw new Error("Proveedor no encontrado o inactivo.");
  }

  // Calculate totals
  const subtotal = poData.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const taxAmount = 0; // IVA handled separately per jurisdiction
  const totalAmount = subtotal + taxAmount;

  // Generate PO code
  const { count } = await supabaseAdmin
    .from("purchase_orders")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenantId);

  const seq = (count || 0) + 1;
  const code = `OC-2026-${String(seq).padStart(4, "0")}`;

  // Insert PO header
  const { data: po, error: poError } = await supabaseAdmin
    .from("purchase_orders")
    .insert({
      tenant_id: tenantId,
      po_code: code,
      vendor_id: poData.vendorId,
      order_date: new Date().toISOString().substring(0, 10),
      expected_delivery_date: poData.expectedDeliveryDate || null,
      subtotal_amount: subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      currency: "COP",
      status: "BORRADOR",
      payment_status: "PENDIENTE",
      notes: poData.notes || null,
      created_by: userId,
    })
    .select()
    .single();

  if (poError) {
    console.error("Error creating purchase order:", poError);
    throw new Error(poError.message);
  }

  // Insert PO items
  if (poData.items.length > 0) {
    const items = poData.items.map((item, idx) => ({
      tenant_id: tenantId,
      purchase_order_id: po.id,
      line_number: idx + 1,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit || "u.",
      unit_price: item.unitPrice,
      item_id: item.itemId || null,
      created_by: userId,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("purchase_order_items")
      .insert(items);

    if (itemsError) {
      console.error("Error creating PO items:", itemsError);
      throw new Error(itemsError.message);
    }
  }

  revalidatePath(`/dashboard/purchases`);
  return po;
}

export async function updatePurchaseOrderStatus(
  tenantCode: string | null,
  poId: string,
  newStatus: string
) {
  const tenantId = await getTenantId(tenantCode);
  const userId = getUserId(tenantId);

  const updates: Record<string, unknown> = {
    status: newStatus,
    updated_by: userId,
    updated_at: new Date().toISOString(),
  };

  if (newStatus === "RECIBIDO" || newStatus === "RECIBIDO_PARCIAL") {
    updates.actual_delivery_date = new Date().toISOString().substring(0, 10);
  }

  if (newStatus === "CANCELADA") {
    updates.deleted_at = new Date().toISOString();
    updates.deleted_by = userId;
    updates.delete_reason = "Cancelada por el usuario";
  }

  const { data, error } = await supabaseAdmin
    .from("purchase_orders")
    .update(updates)
    .eq("id", poId)
    .eq("tenant_id", tenantId)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) {
    console.error("Error updating PO status:", error);
    throw new Error(error.message);
  }

  revalidatePath(`/dashboard/purchases`);
  return data;
}

export async function receivePurchaseOrderItems(
  tenantCode: string | null,
  poId: string,
  receivedItems: { itemId: string; receivedQty: number; qualityChecked: boolean }[]
) {
  const tenantId = await getTenantId(tenantCode);
  const userId = getUserId(tenantId);

  // Update received quantities
  for (const ri of receivedItems) {
    await supabaseAdmin
      .from("purchase_order_items")
      .update({
        received_quantity: ri.receivedQty,
        quality_checked: ri.qualityChecked,
      })
      .eq("id", ri.itemId)
      .eq("tenant_id", tenantId);
  }

  // Check if all items are fully received
  const { data: items } = await supabaseAdmin
    .from("purchase_order_items")
    .select("quantity, received_quantity")
    .eq("purchase_order_id", poId)
    .eq("tenant_id", tenantId);

  const allReceived = (items || []).every(
    (item: Record<string, unknown>) => Number(item.received_quantity) >= Number(item.quantity)
  );

  const newStatus = allReceived ? "RECIBIDO" : "RECIBIDO_PARCIAL";

  await supabaseAdmin
    .from("purchase_orders")
    .update({
      status: newStatus,
      actual_delivery_date: new Date().toISOString().substring(0, 10),
      updated_by: userId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", poId)
    .eq("tenant_id", tenantId);

  revalidatePath(`/dashboard/purchases`);
  return { status: newStatus, allReceived };
}