import * as fs from 'fs';
import * as path from 'path';

async function combineMigrations() {
    const migrationsDir = path.join(__dirname, '../supabase/migrations');
    const outputFile = path.join(__dirname, '../supabase_combined_migrations.sql');

    console.log('Buscando archivos de migración...');
    const files = fs.readdirSync(migrationsDir)
        .filter(f => f.endsWith('.sql'))
        .sort(); // Ordenar alfabéticamente para mantener el orden cronológico estricto

    console.log(`Encontrados ${files.length} archivos de migración.`);

    let combinedSql = `-- ==================================================\n`;
    combinedSql += `-- BASE DE DATOS COMPLETA: ERP B2B PREMIUM\n`;
    combinedSql += `-- Generado: ${new Date().toISOString()}\n`;
    combinedSql += `-- ==================================================\n\n`;

    for (const file of files) {
        const filePath = path.join(migrationsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        combinedSql += `-- --------------------------------------------------\n`;
        combinedSql += `-- MIGRACIÓN: ${file}\n`;
        combinedSql += `-- --------------------------------------------------\n`;
        combinedSql += fileContent;
        combinedSql += '\n\n';
        console.log(`✓ Agregado: ${file}`);
    }

    // SEMILLA DE DATOS DE PRUEBA Y DEMO WHITE LABEL
    combinedSql += `-- ==================================================\n`;
    combinedSql += `-- DATOS DE SEMILLA PARA DEMOSTRACIÓN (ACME Y APEX)\n`;
    combinedSql += `-- ==================================================\n\n`;

    combinedSql += `
-- 1. Insertar Tenants
INSERT INTO tenants (id, tenant_code, name, legal_name, tax_id, status) VALUES
('a0000000-0000-0000-0000-000000000000', 'ACME', 'Acme Corporativo', 'Acme Industrial S.A. de C.V.', 'ACM901201TR4', 'Activo'),
('b0000000-0000-0000-0000-000000000000', 'APEX', 'Apex Logística B2B', 'Apex Logistics B2B Group S.A. de C.V.', 'APX150508LL2', 'Activo')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, legal_name = EXCLUDED.legal_name, tax_id = EXCLUDED.tax_id;

-- 2. Insertar Usuarios por Defecto (Requeridos para auditoría y claves foráneas)
INSERT INTO users (id, tenant_id, employee_code, first_name, last_name, email, status) VALUES
('a9000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000000', 'EMP-ACME-01', 'Admin', 'Acme', 'admin@acme.com', 'Activo'),
('b9000000-0000-0000-0000-000000000000', 'b0000000-0000-0000-0000-000000000000', 'EMP-APEX-01', 'Admin', 'Apex', 'admin@apex.com', 'Activo')
ON CONFLICT (id) DO NOTHING;

-- 3. Crear Sedes Principales
INSERT INTO sites (id, tenant_id, site_code, name, status) VALUES
('a1000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000000', 'SITE-ACME', 'Sede Central Acme', 'Activo'),
('b1000000-0000-0000-0000-000000000000', 'b0000000-0000-0000-0000-000000000000', 'SITE-APEX', 'Sede Central Apex', 'Activo')
ON CONFLICT (id) DO NOTHING;

-- 4. Inicializar áreas estándar
SELECT seed_tenant_standard_areas('a0000000-0000-0000-0000-000000000000');
SELECT seed_tenant_standard_areas('b0000000-0000-0000-0000-000000000000');

-- 5. Insertar Áreas Fijas para Referencia Rápida
INSERT INTO areas (id, tenant_id, area_code, name, status) VALUES
('a7000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000000', 'ING', 'Ingeniería', 'Activo'),
('b7000000-0000-0000-0000-000000000000', 'b0000000-0000-0000-0000-000000000000', 'ING', 'Ingeniería', 'Activo')
ON CONFLICT (id) DO NOTHING;

-- 6. Insertar Bodegas (Warehouses - Principal y Secundaria para soportar Transferencias)
INSERT INTO warehouses (id, tenant_id, warehouse_code, name, is_active) VALUES
('a2000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000000', 'WH-ACME-01', 'Bodega Principal Acme', true),
('a2000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000000', 'WH-ACME-02', 'Bodega Secundaria Acme', true),
('b2000000-0000-0000-0000-000000000000', 'b0000000-0000-0000-0000-000000000000', 'WH-APEX-01', 'Bodega Principal Apex', true),
('b2000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000000', 'WH-APEX-02', 'Bodega Secundaria Apex', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Insertar Clientes
INSERT INTO clients (id, tenant_id, client_code, tax_id, name, segment, email, status) VALUES
('a3000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000000', 'CLI-0001', 'ACM901201TR4', 'Acme Industrial S.A. de C.V.', 'Industrial', 'contacto@acme.com', 'ACTIVO'),
('a3000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000000', 'CLI-0002', 'COR851015AB4', 'Distribuidora Comercial del Centro', 'Comercial', 'ventas@centro.com', 'ACTIVO'),
('b3000000-0000-0000-0000-000000000000', 'b0000000-0000-0000-0000-000000000000', 'CLI-0001', 'APX150508LL2', 'Apex Logistics B2B Group', 'Corporativo', 'info@apexlogistics.com', 'ACTIVO')
ON CONFLICT (id) DO NOTHING;

-- 8. Insertar Requerimientos por Defecto (Requeridos por Jobs)
INSERT INTO requirements (id, tenant_id, requirement_code, client_id, title, category, created_by, status) VALUES
('a8000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000000', 'REQ-ACME-01', 'a3000000-0000-0000-0000-000000000000', 'Requerimiento de Climatización', 'MANTENIMIENTO', 'a9000000-0000-0000-0000-000000000000', 'OT_GENERADA'),
('b8000000-0000-0000-0000-000000000000', 'b0000000-0000-0000-0000-000000000000', 'REQ-APEX-01', 'b3000000-0000-0000-0000-000000000000', 'Requerimiento de Logística de Frío', 'MANTENIMIENTO', 'b9000000-0000-0000-0000-000000000000', 'OT_GENERADA')
ON CONFLICT (id) DO NOTHING;

-- 9. Insertar Artículos (Inventory Items)
INSERT INTO inventory_items (id, tenant_id, item_code, name, sku, category, unit_type, purchase_price, average_cost, current_stock) VALUES
('a4000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000000', 'ART-0001', 'Compresor Industrial 10HP', 'SKU-COMP-10', 'Equipos', 'Unidad', 1200.00, 1200.00, 15),
('a4000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000000', 'ART-0002', 'Tubo Cobre 1/2 pulgada', 'SKU-TUB-12', 'Materiales', 'Metro', 15.50, 15.50, 200),
('b4000000-0000-0000-0000-000000000000', 'b0000000-0000-0000-0000-000000000000', 'ART-0001', 'Filtro de Aire Premium', 'SKU-FILT-PR', 'Repuestos', 'Unidad', 45.00, 45.00, 50)
ON CONFLICT (id) DO NOTHING;

-- 10. Insertar Stock Físico Asociado
INSERT INTO inventory_stock (tenant_id, warehouse_id, item_id, quantity, reserved_quantity, available_quantity) VALUES
('a0000000-0000-0000-0000-000000000000', 'a2000000-0000-0000-0000-000000000000', 'a4000000-0000-0000-0000-000000000000', 15, 0, 15),
('a0000000-0000-0000-0000-000000000000', 'a2000000-0000-0000-0000-000000000000', 'a4000000-0000-0000-0000-000000000001', 200, 0, 200),
('a0000000-0000-0000-0000-000000000000', 'a2000000-0000-0000-0000-000000000001', 'a4000000-0000-0000-0000-000000000000', 5, 0, 5),
('b0000000-0000-0000-0000-000000000000', 'b2000000-0000-0000-0000-000000000000', 'b4000000-0000-0000-0000-000000000000', 50, 0, 50),
('b0000000-0000-0000-0000-000000000000', 'b2000000-0000-0000-0000-000000000001', 'b4000000-0000-0000-0000-000000000000', 10, 0, 10)
ON CONFLICT (tenant_id, warehouse_id, item_id) DO NOTHING;

-- 11. Insertar algunos Trabajos (Jobs)
INSERT INTO jobs (id, tenant_id, job_code, client_id, requirement_id, site_id, area_id, title, description, priority, status, planned_start_date, planned_end_date) VALUES
('a5000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000000', 'JOB-0001', 'a3000000-0000-0000-0000-000000000000', 'a8000000-0000-0000-0000-000000000000', 'a1000000-0000-0000-0000-000000000000', 'a7000000-0000-0000-0000-000000000000', 'Instalación de Sistema Chillers', 'Montaje y puesta en marcha de chiller central.', 'HIGH', 'PENDIENTE', '2026-07-01', '2026-07-15'),
('b5000000-0000-0000-0000-000000000000', 'b0000000-0000-0000-0000-000000000000', 'JOB-0001', 'b3000000-0000-0000-0000-000000000000', 'b8000000-0000-0000-0000-000000000000', 'b1000000-0000-0000-0000-000000000000', 'b7000000-0000-0000-0000-000000000000', 'Mantenimiento Correctivo de Ductos', 'Revisión y sellado de fugas en ductos principales.', 'MEDIUM', 'EN_EJECUCION', '2026-06-20', '2026-06-25')
ON CONFLICT (id) DO NOTHING;

-- 12. Insertar Actividades del Trabajo
INSERT INTO job_activities (id, tenant_id, job_id, activity_code, name, description, status, planned_start_date, planned_end_date) VALUES
('a5100000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000000', 'a5000000-0000-0000-0000-000000000000', 'JOB-0001-01', 'Cimentación de Bases', 'Preparar bases metálicas y nivelación.', 'PENDIENTE', '2026-07-01', '2026-07-05'),
('b5100000-0000-0000-0000-000000000000', 'b0000000-0000-0000-0000-000000000000', 'b5000000-0000-0000-0000-000000000000', 'JOB-0001-01', 'Limpieza e Inspección', 'Retiro de rejillas e inspección interna.', 'COMPLETADA', '2026-06-20', '2026-06-22')
ON CONFLICT (id) DO NOTHING;
`;

    fs.writeFileSync(outputFile, combinedSql, 'utf8');
    console.log(`\n[ÉXITO] Todas las migraciones y datos semilla combinados en: ${outputFile}`);
}

combineMigrations().catch(err => {
    console.error('Error combinando migraciones:', err);
});
