"use client";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

// ==========================================
// EXCEL / CSV EXPORTS
// ==========================================

export function exportToExcel(data: Record<string, unknown>[], filename: string, sheetName: string = "Datos") {
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Auto-width columns
  const colWidths = Object.keys(data[0] || {}).map((key) => {
    const maxLen = Math.max(
      key.length,
      ...data.map((row) => String(row[key] ?? "").length)
    );
    return { wch: Math.min(maxLen + 2, 50) };
  });
  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(blob, `${filename}.xlsx`);
}

export function exportToCsv(data: Record<string, unknown>[], filename: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvBuffer = XLSX.write(worksheet, { bookType: "csv", type: "string" });
  const blob = new Blob(["\uFEFF" + csvBuffer], { type: "text/csv;charset=utf-8" });
  saveAs(blob, `${filename}.csv`);
}

// ==========================================
// INVOICE PDF GENERATION
// ==========================================

interface InvoicePdfData {
  invoice_code: string;
  invoice_date: string;
  due_date: string;
  subtotal_amount: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  balance_amount: number;
  status: string;
  clients?: {
    legal_name: string;
    tax_id?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
  };
  invoice_items?: {
    description: string;
    quantity: number;
    unit_price: number;
    line_total: number;
  }[];
  tenant_settings?: Array<{ config_value: string }>;
}

