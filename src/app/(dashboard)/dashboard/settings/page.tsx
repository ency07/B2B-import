"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import { Sparkles, CheckCircle2, Settings, ShieldAlert, Send } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getTenantConfig } from "@/utils/tenant";

// Zod schema for settings editing
const settingsSchema = z.object({
  companyName: z
    .string()
    .min(5, { message: "El nombre de la empresa debe tener al menos 5 caracteres." }),
  taxId: z
    .string()
    .min(12, { message: "El RFC debe tener al menos 12 caracteres." })
    .max(13, { message: "El RFC no puede superar los 13 caracteres." }),
  telegramToken: z
    .string()
    .min(10, { message: "El token de Telegram debe tener al menos 10 caracteres." })
    .regex(/^(\d+):[a-zA-Z0-9_-]+$/, {
      message: "Formato de token API de Telegram inválido (ej. 123456789:ABCdefGhI...).",
    }),
  primaryColor: z
    .string()
    .regex(/^\d+ \d+%\t*\d+%$/, {
      message: "Formato de color primario HSL inválido (ej. '215 80% 50%').",
    }),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const tenantParam = searchParams.get("tenant");
  const config = getTenantConfig(tenantParam);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      companyName: config.name,
      taxId: tenantParam === "acme" ? "ACM901201TR4" : tenantParam === "apex" ? "APX150508LL2" : "ERP901201TR4",
      telegramToken: "1234567890:AABBCCddEEffGGhhIIjjKKllMM",
      primaryColor: config.primaryColor,
    },
  });

  const onSubmit = (values: SettingsFormValues) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);

      // Dynamically apply primary color change to DOM immediately for White Label testing
      const root = document.documentElement;
      root.style.setProperty("--primary", values.primaryColor);
      root.style.setProperty("--ring", values.primaryColor);

      setTimeout(() => setSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="w-3.5 h-3.5" /> Módulo de Configuración
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          Centro de Configuración Empresarial
        </h1>
        <p className="text-sm text-muted-foreground">
          Personaliza los parámetros del sistema, el diseño White Label y los canales de notificación por inquilino.
        </p>
      </div>

      {/* Success Notification */}
      {success && (
        <div className="flex items-start gap-3 p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-400 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h4 className="font-semibold text-sm">Configuración guardada exitosamente</h4>
            <p className="text-xs opacity-90">
              Los cambios del White Label y las claves de integración han sido aplicados en tiempo real.
            </p>
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Business Identity */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2 flex items-center gap-2">
                <Settings className="w-4 h-4 text-muted-foreground" /> Identidad de la Empresa
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company Name */}
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Razón Social</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tax ID */}
                <FormField
                  control={form.control}
                  name="taxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RFC / Identificación Fiscal</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* White Label Branding */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-muted-foreground" /> Configuración de Branding (White Label)
              </h3>

              {/* Primary Color HSL */}
              <FormField
                control={form.control}
                name="primaryColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color Primario (HSL HUE)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Introduce el valor HSL (ej. 215 80% 50% para Azul, 142 72% 29% para Verde) para sobrescribir dinámicamente el estilo visual de la cabecera, botones e indicadores del ERP.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Telegram Integration */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2 flex items-center gap-2">
                <Send className="w-4 h-4 text-muted-foreground" /> Canal de Notificaciones (Telegram API)
              </h3>

              {/* Telegram API Token */}
              <FormField
                control={form.control}
                name="telegramToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telegram Bot Token</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Token secreto del bot de Telegram para el despacho automático de alertas críticas de SLA de OTs a los responsables del ERP.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Save Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isSubmitting}
              >
                Revertir
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Guardar Cambios
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
