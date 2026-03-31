import React, { useMemo, useState } from "react";
import { ArrowLeft, LayoutDashboard, Monitor, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getHomeZoneInspection } from "@/domain/editorial/selectors";
import { type EditorialSnapshot, useEditorialSnapshot } from "@/domain/editorial/store";
import { HomePageContent } from "@/pages/public/HomePage";

type PreviewViewport = "desktop" | "mobile";

function PreviewFrame({ snapshot, viewport }: { snapshot: EditorialSnapshot; viewport: PreviewViewport }) {
  const widthClass = viewport === "mobile" ? "mx-auto max-w-[420px]" : "w-full";

  return (
    <div className={widthClass}>
      <div className="overflow-hidden rounded-xl border border-border bg-background shadow-editorial">
        <HomePageContent snapshot={snapshot} />
      </div>
    </div>
  );
}

export default function HomePreviewPage() {
  const navigate = useNavigate();
  const snapshot = useEditorialSnapshot();
  const [viewport, setViewport] = useState<PreviewViewport>("desktop");
  const inspection = useMemo(() => getHomeZoneInspection(snapshot), [snapshot]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border border-bronze/20 bg-bronze/10 px-5 py-3">
        <div>
          <span className="font-ui text-[13px] font-semibold text-bronze">Pré-visualização da home</span>
          <span className="ml-3 text-[12px] text-muted-foreground">
            A home abaixo usa a mesma store e os mesmos componentes públicos.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/admin")}
            className="flex h-8 items-center gap-1.5 rounded-md border border-input bg-card px-3 text-[12px] font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <LayoutDashboard className="h-3.5 w-3.5" strokeWidth={1.5} />
            Dashboard
          </button>
          <button
            onClick={() => navigate("/admin/home-destaques")}
            className="flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-[12px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
            Voltar às zonas
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <div className="rounded-lg bg-card p-4 shadow-editorial">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Viewport</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => setViewport("desktop")}
                className={`flex h-9 items-center justify-center gap-1.5 rounded-md border px-3 text-[12px] font-medium transition-colors ${viewport === "desktop" ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background text-foreground hover:bg-secondary"}`}
              >
                <Monitor className="h-3.5 w-3.5" strokeWidth={1.5} />
                Desktop
              </button>
              <button
                onClick={() => setViewport("mobile")}
                className={`flex h-9 items-center justify-center gap-1.5 rounded-md border px-3 text-[12px] font-medium transition-colors ${viewport === "mobile" ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background text-foreground hover:bg-secondary"}`}
              >
                <Smartphone className="h-3.5 w-3.5" strokeWidth={1.5} />
                Mobile
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-card p-4 shadow-editorial">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Leitura da curadoria</p>
            <div className="mt-3 space-y-3">
              {inspection.map((zone) => (
                <div key={zone.key} className="rounded-md border border-border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[12px] font-semibold text-foreground">{zone.title}</p>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{zone.mode}</span>
                  </div>
                  <div className="mt-2 space-y-1.5">
                    {zone.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="truncate text-foreground">{item.position}. {item.title}</span>
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            item.origin === "manual"
                              ? "bg-primary/10 text-primary"
                              : item.origin === "fallback"
                                ? "bg-bronze/10 text-bronze"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {item.origin}
                        </span>
                      </div>
                    ))}
                    {zone.items.length === 0 && <p className="text-[11px] text-muted-foreground">Sem itens.</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <PreviewFrame snapshot={snapshot} viewport={viewport} />
      </div>
    </div>
  );
}
