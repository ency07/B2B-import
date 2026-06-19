# Lista de Tareas

## FASE 5: Motor de Aprobaciones
- [x] Crear migraciÃ³n SQL de Fase 5 (`supabase/migrations/20260617000005_approvals_core.sql`)
- [x] Implementar script de pruebas automatizadas (`scripts/test-aprobaciones.ts`)
- [x] Ejecutar y validar pruebas locales de aprobaciones
- [x] Generar walkthrough y reporte final de FASE 5 (`FASE5_IMPLEMENTATION_REPORT.md`)

## FASE 6: Trabajos y Actividades (Orden de Trabajo)
- [x] Consolidar respuestas oficiales en PROJECT_MEMORY.md y plan de implementaciÃ³n
- [x] Crear e implementar migraciÃ³n SQL de Fase 6 (`supabase/migrations/20260617000006_jobs_core.sql`)
- [x] Ajustar triggers de validaciÃ³n bidireccional de fechas planificadas
- [x] Refinar propagaciÃ³n de finalizaciÃ³n para excluir actividades canceladas
- [x] Agregar rol GERENTE en la validaciÃ³n de permisos de creaciÃ³n manual
- [x] Implementar script de pruebas automatizadas (`scripts/test-trabajos.ts`)
- [x] Ejecutar y validar pruebas sintÃ¡cticas de trabajos y actividades
- [x] Actualizar reporte final de FASE 6 (`FASE6_IMPLEMENTATION_REPORT.md`) y walkthrough.md

## FASE 7: Inventarios (Bodegas, ArtÃ­culos y Movimientos)
- [x] Consolidar respuestas oficiales en PROJECT_MEMORY.md, MASTER_INDEX.md y DOCUMENT_TRACEABILITY.md
- [x] Crear e implementar migraciÃ³n SQL de Fase 7 (`supabase/migrations/20260617000007_inventory_core.sql`)
- [x] Implementar triggers para cÃ³digos secuenciales (`WH-`, `ART-`, `MOV-`)
- [x] Implementar triggers para recalcular costos promedio y Ãºltimo costo en entradas
- [x] DiseÃ±ar control de stock negativo y stock disponible no negativo
- [x] Implementar atÃ³micamente transferencias entre bodegas
- [x] Asociar salidas a trabajos (`job_id` y `activity_id`) y disparar evento `JOB_MATERIAL_CONSUMED`
- [x] Habilitar roles y permisos (`ALMACENISTA`, `JEFE_INVENTARIO`, `GERENTE`)
- [x] Habilitar Row Level Security (RLS) y soft delete
- [x] Crear script de validaciÃ³n automatizada (`scripts/test-inventario.ts`)
- [x] Validar sintaxis y RLS de inventario localmente
- [x] Registrar reporte de cierre (`FASE7_IMPLEMENTATION_REPORT.md`) y walkthrough.md

## FASE 8: FacturaciÃ³n y Pagos
- [x] Consolidar respuestas oficiales en PROJECT_MEMORY.md, MASTER_INDEX.md y DOCUMENT_TRACEABILITY.md
- [x] Crear e implementar migraciÃ³n SQL de Fase 8 (`supabase/migrations/20260617000008_invoices_core.sql`)
- [x] Implementar triggers de secuencia para facturas (`FAC-`), pagos (`PAG-`) y anticipos (`ANT-`)
- [x] DiseÃ±ar detalle de factura (`invoice_items`) e impuestos congelados (`invoice_taxes`) al emitir
- [x] Implementar triggers para cÃ¡lculo de totales de lÃ­nea y actualizaciÃ³n de acumuladores de cabecera
- [x] Implementar control de inmutabilidad estricta tras la emisiÃ³n
- [x] DiseÃ±ar plazos de vencimiento y validaciones de fechas
- [x] Implementar aplicaciÃ³n automÃ¡tica de pagos a facturas con recÃ¡lculo de estados (`PENDIENTE` -> `PARCIALMENTE_PAGADA` -> `PAGADA`)
- [x] Implementar anticipos de clientes en `customer_advances` para pagos sin factura
- [x] Habilitar roles y permisos (`AUXILIAR_FINANZAS`, `JEFE_FINANZAS`, `GERENTE`)
- [x] Habilitar Row Level Security (RLS) y soft delete
- [x] Crear script de validaciÃ³n automatizada (`scripts/test-facturas.ts`)
- [x] Validar sintaxis y RLS de facturaciÃ³n localmente
- [x] Registrar reporte de cierre (`FASE8_IMPLEMENTATION_REPORT.md`) y walkthrough.md

