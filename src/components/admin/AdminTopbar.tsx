import React from "react";
import { Search, Plus, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminTopbarProps {
  title: string;
  collapsed: boolean;
}

export function AdminTopbar({ title, collapsed }: AdminTopbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-6 transition-all duration-200",
        collapsed ? "ml-16" : "ml-60"
      )}
    >
      <h1 className="text-[15px] font-medium text-foreground font-ui">{title}</h1>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Buscar..."
            className="h-8 w-56 rounded-md border border-input bg-card pl-8 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
          />
        </div>

        {/* Notifications */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors duration-150">
          <Bell className="h-4 w-4" strokeWidth={1.5} />
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-bronze text-[9px] font-semibold text-bronze-foreground">
            3
          </span>
        </button>

        {/* Quick action */}
        <button className="flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors duration-150">
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          <span className="hidden sm:inline">Novo conteúdo</span>
        </button>
      </div>
    </header>
  );
}
