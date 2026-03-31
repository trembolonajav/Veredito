import React, { useMemo, useState } from "react";
import { Bell, Globe, LayoutGrid, Save, Settings } from "lucide-react";
import { currentUserCan, getEditorialEditorias, getSiteConfig } from "@/domain/editorial/selectors";
import { updateSiteConfig, useEditorialSnapshot } from "@/domain/editorial/store";

export default function ConfiguracoesPage() {
  const snapshot = useEditorialSnapshot();
  const config = getSiteConfig(snapshot);
  const canManageSettings = currentUserCan("manage_settings", snapshot);
  const visibleEditorias = useMemo(
    () => getEditorialEditorias(snapshot).filter((item) => item.isVisibleInNavigation),
    [snapshot]
  );
  const [form, setForm] = useState(config);

  React.useEffect(() => {
    setForm(config);
  }, [config]);

  const handleSave = () => {
    updateSiteConfig(form);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl text-foreground">Configuracoes</h2>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          Modulos com efeito real sobre header, newsletter, SEO base e alertas editoriais.
        </p>
      </div>

      {!canManageSettings && <div className="rounded-lg border border-border bg-card p-4 text-[12px] text-muted-foreground">Leitura em modo protegido. O papel atual nao pode alterar configuracoes globais.</div>}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-lg bg-card p-6 shadow-editorial space-y-6">
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" strokeWidth={1.5} />
              <h3 className="text-[14px] font-semibold text-foreground">Geral</h3>
            </div>
            <fieldset disabled={!canManageSettings} className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1.5 md:col-span-2">
                <span className="text-[12px] font-medium text-foreground">Nome do portal</span>
                <input value={form.siteName} onChange={(e) => setForm((current) => ({ ...current, siteName: e.target.value }))} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]" />
              </label>
              <label className="space-y-1.5 md:col-span-2">
                <span className="text-[12px] font-medium text-foreground">Descricao institucional</span>
                <textarea value={form.siteDescription} onChange={(e) => setForm((current) => ({ ...current, siteDescription: e.target.value }))} rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-[13px]" />
              </label>
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-foreground">Label da newsletter</span>
                <input value={form.newsletterLabel} onChange={(e) => setForm((current) => ({ ...current, newsletterLabel: e.target.value }))} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]" />
              </label>
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-foreground">Analytics ID</span>
                <input value={form.analyticsId || ""} onChange={(e) => setForm((current) => ({ ...current, analyticsId: e.target.value }))} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]" />
              </label>
              <label className="flex items-center justify-between rounded-md border border-border px-4 py-3 md:col-span-2">
                <span className="text-[12px] font-medium text-foreground">Newsletter ativa na home</span>
                <input type="checkbox" checked={form.homeNewsletterEnabled ?? true} onChange={(e) => setForm((current) => ({ ...current, homeNewsletterEnabled: e.target.checked }))} />
              </label>
            </fieldset>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" strokeWidth={1.5} />
              <h3 className="text-[14px] font-semibold text-foreground">SEO global</h3>
            </div>
            <fieldset disabled={!canManageSettings} className="grid gap-4">
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-foreground">SEO title padrao</span>
                <input value={form.seoTitleDefault} onChange={(e) => setForm((current) => ({ ...current, seoTitleDefault: e.target.value }))} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]" />
              </label>
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-foreground">SEO description padrao</span>
                <textarea value={form.seoDescriptionDefault} onChange={(e) => setForm((current) => ({ ...current, seoDescriptionDefault: e.target.value }))} rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-[13px]" />
              </label>
            </fieldset>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" strokeWidth={1.5} />
              <h3 className="text-[14px] font-semibold text-foreground">Alertas editoriais</h3>
            </div>
            <fieldset disabled={!canManageSettings}><label className="space-y-1.5">
              <span className="text-[12px] font-medium text-foreground">Email operacional</span>
              <input value={form.editorialAlertsEmail || ""} onChange={(e) => setForm((current) => ({ ...current, editorialAlertsEmail: e.target.value }))} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]" />
            </label></fieldset>
          </section>

          <button type="button" disabled={!canManageSettings} onClick={handleSave} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
            <Save className="h-3.5 w-3.5" strokeWidth={2} />
            Salvar configuracoes
          </button>
        </div>

        <div className="space-y-5">
          <div className="rounded-lg bg-card p-5 shadow-editorial">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-primary" strokeWidth={1.5} />
              <h3 className="text-[14px] font-semibold text-foreground">Navegacao publica</h3>
            </div>
            <p className="mt-2 text-[12px] text-muted-foreground">
              O header ja usa estas configuracoes e a ordem das editorias cadastradas.
            </p>
            <div className="mt-4 space-y-2">
              {visibleEditorias.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-[12px]">
                  <span>{item.name}</span>
                  <span className="text-muted-foreground">ordem {item.menuOrder}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-card p-5 shadow-editorial">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" strokeWidth={1.5} />
              <h3 className="text-[14px] font-semibold text-foreground">Efeito atual</h3>
            </div>
            <div className="mt-4 space-y-2 text-[12px] text-muted-foreground">
              <p><span className="text-foreground font-medium">Portal:</span> {form.siteName}</p>
              <p><span className="text-foreground font-medium">Newsletter:</span> {form.newsletterLabel}</p>
              <p><span className="text-foreground font-medium">SEO base:</span> {form.seoTitleDefault}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