## FASE 10: GarantÃ­as (Postventa)
- [x] Consolidar diseÃ±o en PROJECT_MEMORY.md, MASTER_INDEX.md y DOCUMENT_TRACEABILITY.md
- [x] Crear e implementar migraciÃ³n SQL de Fase 10 (`supabase/migrations/20260617000010_warranties_core.sql`)
- [x] Implementar triggers de secuencia para garantÃ­as (`GAR-`) e intervenciones (`INT-`)
- [x] Implementar trigger para creaciÃ³n automÃ¡tica de garantÃ­as al pasar un Job a 'CERRADO' (vigencia 12 meses)
- [x] Implementar trigger para cambio automÃ¡tico de estado de garantÃ­a a 'EJECUTADA'/'ACTIVA' segÃºn intervenciones asociadas
- [x] Implementar trigger para actualizar dinÃ¡micamente el estado 'VENCIDA'
- [x] Implementar bloqueo de intervenciones en garantÃ­as no activas
- [x] Agregar columna `warranty_intervention_id` en `inventory_movements`
- [x] Habilitar RLS, soft delete, auditorÃ­a y trazabilidad estÃ¡ndar
- [x] Crear script de validaciÃ³n automatizada (`scripts/test-garantias.ts`)
- [x] Validar sintaxis y RLS de garantÃ­as localmente
- [x] Registrar reporte de cierre (`FASE10_IMPLEMENTATION_REPORT.md`) y walkthrough.md

## FASE 11: Web PÃºblica y CatÃ¡logo TÃ©cnico (Website)
- [x] Consolidar diseÃ±o en PROJECT_MEMORY.md y MASTER_INDEX.md
- [x] Crear e implementar migraciÃ³n SQL de Fase 11 (`supabase/migrations/20260617000011_website_core.sql`)
- [x] Implementar triggers de secuencia para cÃ³digos (`PAG-`, `FRM-`, `LED-`, `CAT-`, `FAM-`, `PRO-`)
- [x] Habilitar RLS en las 11 tablas del mÃ³dulo
- [x] Habilitar prevenciÃ³n de borrado fÃ­sico y soft delete
- [x] Habilitar triggers de logs de auditorÃ­a y trazabilidad estÃ¡ndar
- [x] Crear script de validaciÃ³n automatizada (`scripts/test-website.ts`)
- [x] Validar sintaxis y RLS de website localmente
- [x] Registrar reporte de cierre (`FASE11_IMPLEMENTATION_REPORT.md`) y walkthrough.md

## FASE 12: Wizard / Cotizador
- [x] Consolidar diseÃ±o en PROJECT_MEMORY.md y MASTER_INDEX.md
- [x] Crear e implementar migraciÃ³n SQL de Fase 12 (`supabase/migrations/20260617000012_wizard_core.sql`)
- [x] Implementar triggers de secuencia para cÃ³digos (`DIA-`)
- [x] Habilitar RLS en las 2 tablas del mÃ³dulo
- [x] Habilitar prevenciÃ³n de borrado fÃ­sico y soft delete
- [x] Habilitar triggers de logs de auditorÃ­a y trazabilidad estÃ¡ndar
- [x] Crear script de validaciÃ³n automatizada (`scripts/test-wizard.ts`)
- [x] Validar sintaxis y RLS de wizard localmente
- [x] Registrar reporte de cierre (`FASE12_IMPLEMENTATION_REPORT.md`) y walkthrough.md