export function generateInvoicePdf(data: InvoicePdfData): jsPDF {
  const doc = new jsPDF("p", "mm", "letter");
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = margin;

  // Header background
  doc.setFillColor(30, 30, 30);
  doc.rect(0, 0, pageWidth, 45, "F");

  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("VENTITECH INDUSTRIAL", margin, 18);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Ventilación Industrial y Sistemas de Extracción", margin, 25);
  doc.text("NIT: 901.234.567-8 | Bogotá, Colombia", margin, 30);
  doc.text("contacto@ventitech.com | +57 (601) 555-0123", margin, 35);

  // Invoice title
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("FACTURA", pageWidth - margin, 18, { align: "right" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(data.invoice_code, pageWidth - margin, 25, { align: "right" });

  const statusColors: Record<string, [number, number, number]> = {
    EMITIDA: [59, 130, 246],
    PAGADA: [34, 197, 94],
    ANULADA: [239, 68, 68],
    PARCIALMENTE_PAGADA: [245, 158, 11],
  };
  const color = statusColors[data.status] || [100, 100, 100];
  doc.setTextColor(...color);
  doc.setFontSize(9);
  doc.text(data.status, pageWidth - margin, 32, { align: "right" });

  y = 55;

  // Invoice info box
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("FECHA EMISIÓN", margin, y);
  doc.text("FECHA VENCIMIENTO", margin + 60, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.text(data.invoice_date ? String(data.invoice_date).substring(0, 10) : "", margin, y);
  doc.text(data.due_date ? String(data.due_date).substring(0, 10) : "", margin + 60, y);

  y += 15;

  // Client info
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("FACTURAR A:", margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(data.clients?.legal_name || "Cliente General", margin, y);
  y += 5;
  doc.setFontSize(8);
  if (data.clients?.tax_id) {
    doc.text(`NIT: ${data.clients.tax_id}`, margin, y);
    y += 4;
  }
  if (data.clients?.address) {
    doc.text(data.clients.address, margin, y);
    y += 4;
  }
  if (data.clients?.city || data.clients?.country) {
    doc.text(`${data.clients?.city || ""} ${data.clients?.country ? `, ${data.clients.country}` : ""}`, margin, y);
    y += 4;
  }
  if (data.clients?.email) {
    doc.text(data.clients.email, margin, y);
    y += 4;
  }

  y += 8;

  // Items table header
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, y - 4, pageWidth - 2 * margin, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text("DESCRIPCIÓN", margin + 4, y + 1);
  doc.text("CANT", margin + 120, y + 1, { align: "right" });
  doc.text("PRECIO UNIT.", margin + 140, y + 1, { align: "right" });
  doc.text("TOTAL", pageWidth - margin - 4, y + 1, { align: "right" });

  y += 6;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 4;

  // Items
  const items = data.invoice_items || [];
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(40, 40, 40);

  for (const item of items) {
    if (y > 240) {
      doc.addPage();
      y = margin;
    }
    doc.text(item.description.substring(0, 60), margin + 4, y);
    doc.text(String(item.quantity), margin + 120, y, { align: "right" });
    doc.text(formatMoney(item.unit_price), margin + 140, y, { align: "right" });
    doc.text(formatMoney(item.line_total), pageWidth - margin - 4, y, { align: "right" });
    y += 6;
  }

  // Totals section
  y += 8;
  const totalsX = margin + 100;
  const totalsW = pageWidth - margin - totalsX - 4;

  doc.setDrawColor(200, 200, 200);
  doc.line(totalsX, y, totalsX + totalsW, y);
  y += 6;

  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Subtotal:", totalsX, y);
  doc.setTextColor(40, 40, 40);
  doc.text(formatMoney(data.subtotal_amount), totalsX + totalsW, y, { align: "right" });
  y += 6;

  doc.setTextColor(100, 100, 100);
  doc.text("IVA:", totalsX, y);
  doc.setTextColor(40, 40, 40);
  doc.text(formatMoney(data.tax_amount), totalsX + totalsW, y, { align: "right" });
  y += 6;

  doc.setDrawColor(40, 40, 40);
  doc.setLineWidth(0.5);
  doc.line(totalsX, y - 1, totalsX + totalsW, y - 1);
  doc.setLineWidth(0.2);
  y += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  doc.text("TOTAL:", totalsX, y);
  doc.text(formatMoney(data.total_amount), totalsX + totalsW, y, { align: "right" });
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Pagado:", totalsX, y);
  doc.setTextColor(34, 197, 94);
  doc.text(formatMoney(data.paid_amount), totalsX + totalsW, y, { align: "right" });
  y += 5;

  doc.setTextColor(100, 100, 100);
  doc.text("Saldo:", totalsX, y);
  const balanceColor = data.balance_amount > 0 ? [239, 68, 68] : [34, 197, 94];
  doc.setTextColor(...balanceColor);
  doc.text(formatMoney(data.balance_amount), totalsX + totalsW, y, { align: "right" });

  // Footer
  y = 265;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.setFont("helvetica", "normal");
  doc.text("VentiTech Industrial SAS — Ventilación Industrial y Sistemas de Extracción", pageWidth / 2, y, { align: "center" });
  y += 4;
  doc.text("Generado el " + new Date().toLocaleDateString("es-CO"), pageWidth / 2, y, { align: "center" });

  return doc;
}

export function downloadInvoicePdf(data: InvoicePdfData) {
  const doc = generateInvoicePdf(data);
  doc.save(`Factura_${data.invoice_code}.pdf`);
}

// ==========================================
// RECEIPT PDF GENERATION
// ==========================================

interface ReceiptData {
  payment_code: string;
  payment_date: string;
  payment_method: string;
  reference_number?: string;
  amount: number;
  invoiceCode?: string;
  clientName?: string;
  clientNit?: string;
}

export function downloadReceiptPdf(data: ReceiptData) {
  const doc = new jsPDF("p", "mm", "letter");
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;

  // Header
  doc.setFillColor(30, 30, 30);
  doc.rect(0, 0, pageWidth, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("RECIBO DE PAGO", pageWidth / 2, 22, { align: "center" });

  let y = 50;

  // Receipt details
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("FOLIO:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(data.payment_code, margin + 25, y);

  doc.setFont("helvetica", "bold");
  doc.text("FECHA:", margin + 80, y);
  doc.setFont("helvetica", "normal");
  doc.text(data.payment_date || new Date().toISOString().substring(0, 10), margin + 105, y);

  y += 12;

  doc.setFont("helvetica", "bold");
  doc.text("CLIENTE:", margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(data.clientName || "Cliente General", margin, y);
  if (data.clientNit) {
    doc.setFontSize(8);
    doc.text(`NIT: ${data.clientNit}`, margin, y + 5);
  }

  y += 18;

  // Payment info box
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 50, 3, 3, "F");

  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", "bold");
  doc.text("MÉTODO DE PAGO", margin + 8, y + 12);
  doc.text("REFERENCIA", margin + 8, y + 24);
  doc.text("FACTURA ASOCIADA", margin + 8, y + 36);

  doc.setFont("helvetica", "normal");
  doc.text(data.payment_method, margin + 60, y + 12);
  doc.text(data.reference_number || "N/A", margin + 60, y + 24);
  doc.text(data.invoiceCode || "N/A", margin + 60, y + 36);

  y += 60;

  // Amount
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(34, 197, 94);
  doc.text(formatMoney(data.amount), pageWidth / 2, y, { align: "center" });

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("MONTO PAGADO", pageWidth / 2, y + 6, { align: "center" });

  // Footer
  y = 265;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text("VentiTech Industrial SAS — Este recibo no es una factura.", pageWidth / 2, y, { align: "center" });

  doc.save(`Recibo_${data.payment_code}.pdf`);
}

// ==========================================
// HELPERS
// ==========================================

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}