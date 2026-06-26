-- ============================================================
-- MIGRACIÓN: Brechas Técnicas de Producción
-- Fecha: 2026-06-26
-- Descripción: Tablas faltantes para Compras, Pagos Wompi,
--              Chat Soporte y búsqueda de catálogo
-- ============================================================

-- =============================================
-- 1. PROVEEDORES (Vendors)
-- =============================================
CREATE TABLE IF NOT EXISTS vendors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    vendor_code varchar(50) NOT NULL,
    legal_name varchar(250) NOT NULL,
    tax_id varchar(100),
    contact_name varchar(150),
    contact_email varchar(250),
    contact_phone varchar(50),
    address text,
    city varchar(100),
    country varchar(100) DEFAULT 'Colombia',
    payment_terms int DEFAULT 30,
    bank_name varchar(150),
    bank_account varchar(100),
    status varchar(50) NOT NULL DEFAULT 'ACTIVO' CHECK (status IN ('ACTIVO', 'INACTIVO', 'SUSPENDIDO')),
    notes text,
    rating int CHECK (rating >= 1 AND rating <= 5),

    -- Trazabilidad y Soft Delete
    created_at timestamp NOT NULL DEFAULT NOW(),
    created_by uuid REFERENCES users(id) ON DELETE SET NULL,
    updated_at timestamp,
    updated_by uuid REFERENCES users(id) ON DELETE SET NULL,
    deleted_at timestamp,
    deleted_by uuid REFERENCES users(id) ON DELETE SET NULL,
    delete_reason text,

    CONSTRAINT unique_tenant_vendor_code UNIQUE (tenant_id, vendor_code)
);