## FASE 13: CRM, Cotizaciones y Pipeline (ReutilizaciÃ³n)
- [x] Consolidar diseÃ±o en PROJECT_MEMORY.md y MASTER_INDEX.md
- [x] Crear e implementar migraciÃ³n SQL de Fase 13 (`supabase/migrations/20260617000013_crm_core.sql`)
- [x] Alterar `clients` para hacer `tax_id` nullable
- [x] Alterar `leads` para agregar claves forÃ¡neas `client_id` y `contact_id`
- [x] Crear la tabla `crm_activity_logs` con RLS y soft delete
- [x] Habilitar triggers de logs de auditorÃ­a y trazabilidad estÃ¡ndar
- [x] Crear script de validaciÃ³n automatizada (`scripts/test-crm.ts`)
- [x] Validar sintaxis y RLS del CRM localmente
- [x] Registrar reporte de cierre (`FASE13_IMPLEMENTATION_REPORT.md`) y walkthrough.md

## FASE 14: Marketing y SLA (ExtensiÃ³n de Leads)
- [x] Consolidar diseÃ±o en PROJECT_MEMORY.md y MASTER_INDEX.md
- [x] Crear e implementar migraciÃ³n SQL de Fase 14 (`supabase/migrations/20260617000014_marketing_core.sql`)
- [x] Alterar `leads` para agregar columnas de procedencia comercial, propietarios y SLA
- [x] Implementar trigger de cÃ¡lculo automÃ¡tico y evaluaciÃ³n de SLA (`handle_lead_sla_calculation`)
- [x] Implementar trigger de generaciÃ³n de eventos por incumplimiento de SLA (`validate_lead_sla_breach`)
- [x] Crear script de validaciÃ³n automatizada (`scripts/test-marketing.ts`)
- [x] Validar sintaxis y RLS del mÃ³dulo de marketing localmente
- [x] Registrar reporte de cierre (`FASE14_IMPLEMENTATION_REPORT.md`) y walkthrough.md

## FASE 15: Dashboards y KPIs
- [x] Crear migraciÃ³n SQL de Fase 15 (`supabase/migrations/20260617000015_dashboards_core.sql`)
- [x] Implementar trigger de cÃ³digos secuenciales correlativos (`handle_dashboard_sequences`)
- [x] Implementar trigger para garantizar una Ãºnica fÃ³rmula de KPI activa (`deactivate_other_kpi_formulas`)
- [x] Implementar funciÃ³n PL/pgSQL para cÃ¡lculo y registro de KPIs en el historial (`calculate_kpi`)
- [x] Habilitar Row Level Security (RLS), soft delete y triggers de auditorÃ­a en las 6 nuevas tablas
- [x] Implementar script de validaciÃ³n automatizada (`scripts/test-dashboards.ts`)
- [x] Ejecutar y validar pruebas locales de Dashboards y KPIs
- [x] Registrar reporte de cierre (`FASE15_IMPLEMENTATION_REPORT.md`) y walkthrough.md

## FASE 16: Costos y Aplicaciones Financieras (Costos, Presupuestos y Anticipos)
- [x] Crear migraciÃ³n SQL de Fase 16 (`supabase/migrations/20260617000016_costs_core.sql`)
- [x] Implementar trigger de cÃ³digos secuenciales correlativos para costos (`handle_cost_sequences`)
- [x] Implementar funciÃ³n helper de saldos financieros (`refresh_invoice_paid_amount`)
- [x] Redefinir trigger de pagos (`handle_payment_application`) para usar la funciÃ³n helper
- [x] Implementar triggers de validaciÃ³n y aplicaciÃ³n de anticipos (`validate_advance_application`)
- [x] Habilitar RLS, soft delete y triggers de auditorÃ­a en las 3 nuevas tablas
- [x] Implementar script de validaciÃ³n automatizada (`scripts/test-costos.ts`)
- [x] Ejecutar y validar pruebas locales de Costos y Aplicaciones Financieras
- [x] Registrar reporte de cierre (`FASE16_IMPLEMENTATION_REPORT.md`) y walkthrough.md

## FASE 17: Rentabilidad Comercial y Operativa (MÃ¡rgenes por Trabajo y Cliente)
- [x] Crear migraciÃ³n SQL de Fase 17 (`supabase/migrations/20260617000017_profitability_core.sql`)
- [x] Implementar vista SQL para rentabilidad por trabajo (`job_profitability`)
- [x] Implementar vista SQL para rentabilidad por cliente (`client_profitability`)
- [x] Habilitar herencia nativa de RLS RLS multi-tenant mediante `security_invoker = true`
- [x] Implementar script de validaciÃ³n automatizada (`scripts/test-rentabilidad.ts`)
- [x] Ejecutar y validar pruebas locales de Rentabilidad


