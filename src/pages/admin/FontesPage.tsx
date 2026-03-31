import React, { useMemo, useState } from "react";
import { Activity, Globe, Plus, Save, Scale } from "lucide-react";
import { currentUserCan, getEditorialEditorias, getSourceOperationalRows } from "@/domain/editorial/selectors";
import { upsertSource, useEditorialSnapshot } from "@/domain/editorial/store";
import type { SourceRecord } from "@/domain/editorial/types";

type SourceFormState = {
  id: string;
  name: string;
  shortName: string;
  type: string;
  officialUrl: string;
  defaultEditoriaId: string;
  monitoringEnabled: boolean;
  priority: SourceRecord["priority"];
  monitoredTags: string;
  internalOwner: string;
  reliability: NonNullable<SourceRecord["reliability"]>;
  origin: NonNullable<SourceRecord["origin"]>;
};

function toFormState(item?: SourceRecord): SourceFormState {
  return {
    id: item?.id ?? "",
    name: item?.name ?? "",
    shortName: item?.shortName ?? "",
    type: item?.type ?? "",
    officialUrl: item?.officialUrl ?? "",
    defaultEditoriaId: item?.defaultEditoriaId ?? "",
    monitoringEnabled: item?.monitoringEnabled ?? false,
    priority: item?.priority ?? "medium",
    monitoredTags: item?.monitoredTags?.join(", ") ?? "",
    internalOwner: item?.internalOwner ?? "",
    reliability: item?.reliability ?? "medium",
    origin: item?.origin ?? "manual",
  };
}