-- =============================================
-- 2. ÓRDENES DE COMPRA
-- =============================================
CREATE TABLE IF NOT EXISTS purchase_orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    po_code varchar(50) NOT NULL,
    vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    site_id uuid REFERENCES sites(id) ON DELETE SET NULL,

    order_date date NOT NULL DEFAULT CURRENT_DATE,
    expected_delivery_date date,
    actual_delivery_date date,

    subtotal_amount decimal(18,2) NOT NULL DEFAULT 0 CHECK (subtotal_amount >= 0),
    tax_amount decimal(18,2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
    total_amount decimal(18,2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    currency varchar(10) DEFAULT 'COP',

    status varchar(50) NOT NULL DEFAULT 'BORRADOR' CHECK (status IN (
        'BORRADOR', 'ENVIADA', 'APROBADA', 'EN_CAMINO', 'RECIBIDO_PARCIAL', 'RECIBIDO', 'CANCELADA'
    )),
    payment_status varchar(50) NOT NULL DEFAULT 'PENDIENTE' CHECK (payment_status IN (
        'PENDIENTE', 'PARCIALMENTE_PAGADA', 'PAGADA'
    )),

    notes text,
    internal_notes text,

    -- Trazabilidad y Soft Delete
    created_at timestamp NOT NULL DEFAULT NOW(),
    created_by uuid REFERENCES users(id) ON DELETE SET NULL,
    updated_at timestamp,
    updated_by uuid REFERENCES users(id) ON DELETE SET NULL,
    deleted_at timestamp,
    deleted_by uuid REFERENCES users(id) ON DELETE SET NULL,
    delete_reason text,

    CONSTRAINT unique_tenant_po_code UNIQUE (tenant_id, po_code)
);

-- =============================================
-- 3. ÍTEMS DE ÓRDEN DE COMPRA
-- =============================================
CREATE TABLE IF NOT EXISTS purchase_order_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    purchase_order_id uuid NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    item_id uuid REFERENCES inventory_items(id) ON DELETE SET NULL,

    line_number int NOT NULL,
    description varchar(500) NOT NULL,
    quantity decimal(18,4) NOT NULL CHECK (quantity > 0),
    unit varchar(20) NOT NULL DEFAULT 'u.',
    unit_price decimal(18,2) NOT NULL CHECK (unit_price >= 0),
    line_total decimal(18,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,

    received_quantity decimal(18,4) NOT NULL DEFAULT 0 CHECK (received_quantity >= 0),
    quality_checked boolean NOT NULL DEFAULT false,

    -- Trazabilidad
    created_at timestamp NOT NULL DEFAULT NOW(),
    created_by uuid REFERENCES users(id) ON DELETE SET NULL,

    CONSTRAINT unique_po_line UNIQUE (purchase_order_id, line_number)
);

-- =============================================
-- 4. PASARELA DE PAGOS - CONFIGURACIÓN
-- =============================================
CREATE TABLE IF NOT EXISTS payment_gateways (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    gateway_name varchar(100) NOT NULL,
    gateway_type varchar(50) NOT NULL CHECK (gateway_type IN ('WOMPI', 'STRIPE', 'MERCADO_PAGO', 'PAYPAL', 'OTRO')),

    -- Credenciales (en producción deberían estar en vault)
    public_key text,
    private_key text,
    api_url varchar(500),
    webhook_secret varchar(500),

    is_active boolean NOT NULL DEFAULT true,
    environment varchar(20) NOT NULL DEFAULT 'sandbox' CHECK (environment IN ('sandbox', 'production')),

    -- Trazabilidad
    created_at timestamp NOT NULL DEFAULT NOW(),
    created_by uuid REFERENCES users(id) ON DELETE SET NULL,
    updated_at timestamp,
    updated_by uuid REFERENCES users(id) ON DELETE SET NULL,

    CONSTRAINT unique_tenant_gateway UNIQUE (tenant_id, gateway_type)
);

-- =============================================
-- 5. TRANSACCIONES DE PASARELA
-- =============================================
CREATE TABLE IF NOT EXISTS payment_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    payment_id uuid REFERENCES payments(id) ON DELETE SET NULL,
    invoice_id uuid REFERENCES invoices(id) ON DELETE SET NULL,
    gateway_id uuid NOT NULL REFERENCES payment_gateways(id) ON DELETE RESTRICT,

    -- Datos Wompi
    transaction_id varchar(200),
    reference_id varchar(200) NOT NULL,
    status varchar(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN (
        'PENDING', 'APPROVED', 'DECLINED', 'ERROR', 'VOIDED', 'EXPIRED'
    )),
    amount decimal(18,2) NOT NULL CHECK (amount >= 0),
    currency varchar(10) DEFAULT 'COP',
    payment_method_type varchar(50),

    -- Datos de la transacción
    customer_email varchar(250),
    customer_name varchar(250),
    customer_phone varchar(50),

    -- Respuesta del gateway
    gateway_response jsonb,
    webhook_payload jsonb,
    webhook_received_at timestamp,

    -- Trazabilidad
    created_at timestamp NOT NULL DEFAULT NOW(),
    updated_at timestamp,
    created_by uuid REFERENCES users(id) ON DELETE SET NULL,

    CONSTRAINT unique_tenant_reference UNIQUE (tenant_id, reference_id)
);

-- =============================================
-- 6. CONCILIACIONES DE PAGO
-- =============================================
CREATE TABLE IF NOT EXISTS payment_reconciliations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    transaction_id uuid NOT NULL REFERENCES payment_transactions(id) ON DELETE RESTRICT,
    payment_id uuid NOT NULL REFERENCES payments(id) ON DELETE RESTRICT,

    reconciled_amount decimal(18,2) NOT NULL CHECK (reconciled_amount > 0),
    status varchar(50) NOT NULL DEFAULT 'CONCILIADA' CHECK (status IN (
        'PENDIENTE', 'CONCILIADA', 'DISCREPANCIA'
    )),
    notes text,

    reconciled_at timestamp NOT NULL DEFAULT NOW(),
    reconciled_by uuid REFERENCES users(id) ON DELETE SET NULL,

    created_at timestamp NOT NULL DEFAULT NOW()
);

