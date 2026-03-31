import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

type ContextItem = {
  label: string;
  to: string;
};

export function ContextSubnavBar({
  label,
  items,
}: {
  label?: string;
  items: ContextItem[];
}) {
  const location = useLocation();

  if (!label || items.length === 0) return null;

  return (
    <div className="hidden border-b border-border bg-card md:block">
      <div className="mx-auto flex max-w-[1200px] items-center gap-3 overflow-x-auto px-4 py-2.5 sm:px-6">
        <span className="shrink-0 font-ui text-[10px] font-bold uppercase tracking-[0.14em] text-bronze">{label}</span>
        {items.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "shrink-0 border-l border-border pl-3 font-ui text-[11px] transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