export default function FontesPage() {
  const snapshot = useEditorialSnapshot();
  const editorias = getEditorialEditorias(snapshot);
  const operationalRows = getSourceOperationalRows(snapshot);
  const canManageSources = currentUserCan("manage_sources", snapshot);
  const items = useMemo(() => [...snapshot.sources].sort((a, b) => a.name.localeCompare(b.name)), [snapshot.sources]);
  const [selectedId, setSelectedId] = useState<string>(items[0]?.id ?? "");
  const selected = items.find((item) => item.id === selectedId) ?? items[0];
  const [form, setForm] = useState<SourceFormState>(() => toFormState(selected));

  React.useEffect(() => {
    setForm(toFormState(selected));
    if (selected) setSelectedId(selected.id);
  }, [selected]);

  const handleChange = <K extends keyof SourceFormState>(key: K, value: SourceFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSave = () => {
    const nextName = form.name.trim();
    if (!nextName) return;

    upsertSource({
      id: form.id || `source-${Date.now()}`,
      name: nextName,
      shortName: form.shortName.trim() || nextName.slice(0, 8).toUpperCase(),
      type: form.type.trim() || "tribunal",
      officialUrl: form.officialUrl.trim() || undefined,
      defaultEditoriaId: form.defaultEditoriaId || undefined,
      monitoringEnabled: form.monitoringEnabled,
      priority: form.priority,
      monitoredTags: form.monitoredTags.split(",").map((item) => item.trim()).filter(Boolean),
      internalOwner: form.internalOwner.trim() || undefined,
      reliability: form.reliability,
      origin: form.origin,
    });
  };

  const handleNew = () => {
    setSelectedId("");
    setForm(toFormState({
      id: `source-${Date.now()}`,
      name: "",
      shortName: "",
      type: "",
      monitoringEnabled: true,
      priority: "medium",
    } as SourceRecord));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-foreground">Fontes</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Fontes operacionais ligadas a pauta, conteudo e monitoramento editorial.
          </p>
        </div>
        <button type="button" disabled={!canManageSources} onClick={handleNew} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          Nova fonte
        </button>
      </div>

      {!canManageSources && <div className="rounded-lg border border-border bg-card p-4 text-[12px] text-muted-foreground">Leitura em modo protegido. O papel atual nao pode editar fontes.</div>}

      <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="grid gap-4">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`rounded-lg bg-card p-5 text-left shadow-editorial transition-colors ${
                item.id === (selected?.id ?? "") ? "border border-primary" : "border border-transparent hover:border-primary/30"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Scale className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div className="flex items-center gap-2">
                  {item.monitoringEnabled && <Activity className="h-3.5 w-3.5 text-status-published" strokeWidth={2} />}
                  <span className="text-[11px] font-bold text-bronze tracking-wider">{item.shortName}</span>
                </div>
              </div>
              <h3 className="mt-3 text-[14px] font-semibold text-foreground font-ui">{item.name}</h3>
              <p className="mt-1 text-[12px] text-muted-foreground">{item.type}</p>
              <div className="mt-3 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <Globe className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span className="truncate">{item.officialUrl || "sem URL oficial"}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="rounded-lg bg-card p-6 shadow-editorial space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-semibold text-foreground font-ui">Ficha operacional da fonte</h3>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                O cadastro daqui alimenta formulario, priorizacao e governanca editorial.
              </p>
            </div>
            <button type="button" disabled={!canManageSources} onClick={handleSave} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
              <Save className="h-3.5 w-3.5" strokeWidth={2} />
              Salvar
            </button>
          </div>

          <fieldset disabled={!canManageSources} className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-[12px] font-medium text-foreground">Nome</span>
              <input value={form.name} onChange={(e) => handleChange("name", e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]" />
            </label>
            <label className="space-y-1.5">
              <span className="text-[12px] font-medium text-foreground">Sigla</span>
              <input value={form.shortName} onChange={(e) => handleChange("shortName", e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]" />
            </label>
            <label className="space-y-1.5">
              <span className="text-[12px] font-medium text-foreground">Tipo</span>
              <input value={form.type} onChange={(e) => handleChange("type", e.target.value)} placeholder="tribunal, orgao, clipping..." className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]" />
            </label>
            <label className="space-y-1.5">
              <span className="text-[12px] font-medium text-foreground">URL oficial</span>
              <input value={form.officialUrl} onChange={(e) => handleChange("officialUrl", e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]" />
            </label>
            <label className="space-y-1.5">
              <span className="text-[12px] font-medium text-foreground">Editoria padrao</span>
              <select value={form.defaultEditoriaId} onChange={(e) => handleChange("defaultEditoriaId", e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]">
                <option value="">Selecionar</option>
                {editorias.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-[12px] font-medium text-foreground">Prioridade</span>
              <select value={form.priority} onChange={(e) => handleChange("priority", e.target.value as SourceRecord["priority"])} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]">
                <option value="low">baixa</option>
                <option value="medium">media</option>
                <option value="high">alta</option>
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-[12px] font-medium text-foreground">Confiabilidade</span>
              <select value={form.reliability} onChange={(e) => handleChange("reliability", e.target.value as NonNullable<SourceRecord["reliability"]>)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]">
                <option value="low">baixa</option>
                <option value="medium">media</option>
                <option value="high">alta</option>
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-[12px] font-medium text-foreground">Origem</span>
              <select value={form.origin} onChange={(e) => handleChange("origin", e.target.value as NonNullable<SourceRecord["origin"]>)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]">
                <option value="manual">manual</option>
                <option value="rss">rss</option>
                <option value="api">api</option>
                <option value="clipping">clipping</option>
              </select>
            </label>
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-[12px] font-medium text-foreground">Tags monitoradas</span>
              <input value={form.monitoredTags} onChange={(e) => handleChange("monitoredTags", e.target.value)} placeholder="stf, itbi, recuperacao judicial" className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]" />
            </label>
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-[12px] font-medium text-foreground">Responsavel interno</span>
              <input value={form.internalOwner} onChange={(e) => handleChange("internalOwner", e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]" />
            </label>
          </fieldset>

          <fieldset disabled={!canManageSources}><label className="flex items-center justify-between rounded-md border border-border px-4 py-3">
            <span className="text-[13px] text-foreground">Monitoramento ativo</span>
            <input type="checkbox" checked={form.monitoringEnabled} onChange={(e) => handleChange("monitoringEnabled", e.target.checked)} />
          </label></fieldset>
        </div>
      </div>

      <div className="rounded-lg bg-card shadow-editorial overflow-hidden">
        <div className="border-b border-border px-5 py-3.5">
          <h3 className="text-[14px] font-semibold text-foreground">Leitura operacional das fontes</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Fonte</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Editoria padrao</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Confiabilidade</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Conteudos</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden xl:table-cell">Ultimo vinculo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {operationalRows.map((item) => (
              <tr key={item.id} className="hover:bg-secondary/40 transition-colors">
                <td className="px-5 py-3">
                  <div>
                    <p className="text-[13px] font-medium text-foreground">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground">{item.shortName} · {item.origin}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-[12px] text-muted-foreground">{item.defaultEditoriaName}</td>
                <td className="px-4 py-3 text-[12px] text-muted-foreground">{item.reliability}</td>
                <td className="px-4 py-3 text-[12px] text-foreground">{item.linkedContentCount}</td>
                <td className="px-4 py-3 text-[12px] text-muted-foreground hidden xl:table-cell">{item.latestLinkedTitle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
