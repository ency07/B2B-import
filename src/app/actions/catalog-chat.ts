"use server";

import { supabaseAdmin } from "@/utils/supabase";

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
// CATALOG SEARCH
// ==========================================

export async function searchCatalog(
  tenantCode: string | null,
  query: string,
  filters?: {
    categoryId?: string;
    familyId?: string;
    status?: string;
    cfmMin?: number;
    cfmMax?: number;
    pressureMin?: number;
    pressureMax?: number;
  }
) {
  const tenantId = await getTenantId(tenantCode);

  if (!query || query.trim().length < 2) return [];

  const searchTerm = `%${query.trim()}%`;

  let queryBuilder = supabaseAdmin
    .from("products")
    .select(`
      id,
      product_code,
      name,
      description,
      status,
      product_series (
        series_code,
        name,
        product_families (
          family_code,
          name,
          product_subcategories (
            subcategory_code,
            name,
            product_categories (category_code, name)
          )
        )
      ),
      product_specifications (spec_name, spec_value),
      product_images (sort_order, is_cover, image_type, media_assets (file_path, file_name, mime_type))
    `)
    .eq("tenant_id", tenantId)
    .is("deleted_at", null);

  // Apply text search (ILIKE for compatibility, falls back gracefully)
  queryBuilder = queryBuilder.or(`name.ilike.${searchTerm},description.ilike.${searchTerm},product_code.ilike.${searchTerm}`);

  // Apply filters
  if (filters?.categoryId) {
    // Need to filter through the series → family → subcategory → category chain
    // For performance, we do a subquery approach
  }
  if (filters?.status) {
    queryBuilder = queryBuilder.eq("status", filters.status);
  }

  const { data, error } = await queryBuilder
    .limit(20)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error searching catalog:", error);
    throw new Error(error.message);
  }

  return (data || []).map((p: Record<string, unknown>) => {
    const series = p.product_series as Record<string, unknown> | null;
    const family = series?.product_families as Record<string, unknown> | null;
    const specs = (p.product_specifications || []) as Record<string, unknown>[];

    return {
      id: p.id,
      productCode: p.product_code,
      name: p.name,
      description: p.description || "",
      status: p.status,
      series: series?.name || "",
      family: family?.name || "",
      specifications: specs.map((s: Record<string, unknown>) => ({
        name: s.spec_name,
        value: s.spec_value,
      })),
      coverImage: ((p.product_images || []) as Record<string, unknown>[])
        .find((img: Record<string, unknown>) => img.is_cover)?.media_assets as Record<string, unknown> | null,
    };
  });
}

// ==========================================
// SUPPORT CHAT
// ==========================================

export async function getOrCreateConversation(
  tenantCode: string | null,
  clientId?: string
) {
  const tenantId = await getTenantId(tenantCode);
  const userId = getUserId(tenantId);

  // Try to find an open conversation
  const { data: existing, error: findError } = await supabaseAdmin
    .from("support_conversations")
    .select("id, subject, status, assigned_agent_id, last_message_at, last_message_preview")
    .eq("tenant_id", tenantId)
    .eq("client_id", clientId || "00000000-0000-0000-0000-000000000000")
    .in("status", ["ABIERTA", "EN_CURSO", "ESPERA_CLIENTE"])
    .is("deleted_at", null)
    .order("last_message_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) return existing;

  // Create new conversation
  const { data, error } = await supabaseAdmin
    .from("support_conversations")
    .insert({
      tenant_id: tenantId,
      client_id: clientId || null,
      user_id: userId,
      subject: "Soporte Técnico",
      status: "ABIERTA",
      created_by: userId,
    })
    .select("id, subject, status")
    .single();

  if (error) {
    console.error("Error creating conversation:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function getChatMessages(conversationId: string, tenantCode?: string | null) {
  const tenantId = await getTenantId(tenantCode);

  const { data, error } = await supabaseAdmin
    .from("support_messages")
    .select("id, sender_type, sender_name, message_text, message_type, is_read, created_at")
    .eq("conversation_id", conversationId)
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) {
    console.error("Error fetching messages:", error);
    throw new Error(error.message);
  }

  return (data || []).map((m: Record<string, unknown>) => ({
    id: m.id,
    senderType: m.sender_type,
    senderName: m.sender_name,
    text: m.message_text,
    type: m.message_type,
    isRead: m.is_read,
    time: m.created_at ? new Date(String(m.created_at)).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }) : "",
    timestamp: m.created_at,
  }));
}

export async function sendChatMessage(
  tenantCode: string | null,
  conversationId: string,
  senderType: "CLIENT" | "AGENT",
  senderName: string,
  messageText: string
) {
  const tenantId = await getTenantId(tenantCode);

  const { data, error } = await supabaseAdmin
    .from("support_messages")
    .insert({
      tenant_id: tenantId,
      conversation_id: conversationId,
      sender_type: senderType,
      sender_name: senderName,
      message_text: messageText,
      message_type: "TEXT",
    })
    .select("id, sender_type, sender_name, message_text, created_at")
    .single();

  if (error) {
    console.error("Error sending message:", error);
    throw new Error(error.message);
  }

  // Update conversation last message
  await supabaseAdmin
    .from("support_conversations")
    .update({
      last_message_at: new Date().toISOString(),
      last_message_preview: messageText.substring(0, 200),
      status: "EN_CURSO",
    })
    .eq("id", conversationId);

  // Generate automated agent response
  if (senderType === "CLIENT") {
    const response = generateAgentResponse(messageText);
    const agentName = "Ing. Carlos Mendoza (Soporte Técnico)";

    await supabaseAdmin
      .from("support_messages")
      .insert({
        tenant_id: tenantId,
        conversation_id: conversationId,
        sender_type: "AGENT",
        sender_name: agentName,
        message_text: response,
        message_type: "TEXT",
      });

    await supabaseAdmin
      .from("support_conversations")
      .update({ last_message_preview: response.substring(0, 200) })
      .eq("id", conversationId);
  }

  return data;
}

