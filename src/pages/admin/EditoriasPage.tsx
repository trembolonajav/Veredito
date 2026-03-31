import React, { useMemo, useState } from "react";
import { Layers, Plus, Save } from "lucide-react";
import { currentUserCan, getEditorialAuthors } from "@/domain/editorial/selectors";
import { upsertEditoria, useEditorialSnapshot } from "@/domain/editorial/store";
import type { EditoriaRecord } from "@/domain/editorial/types";

type EditoriaFormState = {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  seoDescription: string;
  menuOrder: number;
  isVisibleInNavigation: boolean;
  isFeaturedOnHome: boolean;
  defaultImageId: string;
  editorResponsible: string;
};

function toFormState(item?: EditoriaRecord): EditoriaFormState {
  return {
    id: item?.id ?? "",
    name: item?.name ?? "",
    slug: item?.slug ?? "",
    description: item?.description ?? "",
    longDescription: item?.longDescription ?? "",
    seoDescription: item?.seoDescription ?? "",
    menuOrder: item?.menuOrder ?? 1,
    isVisibleInNavigation: item?.isVisibleInNavigation ?? true,
    isFeaturedOnHome: item?.isFeaturedOnHome ?? false,
    defaultImageId: item?.defaultImageId ?? "",
    editorResponsible: item?.editorResponsible ?? "",
  };
}

function getSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function EditoriasPage() {
  const snapshot = useEditorialSnapshot();
  const authors = getEditorialAuthors(snapshot);
  const canManageEditorias = currentUserCan("manage_editorias", snapshot);
  const items = useMemo(
    () => [...snapshot.editorias].sort((a, b) => a.menuOrder - b.menuOrder),
    [snapshot.editorias]
  );
  const [selectedId, setSelectedId] = useState<string>(items[0]?.id ?? "");
  const selected = items.find((item) => item.id === selectedId) ?? items[0];
  const [form, setForm] = useState<EditoriaFormState>(() => toFormState(selected));

  React.useEffect(() => {
    setForm(toFormState(selected));
    if (selected) setSelectedId(selected.id);
  }, [selected]);

  const handleChange = <K extends keyof EditoriaFormState>(key: K, value: EditoriaFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleNew = () => {
    setSelectedId("");
    setForm(
      toFormState({
        id: `editoria-${Date.now()}`,
        name: "",
        slug: "",
        description: "",
        menuOrder: items.length + 1,
        isVisibleInNavigation: true,
        isFeaturedOnHome: false,
      } as EditoriaRecord)
    );
  };

  const handleSave = () => {
    const nextName = form.name.trim();
    if (!nextName) return;

    upsertEditoria({
      id: form.id || `editoria-${Date.now()}`,
      name: nextName,
      slug: form.slug.trim() || getSlug(nextName),
      description: form.description.trim(),
      longDescription: form.longDescription.trim() || undefined,
      seoDescription: form.seoDescription.trim() || undefined,
      menuOrder: Number(form.menuOrder) || 1,
      isVisibleInNavigation: form.isVisibleInNavigation,
      isFeaturedOnHome: form.isFeaturedOnHome,
      defaultImageId: form.defaultImageId.trim() || undefined,
      editorResponsible: form.editorResponsible || undefined,
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-foreground">Editorias</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Taxonomia editorial conectada ao menu publico, home e paginas de editoria.
          </p>
        </div>
        <button
          type="button"
          onClick={handleNew}
          disabled={!canManageEditorias}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          Nova editoria
        </button>
      </div>

      {!canManageEditorias && <div className="rounded-lg border border-border bg-card p-4 text-[12px] text-muted-foreground">Leitura em modo protegido. O papel atual nao pode editar editorias.</div>}

      <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="space-y-3">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`w-full rounded-lg border p-4 text-left transition-colors ${
                item.id === (selected?.id ?? "")
                  ? "border-primary bg-card shadow-editorial"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Layers className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] text-muted-foreground">ordem {item.menuOrder}</span>
              </div>
              <h3 className="mt-3 text-[15px] font-semibold text-foreground font-ui">{item.name}</h3>
              <p className="text-[12px] text-muted-foreground mt-1">/{item.slug}</p>
              <p className="text-[12px] text-muted-foreground mt-2 line-clamp-2">{item.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                <span className="rounded-full bg-secondary px-2 py-0.5">
                  {item.isVisibleInNavigation ? "Menu ativo" : "Menu oculto"}
                </span>
                <span className="rounded-full bg-secondary px-2 py-0.5">
                  {item.isFeaturedOnHome ? "Home ativa" : "Sem home"}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="rounded-lg bg-card p-6 shadow-editorial space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-semibold text-foreground font-ui">Governanca da editoria</h3>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                O que for salvo aqui afeta navegacao, pagina publica e elegibilidade na home.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={!canManageEditorias}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Save className="h-3.5 w-3.5" strokeWidth={2} />
              Salvar
            </button>
          </div>

          <fieldset disabled={!canManageEditorias} className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-[12px] font-medium text-foreground">Nome</span>
              <input value={form.name} onChange={(e) => handleChange("name", e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]" />
            </label>
            <label className="space-y-1.5">
              <span className="text-[12px] font-medium text-foreground">Slug</span>
              <input value={form.slug} onChange={(e) => handleChange("slug", getSlug(e.target.value))} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]" />
            </label>
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-[12px] font-medium text-foreground">Descricao curta</span>
              <textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-[13px]" />
            </label>
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-[12px] font-medium text-foreground">Descricao longa</span>
              <textarea value={form.longDescription} onChange={(e) => handleChange("longDescription", e.target.value)} rows={4} className="w-full rounded-md border border-input bg-background px-3 py-2 text-[13px]" />
            </label>
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-[12px] font-medium text-foreground">SEO da editoria</span>
              <textarea value={form.seoDescription} onChange={(e) => handleChange("seoDescription", e.target.value)} rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-[13px]" />
            </label>
            <label className="space-y-1.5">
              <span className="text-[12px] font-medium text-foreground">Ordem no menu</span>
              <input type="number" min={1} value={form.menuOrder} onChange={(e) => handleChange("menuOrder", Number(e.target.value))} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]" />
            </label>
            <label className="space-y-1.5">
              <span className="text-[12px] font-medium text-foreground">Editor responsavel</span>
              <select value={form.editorResponsible} onChange={(e) => handleChange("editorResponsible", e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]">
                <option value="">Selecionar</option>
                {authors.map((item) => (
                  <option key={item.id} value={item.publicName}>{item.publicName}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-[12px] font-medium text-foreground">Imagem padrao</span>
              <input value={form.defaultImageId} onChange={(e) => handleChange("defaultImageId", e.target.value)} placeholder="hero-courthouse" className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]" />
            </label>
          </fieldset>

          <fieldset disabled={!canManageEditorias} className="grid gap-3 md:grid-cols-2">
            <label className="flex items-center justify-between rounded-md border border-border px-4 py-3">
              <span className="text-[13px] text-foreground">Visivel na navegacao</span>
              <input type="checkbox" checked={form.isVisibleInNavigation} onChange={(e) => handleChange("isVisibleInNavigation", e.target.checked)} />
            </label>
            <label className="flex items-center justify-between rounded-md border border-border px-4 py-3">
              <span className="text-[13px] text-foreground">Elegivel para home</span>
              <input type="checkbox" checked={form.isFeaturedOnHome} onChange={(e) => handleChange("isFeaturedOnHome", e.target.checked)} />
            </label>
          </fieldset>
        </div>
      </div>
    </div>
  );
}
