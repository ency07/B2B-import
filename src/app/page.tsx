import * as React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white font-sans selection:bg-primary selection:text-white">
      {/* Header */}
      <header className="flex items-center justify-between h-20 px-6 max-w-7xl w-full mx-auto border-b border-white/10">
        <span className="font-display text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
          B2B ERP Premium
        </span>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-200 transition-colors"
        >
          Entrar al ERP <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-zinc-400 mb-8 self-center">
          <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> Gobernanza & Stack UI Completamente Aprobado
        </div>

        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 leading-tight">
          La Siguiente Generación de ERP Comercial y Operativo B2B
        </h1>

        <p className="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
          Plataforma multi-inquilino de alto rendimiento, diseñada con aislamiento físico por RLS en base de datos, White Label dinámico y control total de flujos de trabajo.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-white text-zinc-950 font-semibold hover:bg-zinc-200 transition-all shadow-lg hover:shadow-white/10"
          >
            Probar Dashboard <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="https://github.com/WickyNilliams/headroom.js"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg border border-white/10 bg-white/5 font-semibold hover:bg-white/10 transition-all text-zinc-300"
          >
            Arquitectura Reutilizable
          </a>
        </div>

        {/* Short Features List */}
        <div className="grid gap-8 sm:grid-cols-3 mt-24 text-left">
          <div className="p-6 rounded-xl border border-white/5 bg-white/[0.02]">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
            <h3 className="mt-4 text-lg font-bold">Seguridad Multi-Tenant</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Aislamiento de bases de datos respaldado por políticas de Row Level Security (RLS) en Supabase.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-white/5 bg-white/[0.02]">
            <Zap className="w-8 h-8 text-yellow-500" />
            <h3 className="mt-4 text-lg font-bold">Rendimiento Excepcional</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Desarrollado en Next.js con Tailwind CSS v4, react-headroom y animaciones fluidas de Framer Motion.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-white/5 bg-white/[0.02]">
            <Sparkles className="w-8 h-8 text-purple-500" />
            <h3 className="mt-4 text-lg font-bold">Branding White Label</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Personalización corporativa dinâmica de logotipos, colores, favicons y cargadores por cada tenant.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-zinc-600 border-t border-white/5">
        &copy; 2026 ERP B2B Premium. Todos los derechos reservados.
      </footer>
    </div>
  );
}
