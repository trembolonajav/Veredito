import React from "react";
import { NavLink as RouterNavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LayoutGrid,
  Layers,
  Link2,
  LogOut,
  Mail,
  Settings,
  UserCog,
  Users,
} from "lucide-react";
import { currentUserCan, getCurrentAdminUser } from "@/domain/editorial/selectors";
import { useEditorialSnapshot } from "@/domain/editorial/store";
import { cn } from "@/lib/utils";
import logoPrincipal from "@/assets/logo_principal.png";

const mainNav = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Conteudos", to: "/admin/conteudos", icon: FileText, permission: "edit_content" },
  { label: "Editorias", to: "/admin/editorias", icon: Layers, permission: "manage_editorias" },
  { label: "Autores", to: "/admin/autores", icon: Users, permission: "manage_authors" },
  { label: "Fontes", to: "/admin/fontes", icon: Link2, permission: "manage_sources" },
  { label: "Home", to: "/admin/home-destaques", icon: LayoutGrid, permission: "edit_home" },
  { label: "Newsletter", to: "/admin/newsletter", icon: Mail, permission: "manage_newsletter" },
];

const bottomNav = [
  { label: "Usuarios", to: "/admin/usuarios", icon: UserCog, permission: "manage_users" },
  { label: "Configuracoes", to: "/admin/configuracoes", icon: Settings, permission: "manage_settings" },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const snapshot = useEditorialSnapshot();
  const currentUser = getCurrentAdminUser(snapshot);
  const visibleMainNav = mainNav.filter((item) => !item.permission || currentUserCan(item.permission, snapshot));
  const visibleBottomNav = bottomNav.filter((item) => !item.permission || currentUserCan(item.permission, snapshot));

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 flex h-screen flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex h-14 items-center gap-3 border-b border-sidebar-border px-4">
        {!collapsed ? (
          <img src={logoPrincipal} alt="Veredito" className="h-12 w-auto brightness-0 invert opacity-90" />
        ) : (
          <span className="font-display text-xl font-normal text-sidebar-foreground mx-auto opacity-80">V</span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {visibleMainNav.map((item) => {
          const isActive = item.end ? location.pathname === item.to : location.pathname.startsWith(item.to);
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

      <div className="border-t border-sidebar-border px-2 py-3 space-y-0.5">
        {visibleBottomNav.map((item) => {
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

      <div className="border-t border-sidebar-border p-3">
        {!collapsed && (
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-[11px] font-semibold text-sidebar-foreground">
              {(currentUser?.name || "V").slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-sidebar-foreground truncate">{currentUser?.name || "Operador"}</p>
              <p className="text-[11px] text-sidebar-foreground/50 truncate">{currentUser?.email || "redacao@veredito.com"}</p>
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
            {collapsed ? <ChevronRight className="h-4 w-4" strokeWidth={1.5} /> : <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
