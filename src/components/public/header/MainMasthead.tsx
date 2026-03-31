import { Link } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type MainMastheadProps = {
  scrolled: boolean;
  mobileOpen: boolean;
  onToggleMobile: () => void;
  onToggleSearch: () => void;
  newsletterLabel: string;
};

export function MainMasthead({
  scrolled,
  mobileOpen,
  onToggleMobile,
  onToggleSearch,
  newsletterLabel,
}: MainMastheadProps) {
  return (
    <div className={cn("border-b border-border transition-all duration-200", scrolled ? "py-2.5" : "py-4 lg:py-5")}>
      <div className="relative mx-auto flex max-w-[1200px] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMobile}
            className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
          </button>
          <button
            onClick={onToggleSearch}
            className="hidden h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground md:flex"
            aria-label="Buscar"
          >
            <Search className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <Link to="/" className="absolute left-1/2 -translate-x-1/2 text-center">
          <span className={cn("block font-display leading-none tracking-[0.08em] text-foreground transition-all duration-200", scrolled ? "text-[28px] lg:text-[42px]" : "text-[32px] lg:text-[56px]")}>
            VEREDITO
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-4">
          <Link to="/newsletter" className="hidden font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-bronze transition-colors hover:text-bronze/80 sm:inline-flex">
            {newsletterLabel}
          </Link>
          <Link to="/login" className="hidden font-ui text-[12px] text-muted-foreground transition-colors hover:text-foreground sm:inline-flex">
            Entrar
          </Link>
          <button
            onClick={onToggleSearch}
            className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground md:hidden"
            aria-label="Buscar"
          >
            <Search className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
