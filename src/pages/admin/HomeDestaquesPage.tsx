import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDown, ArrowUp, Eye, Home, Pin, PinOff, Zap } from "lucide-react";
import {
  currentUserCan,
  getDashboardUrgentSummary,
  getEditorialEditorias,
  getHomeZoneCandidates,
  getHomeZoneConfigs,
  getHomeZoneInspection,
  getHomeZonePerformance,
  getUrgentPerformance,
  getUrgentCards,
} from "@/domain/editorial/selectors";
import {
  movePinnedContentInHomeZone,
  pinContentToHomeZone,
  unpinContentFromHomeZone,
  updateHomeZoneConfig,
  useEditorialSnapshot,
} from "@/domain/editorial/store";
import type { EditorialPriority, HomeZoneKey, HomeZoneMode, HomeZoneSort } from "@/domain/editorial/types";
import { toast } from "sonner";

const NOW_ISO = "2026-03-24T16:00:00Z";
const PRIORITY_OPTIONS: { label: string; value: EditorialPriority }[] = [
  { label: "Crítica", value: "critical" },
  { label: "Alta", value: "high" },
  { label: "Média", value: "medium" },
  { label: "Baixa", value: "low" },
];

export default function HomeDestaquesPage() {
  const navigate = useNavigate();
  const snapshot = useEditorialSnapshot();
  const urgentItems = getUrgentCards(NOW_ISO, snapshot);
  const urgentSummary = getDashboardUrgentSummary(NOW_ISO, snapshot);
  const zoneConfigs = getHomeZoneConfigs(snapshot);
  const zoneInspection = getHomeZoneInspection(snapshot);
  const zonePerformance = getHomeZonePerformance(snapshot);
  const urgentPerformance = getUrgentPerformance(snapshot);
  const editorias = getEditorialEditorias(snapshot);
  const canEditHome = currentUserCan("edit_home", snapshot);
  const [selectedPins, setSelectedPins] = useState<Partial<Record<HomeZoneKey, string>>>({});
  const [pinExpiry, setPinExpiry] = useState<Partial<Record<HomeZoneKey, string>>>({});

  const candidatesByZone = useMemo(
    () =>
      zoneConfigs.reduce((acc, zone) => {
        acc[zone.key] = getHomeZoneCandidates(zone.key, snapshot);
        return acc;
      }, {} as Record<HomeZoneKey, ReturnType<typeof getHomeZoneCandidates>>),
    [snapshot, zoneConfigs]
  );

  const urgentRows = snapshot.exposures
    .filter((item) => item.isUrgent)
    .map((item) => {
      const content = snapshot.contents.find((entry) => entry.id === item.contentId);
      const now = new Date(NOW_ISO).getTime();
      const start = item.urgentStartsAt ? new Date(item.urgentStartsAt).getTime() : 0;
      const end = item.urgentExpiresAt ? new Date(item.urgentExpiresAt).getTime() : Number.POSITIVE_INFINITY;
      const state = now < start ? "agendado" : now > end ? "expirado" : "ativo";
      return {
        id: item.contentId,
        title: item.urgentTitle || content?.title || item.contentId,
        state,
        expiresAt: item.urgentExpiresAt,
      };
    });

  function handleModeChange(key: HomeZoneKey, mode: HomeZoneMode) {
    updateHomeZoneConfig(key, { mode });
    toast.success("Modo da zona atualizado.");
  }

  function handleMaxItemsChange(key: HomeZoneKey, value: string) {
    const nextValue = Number(value);
    if (!Number.isFinite(nextValue) || nextValue < 1) return;
    updateHomeZoneConfig(key, { maxItems: nextValue });
  }

  function handleToggleFallback(key: HomeZoneKey, fallbackToAutomatic: boolean) {
    updateHomeZoneConfig(key, { fallbackToAutomatic });
  }

  function handleSortChange(key: HomeZoneKey, sort: HomeZoneSort) {
    updateHomeZoneConfig(key, { sort });
  }

  function handlePriorityChange(key: HomeZoneKey, minPriority: EditorialPriority) {
    const index = PRIORITY_OPTIONS.findIndex((item) => item.value === minPriority);
    const allowedPriorities = PRIORITY_OPTIONS.slice(0, index + 1).map((item) => item.value);
    updateHomeZoneConfig(key, { allowedPriorities });
  }

  function handleDateWindowChange(key: HomeZoneKey, value: string) {
    const dateWindowDays = Number(value);
    updateHomeZoneConfig(key, { dateWindowDays });
  }

  function handleEditoriaFilter(key: HomeZoneKey, value: string) {
    updateHomeZoneConfig(key, { allowedEditorias: value ? [value] : [] });
  }

  function handlePin(key: HomeZoneKey) {
    const contentId = selectedPins[key];
    if (!contentId) return;
    pinContentToHomeZone(key, contentId, pinExpiry[key] ? new Date(pinExpiry[key]!).toISOString() : undefined);
    toast.success("Conteúdo fixado na zona.");
  }

  function handleUnpin(key: HomeZoneKey, contentId: string) {
    unpinContentFromHomeZone(key, contentId);
    toast.success("Conteúdo removido da pinagem.");
  }

  function handleMovePinned(key: HomeZoneKey, contentId: string, direction: "up" | "down") {
    movePinnedContentInHomeZone(key, contentId, direction);
  }

  function getPriorityFloor(config: (typeof zoneConfigs)[number]) {
    const priorities = config.allowedPriorities ?? [];
    if (priorities.includes("low")) return "low";
    if (priorities.includes("medium")) return "medium";
    if (priorities.includes("high")) return "high";
    return "critical";
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-foreground">Home & Destaques</h2>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Curadoria por zonas com precedência explícita entre pinagem, automático e fallback.
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/home-destaques/preview")}
          className="flex h-9 items-center gap-1.5 rounded-md border border-input bg-card px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />
          Pré-visualizar home
        </button>
      </div>

      {!canEditHome && (
        <div className="rounded-lg border border-border bg-card p-4 text-[12px] text-muted-foreground">
          Leitura em modo protegido. O papel atual pode inspecionar a curadoria, mas nao editar home e urgentes.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: "Urgentes ativos", value: urgentSummary.active, accent: "text-destructive" },
          { label: "Vencendo hoje", value: urgentSummary.expiringToday, accent: "text-bronze" },
          { label: "Expirados", value: urgentSummary.expired, accent: "text-muted-foreground" },
        ].map((item) => (
          <div key={item.label} className="rounded-lg bg-card p-4 shadow-editorial">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{item.label}</p>
            <p className={`mt-2 text-2xl font-semibold tabular-nums ${item.accent}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg bg-card shadow-editorial">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h3 className="font-ui text-[13px] font-semibold text-foreground flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-destructive" strokeWidth={2} />
            Faixa urgente
          </h3>
          <span className="text-[11px] text-muted-foreground">{urgentItems.length} ativo(s)</span>
        </div>
        <div className="grid gap-4 p-4 lg:grid-cols-2">
          <div className="space-y-3">
            {urgentItems.map((item, index) => (
              <div key={item.id} className="rounded-md border border-border p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[12px] font-semibold text-foreground">{item.urgentLabel || item.title}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{item.editoriaName} · {item.publishedLabel}</p>
                  </div>
                  <span className="text-[10px] font-medium text-bronze">Prioridade {index + 1}</span>
                </div>
              </div>
            ))}
            {urgentItems.length === 0 && <p className="text-[12px] text-muted-foreground">Nenhum urgente ativo.</p>}
          </div>

          <div className="space-y-3">
            {urgentRows.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
                <div>
                  <p className="text-[12px] font-semibold text-foreground">{item.title}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {item.expiresAt ? new Date(item.expiresAt).toLocaleString("pt-BR") : "Sem expiração"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    item.state === "ativo"
                      ? "bg-status-published/10 text-status-published"
                      : item.state === "agendado"
                        ? "bg-status-scheduled/10 text-status-scheduled"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {item.state}
                </span>
              </div>
            ))}
            {urgentRows.length === 0 && <p className="text-[12px] text-muted-foreground">Nenhum urgente configurado.</p>}
          </div>
        </div>
      </div>

      {urgentPerformance.length > 0 && (
        <div className="rounded-lg bg-card shadow-editorial">
          <div className="border-b border-border px-5 py-3.5">
            <h3 className="font-ui text-[13px] font-semibold text-foreground">Performance dos urgentes</h3>
          </div>
          <div className="divide-y divide-border">
            {urgentPerformance.map((item) => (
              <div key={item.id} className="grid gap-2 px-5 py-3 text-[12px] md:grid-cols-[minmax(0,1fr)_110px_90px] md:items-center">
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{item.title}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">Urgente ativo na faixa editorial</p>
                </div>
                <div className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{item.views24h}</span> views 24h
                </div>
                <div className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{item.clicks}</span> cliques
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {zoneConfigs.map((config) => {
          const inspection = zoneInspection.find((item) => item.key === config.key);
          const candidates = candidatesByZone[config.key] ?? [];

          return (
            <div key={config.key} className="overflow-hidden rounded-lg bg-card shadow-editorial">
              <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                <h3 className="font-ui text-[13px] font-semibold text-foreground flex items-center gap-2">
                  <Home className="h-3.5 w-3.5 text-bronze" strokeWidth={1.5} />
                  {config.title}
                </h3>
                <span className="rounded-full bg-status-published/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-status-published">
                  {config.mode}
                </span>
              </div>

              <div className="space-y-4 p-4">
                <div className="rounded-md bg-secondary/40 p-3 text-[12px] text-muted-foreground">
                  Precedência: `manual` respeita a ordem dos pinados; se faltar slot e o fallback estiver ativo, a zona completa com itens automáticos. `hybrid` sempre mistura pinados + automáticos. `automatic` ignora pinagem.
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <label className="space-y-1">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Modo</span>
                    <select
                      value={config.mode}
                      onChange={(event) => handleModeChange(config.key, event.target.value as HomeZoneMode)}
                      disabled={!canEditHome}
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-[12px] text-foreground focus:outline-none"
                    >
                      <option value="manual">Manual</option>
                      <option value="automatic">Automático</option>
                      <option value="hybrid">Híbrido</option>
                    </select>
                  </label>

                  <label className="space-y-1">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Quantidade</span>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={config.maxItems}
                      onChange={(event) => handleMaxItemsChange(config.key, event.target.value)}
                      disabled={!canEditHome}
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-[12px] text-foreground focus:outline-none"
                    />
                  </label>

                  <label className="flex items-end gap-2 rounded-md border border-dashed border-border px-3 py-2">
                    <input
                      type="checkbox"
                      checked={config.fallbackToAutomatic}
                      onChange={(event) => handleToggleFallback(config.key, event.target.checked)}
                      disabled={!canEditHome}
                    />
                    <span className="text-[12px] text-foreground">Fallback automático</span>
                  </label>
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                  <label className="space-y-1">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Ordenação</span>
                    <select
                      value={config.sort}
                      onChange={(event) => handleSortChange(config.key, event.target.value as HomeZoneSort)}
                      disabled={!canEditHome}
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-[12px] text-foreground focus:outline-none"
                    >
                      <option value="published_desc">Mais recente</option>
                      <option value="priority_desc">Prioridade editorial</option>
                    </select>
                  </label>

                  <label className="space-y-1">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Prioridade mínima</span>
                    <select
                      value={getPriorityFloor(config)}
                      onChange={(event) => handlePriorityChange(config.key, event.target.value as EditorialPriority)}
                      disabled={!canEditHome}
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-[12px] text-foreground focus:outline-none"
                    >
                      {PRIORITY_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-1">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Janela</span>
                    <select
                      value={String(config.dateWindowDays ?? 30)}
                      onChange={(event) => handleDateWindowChange(config.key, event.target.value)}
                      disabled={!canEditHome}
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-[12px] text-foreground focus:outline-none"
                    >
                      <option value="2">2 dias</option>
                      <option value="7">7 dias</option>
                      <option value="14">14 dias</option>
                      <option value="30">30 dias</option>
                    </select>
                  </label>

                  <label className="space-y-1">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Editoria</span>
                    <select
                      value={config.allowedEditorias?.[0] ?? ""}
                      onChange={(event) => handleEditoriaFilter(config.key, event.target.value)}
                      disabled={!canEditHome}
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-[12px] text-foreground focus:outline-none"
                    >
                      <option value="">Todas</option>
                      {editorias.map((item) => (
                        <option key={item.id} value={item.slug}>{item.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Excluir formato</span>
                    <select
                      value={config.excludedTypes?.[0] ?? ""}
                      onChange={(event) => updateHomeZoneConfig(config.key, { excludedTypes: event.target.value ? [event.target.value as never] : [] })}
                      disabled={!canEditHome}
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-[12px] text-foreground focus:outline-none"
                    >
                      <option value="">Nenhum</option>
                      <option value="news">Noticia</option>
                      <option value="decision">Decisao</option>
                      <option value="article">Artigo</option>
                      <option value="opinion">Opiniao</option>
                    </select>
                  </label>
                </div>

                <div className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-[12px]">
                  <span className="text-foreground">Priorizar decisoes de alto impacto</span>
                  <input
                    type="checkbox"
                    checked={config.preferHighImpactDecisions ?? false}
                    onChange={(event) => updateHomeZoneConfig(config.key, { preferHighImpactDecisions: event.target.checked })}
                    disabled={!canEditHome}
                  />
                </div>

                <div className="rounded-md border border-border px-3 py-2 text-[11px] text-muted-foreground">
                  {(() => {
                    const perf = zonePerformance.find((item) => item.key === config.key);
                    return `Performance: ${perf?.views24h ?? 0} views em 24h · CTR ${perf?.homeCtr ?? 0}%`;
                  })()}
                </div>

                {candidates.length > 0 && (
                  <div className="rounded-md border border-border p-3">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Pinagem manual</p>
                    <div className="mt-2 grid gap-2 md:grid-cols-[minmax(0,1fr)_180px_110px]">
                      <select
                        value={selectedPins[config.key] ?? ""}
                        onChange={(event) => setSelectedPins((current) => ({ ...current, [config.key]: event.target.value }))}
                        disabled={!canEditHome}
                        className="h-9 flex-1 rounded-md border border-input bg-background px-3 text-[12px] text-foreground focus:outline-none"
                      >
                        <option value="">Selecionar conteúdo</option>
                        {candidates.map((item) => (
                          <option key={item.id} value={item.id}>{item.title}</option>
                        ))}
                      </select>
                      <input
                        type="datetime-local"
                        value={pinExpiry[config.key] ?? ""}
                        onChange={(event) => setPinExpiry((current) => ({ ...current, [config.key]: event.target.value }))}
                        disabled={!canEditHome}
                        className="h-9 rounded-md border border-input bg-background px-3 text-[12px] text-foreground"
                      />
                      <button
                        onClick={() => handlePin(config.key)}
                        disabled={!canEditHome}
                        className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-[12px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        <Pin className="h-3.5 w-3.5" strokeWidth={1.5} />
                        Fixar
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Itens ativos na zona</p>
                  {inspection?.items.map((item, index) => {
                    const pinnedIndex = config.pinnedContentIds.indexOf(item.id);
                    const isPinned = pinnedIndex !== -1;
                    return (
                      <div key={item.id} className="rounded-md border border-border p-3 text-[12px]">
                        <div className="flex items-center gap-3">
                          <span className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-[10px] font-bold tabular-nums text-primary">
                            {index + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-foreground">{item.title}</p>
                            <p className="mt-0.5 text-[10px] text-muted-foreground">
                              {item.editoriaName} · {item.type} · {item.publishedLabel}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
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

                        {isPinned && (
                          <div className="mt-3 flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleMovePinned(config.key, item.id, "up")}
                              disabled={pinnedIndex === 0}
                              className="flex h-8 items-center gap-1 rounded-md border border-input px-2.5 text-[11px] font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
                            >
                              <ArrowUp className="h-3.5 w-3.5" strokeWidth={1.5} />
                              Subir
                            </button>
                            <button
                              onClick={() => handleMovePinned(config.key, item.id, "down")}
                              disabled={pinnedIndex === config.pinnedContentIds.length - 1}
                              className="flex h-8 items-center gap-1 rounded-md border border-input px-2.5 text-[11px] font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
                            >
                              <ArrowDown className="h-3.5 w-3.5" strokeWidth={1.5} />
                              Descer
                            </button>
                            <button
                              onClick={() => handleUnpin(config.key, item.id)}
                              disabled={!canEditHome}
                              className="flex h-8 items-center gap-1 rounded-md border border-input px-2.5 text-[11px] font-medium text-foreground transition-colors hover:bg-secondary"
                            >
                              <PinOff className="h-3.5 w-3.5" strokeWidth={1.5} />
                              Desfixar
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {!inspection?.items.length && <p className="text-[12px] text-muted-foreground">Zona sem itens publicados.</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
