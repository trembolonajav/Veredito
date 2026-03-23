import React from "react";
import { Outlet } from "react-router-dom";
import { PublicFooter } from "./PublicFooter";
import { PublicHeader } from "./PublicHeader";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#public-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Ir para o conteúdo principal
      </a>
      <div className="relative flex min-h-screen flex-col overflow-x-clip bg-[radial-gradient(circle_at_top,rgba(247,243,236,0.92)_0%,rgba(255,253,249,1)_34%,rgba(255,253,249,1)_100%)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[linear-gradient(180deg,rgba(247,243,236,0.55)_0%,rgba(255,253,249,0)_100%)]" />
        <div className="pointer-events-none absolute left-0 top-[180px] h-[420px] w-[420px] rounded-full bg-bronze/5 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-[260px] h-[380px] w-[380px] rounded-full bg-primary/5 blur-3xl" />
        <PublicHeader />
        <main id="public-main-content" className="relative flex-1 pb-16">
          <Outlet />
        </main>
        <PublicFooter />
      </div>
    </div>
  );
}
