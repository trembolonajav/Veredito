import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

type UrgentItem = {
  title: string;
  urgentLabel?: string;
  href: string;
};

export function TopUrgentBar({ urgent }: { urgent?: UrgentItem | null }) {
  if (!urgent) return null;

  return (
    <div className="border-b border-primary/20 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-4 py-1.5 sm:px-6">
        <span className="shrink-0 bg-bronze px-2 py-0.5 font-ui text-[10px] font-bold uppercase tracking-[0.15em] text-bronze-foreground">
          Urgente
        </span>
        <Link to={urgent.href} className="min-w-0 flex-1 truncate text-[11px] font-ui text-primary-foreground/85 transition-colors hover:text-primary-foreground">
          {urgent.urgentLabel || urgent.title}
        </Link>
        <Link to={urgent.href} className="hidden shrink-0 items-center gap-0.5 text-[10px] font-ui text-primary-foreground/65 transition-colors hover:text-primary-foreground sm:flex">
          Ler agora <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