## FASE 18: Motor de Documentos y Plantillas (GrapesJS + Handlebars + Puppeteer + Docxtemplater)
- [x] Ejecutar REUSE_ANALYSIS_FASE18 obligatorio (7 repos evaluados, 4 seleccionados)
- [x] Crear REUSE_ANALYSIS_FASE18.md en docs/00_GOVERNANCE/
- [x] Congelar decisiÃ³n D18-07: replace('{{variable}}') PROHIBIDO permanentemente
- [x] Crear migraciÃ³n SQL de Fase 18 (`supabase/migrations/20260617000018_documents_core.sql`)
- [x] Implementar tabla `document_templates` con columnas para GrapesJS + Handlebars + Puppeteer + Docxtemplater
- [x] Implementar tabla `document_outputs` con ciclo de vida PENDIENTEâGENERANDOâCOMPLETADO/ERROR
- [x] Implementar trigger de cÃ³digos secuenciales (`TPL-` y `DOC-`)
- [x] Implementar trigger de plantilla predeterminada Ãºnica por tipo (`enforce_single_default_template`)
- [x] Implementar trigger de timestamp de generaciÃ³n al completar (`handle_document_output_completion`)
- [x] Habilitar RLS, soft delete y triggers de auditorÃ­a en las 2 nuevas tablas
- [x] Implementar script de validaciÃ³n automatizada (`scripts/test-documentos.ts`)
- [x] Ejecutar y validar pruebas locales: 38/38 verificaciones aprobadas
- [x] Registrar reporte de cierre (`FASE18_IMPLEMENTATION_REPORT.md`)










## FASE 19: Sistema de Notificaciones y Alertas (IN_APP + EMAIL + WHATSAPP + TELEGRAM)
- [x] Ejecutar REUSE_ANALYSIS_FASE19 obligatorio (9 repos evaluados: Novu, grammY, Telegraf, Resend, Nodemailer, BullMQ, Ntfy, Gotify, Apprise)
- [x] Crear REUSE_ANALYSIS_FASE19.md en docs/00_GOVERNANCE/
- [x] Congelar D19-01 a D19-09 (routing por audiencia: Telegram para internos, WhatsApp para externos)
- [x] Extender tabla users: telegram_chat_id + telegram_username (D19-09)
- [x] Crear migración SQL de Fase 19 (supabase/migrations/20260617000019_notifications_core.sql)
- [x] Implementar tabla notification_templates (NTP- + 4 canales + Handlebars templates)
- [x] Implementar tabla notifications (NOT- + ciclo de vida PENDIENTE?ENVIANDO?ENTREGADA/FALLIDA)
- [x] Implementar tabla notification_preferences (horario silencio, enabled por canal+evento)
- [x] Trigger de códigos secuenciales (NTP- y NOT-)
- [x] Trigger de plantilla única activa por (channel, event_type)
- [x] Trigger de ciclo de vida (sent_at, failed_at, read_at automáticos)
- [x] Habilitar RLS con políticas diferenciadas (usuario solo ve SUS notificaciones)
- [x] Implementar script de validación automatizada (scripts/test-notificaciones.ts)
- [x] Ejecutar y validar pruebas locales: 45/45 verificaciones aprobadas
- [x] Registrar reporte de cierre (FASE19_IMPLEMENTATION_REPORT.md)


## FASE 20: Seguridad y Auditoría Avanzada
- [x] Ejecutar REUSE_ANALYSIS_FASE20 obligatorio (6 repos evaluados)
- [x] Crear REUSE_ANALYSIS_FASE20.md en docs/00_GOVERNANCE/
- [x] Congelar decisiones D20-01 a D20-06
- [x] Crear migración SQL de Fase 20 (supabase/migrations/20260617000020_security_audit_core.sql)
- [x] Implementar tabla user_access_logs (ACC-)
- [x] Implementar triggers de secuencia, prevención de borrado físico e inmutabilidad (BEFORE UPDATE)
- [x] Habilitar Row Level Security (RLS) con políticas para Super Admin, Auditor, registros propios e inserciones/actualizaciones autenticadas
- [x] Crear script de validación automatizada (scripts/test-seguridad-auditoria.ts)
- [x] Añadir comandos de prueba en package.json
- [x] Ejecutar y validar pruebas locales: 28/28 verificaciones aprobadas
- [x] Registrar reporte de cierre (FASE20_IMPLEMENTATION_REPORT.md) y actualizar walkthrough.md


