import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import logoPrincipal from "@/assets/logo_principal.png";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Notícias", to: "/noticias" },
  { label: "Decisões", to: "/decisoes" },
  { label: "Artigos", to: "/artigos" },
  { label: "Opinião", to: "/opiniao" },
  { label: "Sobre", to: "/sobre" },
];

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Breaking bar (optional — shown when there's breaking news) */}
      {location.pathname === "/" && (
        <div className="bg-primary text-primary-foreground py-1.5 px-4 text-center">
          <p className="text-[12px] font-medium font-ui">
            <span className="bg-bronze text-bronze-foreground px-1.5 py-0.5 rounded text-[10px] font-bold uppercase mr-2">Urgente</span>
            STF suspende efeitos de lei estadual sobre ICMS — decisão tem impacto em 12 estados
          </p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <img src={logoPrincipal} alt="Veredito" className="h-10 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 rounded-md text-[14px] font-medium transition-colors font-ui",
                    isActive
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Search className="h-4 w-4" strokeWidth={1.5} />
            </button>

            <Link
              to="/newsletter"
              className="hidden sm:flex h-9 items-center rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors font-ui"
            >
              Newsletter
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {mobileOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Buscar notícias, decisões, artigos..."
                autoFocus
                className="h-11 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "block px-3 py-2.5 rounded-md text-[15px] font-medium transition-colors font-ui",
                    isActive
                      ? "text-primary bg-primary/5"
                      : "text-foreground hover:bg-secondary"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/newsletter"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-md text-[15px] font-medium text-bronze transition-colors font-ui hover:bg-secondary"
            >
              Newsletter
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