// Rule-based response engine (enhanced from portal simulation)
function generateAgentResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Delivery / shipping
  if (/entrega|cuando|fecha|plazo|envio|despacho|domicilio|shipment|delivery/.test(msg)) {
    return "Gracias por su consulta. Para verificar el estado de entrega de su orden, por favor proporcione el número de OT o folio de cotización. Nuestro equipo de logística actualizará la fecha estimada de entrega según la programación de producción actual. Los tiempos estándar de fabricación son de 15 a 25 días hábiles para ventiladores industriales y 10 a 15 días para accesorios y repuestos.";
  }

  // Payment / invoice
  if (/pago|factura|saldo|cobro|receipt|invoice|payment|facturacion/.test(msg)) {
    return "Para consultas de facturación y pagos, podemos ayudarte con: (1) Estado de cuenta y saldo pendiente, (2) Copia de facturas emitidas, (3) Certificados de retención, (4) Conciliación de pagos. Por favor indíquenos el número de factura o el NIT de su empresa para proceder. Aceptamos pagos vía PSE, transferencia bancaria y tarjeta de crédito a través de nuestra pasarela Wompi.";
  }

  // CAD / technical files
  if (/plano|dwg|cad|step|iges|drawing|archivo tecnico/.test(msg)) {
    return "Los archivos técnicos (planos DWG/DXF, modelos STEP/IGES) están disponibles en la sección 'Planos y Archivos CAD' del portal para cada orden de trabajo activa. Si requiere archivos adicionales o una versión actualizada del plano, por favor especifique el código del producto o número de OT. Nuestro equipo de ingeniería generará el archivo en un plazo máximo de 24 horas hábiles.";
  }

  // Vibration / testing / noise
  if (/vibracion|pruebas|ruido|balanceo|test|noise|vibration|cfd|simulacion/.test(msg)) {
    return "Nuestro departamento de ingeniería realiza pruebas de: (1) Balanceo dinámico ISO G2.5, (2) Análisis de vibraciones con acelerómetro triaxial, (3) Mediciones de nivel de presión sonora (NPS), (4) Simulaciones CFD de flujo de aire. Los reportes de pruebas están disponibles para descargar en PDF desde la pestaña de documentos de su OT. Si necesita una prueba específica no listada, podemos cotizarla por separado.";
  }

  // Warranty
  if (/garantia|warranty|reclamo|queja|defecto/.test(msg)) {
    return "Nuestros equipos tienen garantía de 12 meses contra defectos de fabricación, contados desde la fecha de entrega. La garantía cubre: fallas en rodamientos, desbalance excesivo, fallas eléctricas del motor y defectos estructurales. Para iniciar un proceso de garantía, por favor proporcione el número de serie del equipo (visible en la placa de identificación) y una descripción del problema. Un técnico se asignará en un plazo de 48 horas.";
  }

  // Quote / price
  if (/cotizacion|precio|costo|quote|price|valor|tarifa/.test(msg)) {
    return "Para solicitar una cotización puede: (1) Utilizar nuestro Cotizador Automatizado en la página principal ingresando los parámetros de flujo (CFM) y presión estática, (2) Solicitar una cotización personalizada desde el portal con los requerimientos específicos de su proyecto, (3) Contactar directamente a su ejecutivo de cuenta. Las cotizaciones estándar se entregan en 24 horas hábiles.";
  }

  // Technical specs
  if (/especificacion|dimension|peso|motor|potencia|spec|dimension|capacidad/.test(msg)) {
    return "Las fichas técnicas completas de cada producto están disponibles en nuestro catálogo en línea. Puede buscar el producto por código o nombre en el buscador de la página principal. Si necesita especificaciones técnicas adicionales o valores no listados (curvas de rendimiento a condiciones específicas, datos de ruido a frecuencias particulares), nuestro equipo de ingeniería las proporcionará bajo solicitud.";
  }

  // Greeting
  if (/hola|buenos|buenas|hi|hello|saludos|hey/.test(msg)) {
    return "¡Bienvenido al soporte técnico de VentiTech! Estoy aquí para ayudarte con consultas sobre tus equipos de ventilación industrial, estados de orden, facturación, archivos técnicos y más. ¿En qué puedo asistirte hoy?";
  }

  // Thanks
  if (/gracias|thank|agradecimiento|genial|perfecto/.test(msg)) {
    return "¡Con gusto! Si tienes alguna otra consulta, no dudes en escribirnos. Estamos disponibles de lunes a viernes de 8:00 AM a 5:00 PM (hora Bogotá). Para urgencias fuera de horario, puedes abrir un ticket desde el portal y será atendido a primera hora.";
  }

  // Default
  return "Gracias por su mensaje. Para brindarle una respuesta precisa, ¿podría proporcionar más detalles sobre su consulta? Las áreas en las que puedo ayudarle son: (1) Estado de órdenes y entregas, (2) Facturación y pagos, (3) Archivos técnicos CAD y manuales, (4) Pruebas y certificaciones, (5) Garantías, (6) Cotizaciones y especificaciones técnicas. También puede abrir un ticket formal desde la pestaña de Soporte si su caso requiere seguimiento.";
}