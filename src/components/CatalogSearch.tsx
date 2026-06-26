"use client";

import * as React from "react";
import { Search, X, Loader2, Package, ArrowRight } from "lucide-react";
import { searchCatalog } from "@/app/actions/catalog-chat";

interface SearchResult {
  id: string;
  productCode: string;
  name: string;
  description: string;
  status: string;
  series: string;
  family: string;
  specifications: { name: string; value: string }[];
  coverImage: Record<string, unknown> | null;
}

interface CatalogSearchProps {
  tenantCode: string | null;
  onProductSelect?: (product: SearchResult) => void;
}

export function CatalogSearch({ tenantCode, onProductSelect }: CatalogSearchProps) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex(prev => Math.min(prev + 1, results.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex(prev => Math.max(prev - 1, -1)); }
      if (e.key === "Enter" && selectedIndex >= 0) { e.preventDefault(); handleSelect(results[selectedIndex]); }
      if (e.key === "Escape") { setIsOpen(false); inputRef.current?.blur(); }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleSearch = React.useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) { setResults([]); setIsOpen(false); return; }
    setLoading(true);
    try {
      const data = await searchCatalog(tenantCode, searchQuery);
      setResults(data as SearchResult[]);
      setIsOpen(true);
      setSelectedIndex(-1);
    } catch (err) {
      console.error("Catalog search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [tenantCode]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => handleSearch(value), 300);
  };

  const handleSelect = (product: SearchResult) => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    if (onProductSelect) onProductSelect(product);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const highlightMatch = (text: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i} className="bg-primary/20 text-foreground rounded px-0.5">{part}</mark> : part
    );
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => query.trim().length >= 2 && results.length > 0 && setIsOpen(true)}
          placeholder="Buscar productos por nombre, código o descripción..."
          className="w-full pl-10 pr-10 py-2.5 bg-card/80 backdrop-blur-sm border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
        />
        {query && (
          <button onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 backdrop-blur-md">
          {results.length === 0 && !loading && (
            <div className="p-6 text-center">
              <Package className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground font-mono">Sin resultados para &quot;{query}&quot;</p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">Intenta con otro término o verifica la categoría.</p>
            </div>
          )}

          <div className="max-h-80 overflow-y-auto">
            {results.map((product, idx) => (
              <button
                key={product.id}
                onClick={() => handleSelect(product)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors border-b border-border/30 last:border-0 ${
                  idx === selectedIndex ? "bg-accent" : "hover:bg-accent/50"
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-accent/50 border border-border flex items-center justify-center shrink-0 mt-0.5">
                  <Package className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-primary font-bold">{product.productCode}</span>
                    {product.series && <span className="text-[9px] font-mono text-muted-foreground">{product.series}</span>}
                  </div>
                  <p className="text-xs font-semibold text-foreground truncate mt-0.5">{highlightMatch(product.name)}</p>
                  {product.description && (
                    <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{highlightMatch(product.description)}</p>
                  )}
                  {product.family && (
                    <p className="text-[9px] text-muted-foreground/60 font-mono mt-0.5">{product.family}</p>
                  )}
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 mt-2" />
              </button>
            ))}
          </div>

          {results.length > 0 && (
            <div className="px-4 py-2 bg-accent/30 border-t border-border flex items-center justify-between">
              <span className="text-[9px] text-muted-foreground font-mono">{results.length} resultado(s)</span>
              <span className="text-[9px] text-muted-foreground/60">↑↓ Navegar • Enter Seleccionar • Esc Cerrar</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}