## FASE 21: Hardening / Rendimiento
- [x] Ejecutar REUSE_ANALYSIS_FASE21 obligatorio (6 herramientas evaluadas)
- [x] Crear REUSE_ANALYSIS_FASE21.md en docs/00_GOVERNANCE/
- [x] Congelar decisiones D21-01 a D21-04
- [x] Crear migración SQL de Fase 21 (supabase/migrations/20260617000021_performance_hardening.sql)
- [x] Crear 28 índices parciales con la condición WHERE deleted_at IS NULL para claves foráneas y búsquedas calientes
- [x] Crear script de validación automatizada (scripts/test-performance-hardening.ts)
- [x] Añadir comandos de prueba en package.json
- [x] Ejecutar y validar pruebas locales: 29/29 verificaciones aprobadas
- [x] Registrar reporte de cierre (FASE21_IMPLEMENTATION_REPORT.md) y actualizar walkthrough.md


## FASE 22: Pruebas de Aceptación de Usuario (UAT)
- [x] Ejecutar REUSE_ANALYSIS_FASE22 obligatorio (5 frameworks/herramientas evaluados)
- [x] Crear REUSE_ANALYSIS_FASE22.md en docs/00_GOVERNANCE/
- [x] Congelar decisiones D22-01 a D22-04
- [x] Crear migración SQL de Fase 22 (supabase/migrations/20260617000022_uat_validation.sql)
- [x] Implementar script de validación automatizada (scripts/test-uat.ts) para validar el flujo completo de 12 pasos lógicos
- [x] Añadir script test:uat en package.json
- [x] Ejecutar y validar pruebas locales: 33/33 verificaciones aprobadas
- [x] Registrar reporte de cierre (FASE22_IMPLEMENTATION_REPORT.md) y actualizar walkthrough.md



## FASE 23: Release / Producci\u00f3n (Go-Live)
- [x] Ejecutar REUSE_ANALYSIS_FASE23 obligatorio (5 herramientas/servicios evaluados)
- [x] Crear REUSE_ANALYSIS_FASE23.md en docs/00_GOVERNANCE/
- [x] Detectar y corregir gap de seguridad: RLS faltante en tabla tenant_sequences
- [x] Registrar reporte de cierre (FASE21_IMPLEMENTATION_REPORT.md) y actualizar walkthrough.md


## FASE 22: Pruebas de Aceptación de Usuario (UAT)
- [x] Ejecutar REUSE_ANALYSIS_FASE22 obligatorio (5 frameworks/herramientas evaluados)
- [x] Crear REUSE_ANALYSIS_FASE22.md en docs/00_GOVERNANCE/
- [x] Congelar decisiones D22-01 a D22-04
- [x] Crear migración SQL de Fase 22 (supabase/migrations/20260617000022_uat_validation.sql)
- [x] Implementar script de validación automatizada (scripts/test-uat.ts) para validar el flujo completo de 12 pasos lógicos
- [x] Añadir script test:uat en package.json
- [x] Ejecutar y validar pruebas locales: 33/33 verificaciones aprobadas
- [x] Registrar reporte de cierre (FASE22_IMPLEMENTATION_REPORT.md) y actualizar walkthrough.md



## FASE 23: Release / ProducciÃ³n (Go-Live)
- [x] Ejecutar REUSE_ANALYSIS_FASE23 obligatorio (5 herramientas/servicios evaluados)
- [x] Crear REUSE_ANALYSIS_FASE23.md en docs/00_GOVERNANCE/
- [x] Detectar y corregir gap de seguridad: RLS faltante en tabla tenant_sequences
- [x] Crear migración SQL de Fase 23 (supabase/migrations/20260617000023_release_monitoring.sql)
- [x] Implementar vista performance_queries_summary sobre pg_stat_statements
- [x] Implementar script de validación automatizada (scripts/test-go-live.ts) con auditoría completa
- [x] Añadir script test:go-live en package.json
- [x] Ejecutar y validar pruebas locales: 113/113 verificaciones aprobadas
- [x] Registrar reporte de cierre (FASE23_IMPLEMENTATION_REPORT.md) y actualizar walkthrough.md


