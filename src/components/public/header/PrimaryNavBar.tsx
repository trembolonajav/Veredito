import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

type PrimaryItem = {
  key: string;
  label: string;
  to: string;
};

export function PrimaryNavBar({
  items,
  activeKey,
}: {
  items: PrimaryItem[];
  activeKey?: string;
}) {
  return (
    <nav className="hidden border-b border-border md:block">
      <div className="mx-auto flex max-w-[1200px] items-center gap-0 overflow-x-auto px-4 sm:px-6">
        {items.map((item) => (
          <NavLink
            key={item.key}
            to={item.to}
            className={cn(
              "relative shrink-0 px-4 py-3 font-ui text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors",
              activeKey === item.key ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
            {activeKey === item.key && <span className="absolute inset-x-4 bottom-0 h-[2px] bg-bronze" />}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
