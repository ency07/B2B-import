/**
 * Shared currency formatting utilities for the ERP B2B platform.
 * Centralizes COP/USD formatting that was previously duplicated across
 * clients, leads, invoices, quotes, and purchases pages.
 */

export function formatCop(val: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(val);
}

export function formatUsd(val: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);
}

/**
 * Auto-detects currency based on amount threshold.
 * Amounts < 100,000 are formatted as USD; >= 100,000 as COP.
 */
export function formatCurrency(amount: number): string {
  if (amount < 100000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
