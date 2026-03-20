import React from "react";
import { NavLink as RouterNavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Layers,
  Users,
  Link2,
  LayoutGrid,
  Mail,
  Settings,
  UserCog,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logoPrincipal from "@/assets/logo_principal.png";

const mainNav = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Conteúdos", to: "/admin/conteudos", icon: FileText },
  { label: "Editorias", to: "/admin/editorias", icon: Layers },
  { label: "Autores", to: "/admin/autores", icon: Users },
  { label: "Fontes", to: "/admin/fontes", icon: Link2 },
  { label: "Home", to: "/admin/home-destaques", icon: LayoutGrid },
  { label: "Newsletter", to: "/admin/newsletter", icon: Mail },
];

const bottomNav = [
  { label: "Usuários", to: "/admin/usuarios", icon: UserCog },
  { label: "Configurações", to: "/admin/configuracoes", icon: Settings },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 flex h-screen flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Brand */}
      <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-4">
        {!collapsed ? (
          <img src={logoPrincipal} alt="Veredito" className="h-16 w-auto brightness-0 invert opacity-90" />
        ) : (
          <span className="font-display text-xl font-normal text-sidebar-foreground mx-auto opacity-80">V</span>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {mainNav.map((item) => {
          const isActive = item.end
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          return (
            <RouterNavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-colors duration-150",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                collapsed && "justify-center px-0"
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} />
              {!collapsed && <span>{item.label}</span>}
            </RouterNavLink>
          );
        })}
      </nav>

      {/* Bottom nav */}
      <div className="border-t border-sidebar-border px-2 py-3 space-y-0.5">
        {bottomNav.map((item) => {
          const isActive = location.pathname.startsWith(item.to);
          return (
            <RouterNavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-colors duration-150",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                collapsed && "justify-center px-0"
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} />
              {!collapsed && <span>{item.label}</span>}
            </RouterNavLink>
          );
        })}
      </div>

      {/* User & collapse */}
      <div className="border-t border-sidebar-border p-3">
        {!collapsed && (
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-[11px] font-semibold text-sidebar-foreground">
              EC
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-sidebar-foreground truncate">Editor Chefe</p>
              <p className="text-[11px] text-sidebar-foreground/50 truncate">editor@veredito.com</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate("/login")}
            className={cn(
              "flex items-center gap-2 rounded-md py-1.5 text-sidebar-foreground/50 hover:bg-destructive/20 hover:text-destructive transition-colors duration-150",
              collapsed ? "w-full justify-center" : "flex-1 px-3"
            )}
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            {!collapsed && <span className="text-[12px] font-medium">Sair</span>}
          </button>
          <button
            onClick={onToggle}
            className="flex h-7 w-7 items-center justify-center rounded-md text-sidebar-foreground/50 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors duration-150"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
