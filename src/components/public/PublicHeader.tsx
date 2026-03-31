import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import {
  getActiveNavContext,
  getPrimaryNavigationItems,
  getSiteConfig,
  getUrgentCards,
} from "@/domain/editorial/selectors";
import { useEditorialSnapshot } from "@/domain/editorial/store";
import { ContextSubnavBar } from "./header/ContextSubnavBar";
import { MainMasthead } from "./header/MainMasthead";
import { PrimaryNavBar } from "./header/PrimaryNavBar";
import { TopUrgentBar } from "./header/TopUrgentBar";

function getContentHref(type: string, slug: string) {
  const base = type === "news" ? "noticias" : type === "decision" ? "decisoes" : type === "article" ? "artigos" : "opiniao";
  return `/${base}/${slug}`;
}

export function PublicHeader() {
  const snapshot = useEditorialSnapshot();
  const siteConfig = getSiteConfig(snapshot);
  const urgent = getUrgentCards("2026-03-24T16:00:00Z", snapshot)[0];
  const primaryItems = getPrimaryNavigationItems(snapshot);
  const location = useLocation();
  const activeNav = getActiveNavContext(location.pathname, snapshot);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 bg-background">
      <TopUrgentBar
        urgent={urgent ? { title: urgent.title, urgentLabel: urgent.urgentLabel, href: getContentHref(urgent.type, urgent.slug) } : null}
      />

      <MainMasthead
        scrolled={scrolled}
        mobileOpen={mobileOpen}
        onToggleMobile={() => setMobileOpen((current) => !current)}
        onToggleSearch={() => setSearchOpen((current) => !current)}
        newsletterLabel={siteConfig.newsletterLabel}
      />

      <PrimaryNavBar items={primaryItems} activeKey={activeNav.activePrimaryKey} />
      <ContextSubnavBar label={activeNav.activeSubnavLabel} items={activeNav.contextualLinks} />

      {searchOpen && (
        <div className="border-b border-border bg-background editorial-fade-in">
          <div className="mx-auto max-w-[1200px] px-4 py-4 sm:px-6">
            <div className="relative mx-auto max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
              <input
                type="text"
                placeholder={`Buscar em ${siteConfig.siteName.toLowerCase()}...`}
                autoFocus
                className="h-10 w-full border-b border-primary bg-transparent pl-10 pr-4 font-ui text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none"
                onKeyDown={(event) => {
                  if (event.key === "Escape") setSearchOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="border-b border-border bg-background editorial-fade-in md:hidden">
          <nav className="space-y-0.5 px-4 py-3">
            <p className="px-3 py-1 font-ui text-[9px] font-bold uppercase tracking-[0.15em] text-bronze">Navegação</p>
            {primaryItems.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                className="flex items-center border-b border-border/50 px-3 py-2.5 font-ui text-[13px] text-muted-foreground transition-colors hover:text-primary last:border-0"
              >
                {item.label}
              </Link>
            ))}

            {activeNav.contextualLinks.length > 0 && (
              <>
                <div className="pb-1 pt-3">
                  <p className="px-3 py-1 font-ui text-[9px] font-bold uppercase tracking-[0.15em] text-bronze">
                    {activeNav.activeSubnavLabel}
                  </p>
                </div>
                {activeNav.contextualLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center px-3 py-2 font-ui text-[12px] text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </>
            )}

            <div className="flex items-center gap-4 px-3 pt-3">
              <Link to="/newsletter" className="font-ui text-[11px] font-semibold uppercase tracking-wider text-bronze">
                {siteConfig.newsletterLabel}
              </Link>
              <Link to="/login" className="font-ui text-[11px] text-muted-foreground">
                Entrar
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
