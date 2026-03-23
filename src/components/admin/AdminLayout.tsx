import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { cn } from "@/lib/utils";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/conteudos": "Conteúdos",
  "/admin/conteudos/tipo": "Novo conteúdo",
  "/admin/conteudos/novo": "Novo conteúdo",
  "/admin/editorias": "Editorias",
  "/admin/autores": "Autores",
  "/admin/fontes": "Fontes",
  "/admin/home-destaques": "Home & Destaques",
  "/admin/newsletter": "Newsletter",
  "/admin/usuarios": "Usuários",
  "/admin/configuracoes": "Configurações",
};

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const title = pageTitles[location.pathname]
    || (location.pathname.includes("/preview") ? "Preview" : null)
    || (location.pathname.includes("/editar") ? "Editar conteúdo" : null)
    || "Veredito Admin";

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <AdminTopbar title={title} collapsed={collapsed} />
      <main
        className={cn(
          "min-h-[calc(100vh-3.5rem)] p-6 transition-all duration-200",
          collapsed ? "ml-16" : "ml-60",
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}