-- =============================================
-- 7. CONVERSACIONES DE SOPORTE (CHAT)
-- =============================================
CREATE TABLE IF NOT EXISTS support_conversations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
    user_id uuid REFERENCES users(id) ON DELETE SET NULL,

    subject varchar(250),
    status varchar(50) NOT NULL DEFAULT 'ABIERTA' CHECK (status IN (
        'ABIERTA', 'EN_CURSO', 'ESPERA_CLIENTE', 'CERRADA'
    )),
    assigned_agent_id uuid REFERENCES users(id) ON DELETE SET NULL,

    last_message_at timestamp,
    last_message_preview text,

    -- Trazabilidad y Soft Delete
    created_at timestamp NOT NULL DEFAULT NOW(),
    created_by uuid REFERENCES users(id) ON DELETE SET NULL,
    updated_at timestamp,
    updated_by uuid REFERENCES users(id) ON DELETE SET NULL,
    deleted_at timestamp,
    deleted_by uuid REFERENCES users(id) ON DELETE SET NULL,
    delete_reason text
);

-- =============================================
-- 8. MENSAJES DE SOPORTE
-- =============================================
CREATE TABLE IF NOT EXISTS support_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    conversation_id uuid NOT NULL REFERENCES support_conversations(id) ON DELETE CASCADE,

    sender_type varchar(20) NOT NULL CHECK (sender_type IN ('CLIENT', 'AGENT', 'SYSTEM')),
    sender_id uuid REFERENCES users(id) ON DELETE SET NULL,
    sender_name varchar(150) NOT NULL,

    message_text text NOT NULL,
    message_type varchar(20) NOT NULL DEFAULT 'TEXT' CHECK (message_type IN ('TEXT', 'FILE', 'SYSTEM')),

    is_read boolean NOT NULL DEFAULT false,
    read_at timestamp,

    -- Trazabilidad
    created_at timestamp NOT NULL DEFAULT NOW()
);

-- =============================================
-- 9. ÍNDICES DE BÚSQUEDA FULL-TEXT PARA CATÁLOGO
-- =============================================

-- Índice GIN para búsqueda full-text en productos
CREATE INDEX IF NOT EXISTS idx_products_search_fts ON products
    USING GIN (to_tsvector('spanish', coalesce(name, '') || ' ' || coalesce(description, '')));

-- Índice para búsqueda por código de producto
CREATE INDEX IF NOT EXISTS idx_products_tenant_code ON products(tenant_id, product_code)
    WHERE deleted_at IS NULL;

-- Índice para búsqueda por familia
CREATE INDEX IF NOT EXISTS idx_products_tenant_family ON products(tenant_id, family_id)
    WHERE deleted_at IS NULL;

-- Índice para búsqueda en especificaciones de producto
CREATE INDEX IF NOT EXISTS idx_prod_specs_search ON product_specifications
    USING GIN (to_tsvector('spanish', coalesce(spec_name, '') || ' ' || coalesce(spec_value, '')));

-- Índice en mensajes de chat para búsqueda
CREATE INDEX IF NOT EXISTS idx_support_messages_conversation ON support_messages(conversation_id, created_at);

-- Índice en transacciones de pago
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(tenant_id, status);

-- Índice en órdenes de compra
CREATE INDEX IF NOT EXISTS idx_purchase_orders_vendor ON purchase_orders(tenant_id, vendor_id)
    WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(tenant_id, status)
    WHERE deleted_at IS NULL;

-- =============================================
-- 10. RLS (Row Level Security)
-- =============================================

-- Vendors
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
CREATE POLICY vendors_tenant_isolation ON vendors
    USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Purchase Orders
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY purchase_orders_tenant_isolation ON purchase_orders
    USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Purchase Order Items
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY po_items_tenant_isolation ON purchase_order_items
    USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Payment Gateways
ALTER TABLE payment_gateways ENABLE ROW LEVEL SECURITY;
CREATE POLICY pg_tenant_isolation ON payment_gateways
    USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Payment Transactions
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY pt_tenant_isolation ON payment_transactions
    USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Payment Reconciliations
ALTER TABLE payment_reconciliations ENABLE ROW LEVEL SECURITY;
CREATE POLICY pr_tenant_isolation ON payment_reconciliations
    USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Support Conversations
ALTER TABLE support_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY sc_tenant_isolation ON support_conversations
    USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Support Messages
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY sm_tenant_isolation ON support_messages
    USING (tenant_id = current_setting('app.tenant_id')::uuid);