import React, { useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import logoPrincipal from "@/assets/logo_principal.png";
import { cn } from "@/lib/utils";
import { usePublicEditorialData } from "@/pages/public/public-content";

const primaryNavItems = [
  { label: "Noticias", to: "/noticias" },
  { label: "Decisoes", to: "/decisoes" },
  { label: "Artigos", to: "/artigos" },
  { label: "Opiniao", to: "/opiniao" },
];

const utilityNavItems = [
  { label: "Sobre", to: "/sobre" },
  { label: "Contato", to: "/contato" },
];

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { editorias, homeManchete } = usePublicEditorialData();

  const headerLabel = useMemo(() => {
    if (location.pathname.startsWith("/decisoes")) return "Cobertura juridica e leitura editorial";
    if (location.pathname.startsWith("/artigos")) return "Analises aprofundadas para leitores tecnicos";
    if (location.pathname.startsWith("/opiniao")) return "Colunas e posicoes editoriais";
    return "Jornalismo juridico premium, sobrio e objetivo";
  }, [location.pathname]);

  const editorialNavItems = useMemo(
    () => editorias.slice(0, 5).map((item) => ({ label: item.name, to: `/editoria/${item.slug}` })),
    [editorias],
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-md">
      <div className="border-b border-border/70 bg-[rgba(247,243,236,0.88)]">
        <div className="mx-auto flex min-h-10 max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
          <p className="line-clamp-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground sm:line-clamp-1">{headerLabel}</p>
          <div className="hidden items-center gap-5 sm:flex">
            {utilityNavItems.map((item) => (
              <Link key={item.to} to={item.to} className="rounded-sm text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {item.label}
              </Link>
            ))}
            <Link
              to="/newsletter"
              className="rounded-sm text-[11px] font-semibold uppercase tracking-[0.2em] text-bronze transition-colors hover:text-bronze/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Curadoria semanal
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[88px] gap-4 py-4 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
          <div className="flex items-center justify-between gap-4 md:justify-start">
            <Link to="/" className="shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <img src={logoPrincipal} alt="Veredito" className="h-11 w-auto" />
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/80 text-muted-foreground transition-colors hover:border-primary/20 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
              aria-label="Abrir menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
            </button>
          </div>

          <div className="hidden md:block">
            <div className="flex flex-wrap items-center justify-center gap-1">
              {primaryNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "rounded-full px-4 py-2 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-ui",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-editorial-sm"
                        : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-border/70 pt-3">
              {editorialNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "rounded-sm text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive ? "text-bronze" : "text-muted-foreground hover:text-foreground",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="hidden items-center justify-end gap-2 md:flex">
            <Link
              to="/busca"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/80 text-muted-foreground transition-colors hover:border-primary/20 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Buscar"
            >
              <Search className="h-4 w-4" strokeWidth={1.5} />
            </Link>

            <Link
              to="/newsletter"
              className="flex h-10 items-center rounded-full bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-ui"
            >
              Newsletter
            </Link>
          </div>
        </div>
      </div>

      {location.pathname === "/" && homeManchete ? (
        <div className="border-y border-border/70 bg-primary text-primary-foreground">
          <div className="mx-auto flex min-h-11 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
            <p className="truncate text-[12px] font-medium font-ui">
              <span className="mr-2 rounded bg-bronze px-1.5 py-0.5 text-[10px] font-bold uppercase text-bronze-foreground">
                Manchete
              </span>
              {homeManchete.title}
            </p>
          </div>
        </div>
      ) : null}

      {mobileOpen ? (
        <div className="border-t border-border/80 bg-background md:hidden">
          <nav className="space-y-4 px-4 py-4">
            <div className="space-y-1">
              {primaryNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "block rounded-xl px-4 py-3 text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-ui",
                      isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary/80",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="border-t border-border/70 pt-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze">Editorias</p>
              <div className="space-y-1">
                {editorialNavItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "block rounded-xl px-4 py-3 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-ui",
                        isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="border-t border-border/70 pt-4">
              <Link
                to="/newsletter"
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-4 py-3 text-[15px] font-medium text-bronze transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-ui"
              >
                Newsletter
              </Link>
              <Link
                to="/busca"
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-4 py-3 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-ui"
              >
                Busca
              </Link>
              {utilityNavItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl px-4 py-3 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-ui"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