## FASE 31: Centro de Configuración Empresarial (Settings)
- [x] Ejecutar REUSE_ANALYSIS_GLOBAL_SETTINGS obligatorio
- [x] Crear migración SQL de Fase 31 (`supabase/migrations/20260617000031_settings_core.sql`)
- [x] Implementar tabla `tenant_settings` (módulos EMPRESA, LOCALIZACION, IDENTIDAD, DOCUMENTOS, ERP)
- [x] Crear funciones de utilidad `get_tenant_setting` y `set_tenant_setting` (UPSERT)
- [x] Habilitar RLS y políticas seguras (lectura pública por tenant, escritura restringida a administradores)
- [x] Implementar triggers de inmutabilidad física (bloqueo DELETE) y auditoría
- [x] Crear e indexar claves parciales (`WHERE deleted_at IS NULL`)
- [x] Crear script de validación automatizada (`scripts/test-settings.ts`)
- [x] Ejecutar y validar pruebas locales: 31/31 verificaciones aprobadas
- [x] Registrar reporte de cierre (`FASE31_IMPLEMENTATION_REPORT.md`) y actualizar walkthrough.md

## FASE 32: White Label (Branding Dinámico)
- [x] Validar alcance y requisitos en `docs/30_configuracion_global/2. FASE32_WHITE_LABEL.md`
- [x] Referenciar REUSE_ANALYSIS_GLOBAL_SETTINGS y justificaciones
- [x] Crear migración SQL de Fase 32 (`supabase/migrations/20260617000032_white_label.sql`)
- [x] Implementar soporte de branding dinámico (colores, fuentes, widgets)
- [x] Implementar personalización de pantallas críticas (Login, Carga, Error 404, Error 500)
- [x] Crear script de validación automatizada (`scripts/test-white-label.ts`)
- [x] Añadir comando de prueba en `package.json`
- [x] Ejecutar y validar pruebas locales de White Label
- [x] Registrar reporte de cierre (`FASE32_IMPLEMENTATION_REPORT.md`) y actualizar walkthrough.md

## FASE 33: Integraciones y Canales
- [x] Validar alcance y requisitos en `docs/30_configuracion_global/3. FASE33_INTEGRACIONES.md`
- [x] Ejecutar REUSE_ANALYSIS_FASE33 obligatorio
- [x] Crear migración SQL de Fase 33 (`supabase/migrations/20260617000033_integrations.sql`)
- [x] Implementar cifrado simétrico transparente (`pgcrypto`) para settings con `is_encrypted = true`
- [x] Redefinir `get_tenant_setting` para descifrado automático en lectura
- [x] Extender trigger de validación de teléfonos en formato E.164 para módulo `TELEFONIA`
- [x] Implementar funciones `get_notification_route` y `dispatch_notification_to_route` para enrutamiento dinámico
- [x] Crear script de validación automatizada (`scripts/test-integrations.ts`)
- [x] Añadir comando de prueba en `package.json`
- [x] Ejecutar y validar pruebas locales de Integraciones: 18/18 verificaciones aprobadas
- [x] Registrar reporte de cierre (`FASE33_IMPLEMENTATION_REPORT.md`) y actualizar walkthrough.md

## FASE 34: Administración Avanzada
- [x] Validar alcance y requisitos en `docs/30_configuracion_global/4. FASE34_ADMINISTRACION.md`
- [x] Crear migración SQL de Fase 34 (`supabase/migrations/20260617000034_advanced_admin.sql`)
- [x] Implementar tabla `custom_field_definitions` y validación dinámica de campos personalizados en tablas principales
- [x] Implementar soporte de personalización de perfiles y mapeo de menús
- [x] Crear script de validación automatizada (`scripts/test-advanced-admin.ts`)
- [x] Añadir comando de prueba en `package.json`
- [x] Ejecutar y validar pruebas locales de Administración Avanzada
- [x] Registrar reporte de cierre (`FASE34_IMPLEMENTATION_REPORT.md`) y actualizar walkthrough.md
