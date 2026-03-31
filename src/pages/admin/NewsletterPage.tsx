import React, { useMemo, useState } from "react";
import { Calendar, Eye, Plus, Save, Send } from "lucide-react";
import {
  currentUserCan,
  getCardsByType,
  getNewsletterOperationalRows,
  getSiteConfig,
} from "@/domain/editorial/selectors";
import { upsertNewsletterEdition, useEditorialSnapshot } from "@/domain/editorial/store";

function getAllPublishedCards(snapshot: ReturnType<typeof useEditorialSnapshot>) {
  return [
    ...getCardsByType("news", snapshot),
    ...getCardsByType("decision", snapshot),
    ...getCardsByType("article", snapshot),
    ...getCardsByType("opinion", snapshot),
  ];
}

export default function NewsletterPage() {
  const snapshot = useEditorialSnapshot();
  const editions = getNewsletterOperationalRows(snapshot);
  const siteConfig = getSiteConfig(snapshot);
  const canManageNewsletter = currentUserCan("manage_newsletter", snapshot);
  const canSendNewsletter = currentUserCan("publish", snapshot);
  const publishedCards = useMemo(() => getAllPublishedCards(snapshot), [snapshot]);
  const [selectedId, setSelectedId] = useState<string>(editions[0]?.id ?? "");
  const selected = editions.find((item) => item.id === selectedId) ?? editions[0];
  const [form, setForm] = useState(() => ({
    id: selected?.id ?? `newsletter-${Date.now()}`,
    subject: selected?.subject ?? "",
    intro: selected?.intro ?? "",
    headlineContentId: selected?.headlineContentId ?? "",
    contentIds: selected?.contentIds ?? [],
    status: selected?.status ?? "draft",
    scheduledAt: selected?.scheduledAt ? selected.scheduledAt.slice(0, 16) : "",
  }));

  React.useEffect(() => {
    setForm({
      id: selected?.id ?? `newsletter-${Date.now()}`,
      subject: selected?.subject ?? "",
      intro: selected?.intro ?? "",
      headlineContentId: selected?.headlineContentId ?? "",
      contentIds: selected?.contentIds ?? [],
      status: selected?.status ?? "draft",
      scheduledAt: selected?.scheduledAt ? selected.scheduledAt.slice(0, 16) : "",
    });
  }, [selected]);

  const selectedCards = publishedCards.filter((item) => form.contentIds.includes(item.id));
  const headlineCard = publishedCards.find((item) => item.id === form.headlineContentId);
  const selectedEditionAnalytics = selected
    ? {
        views24h: selected.totalViews24h,
        newsletterClicks: selected.totalNewsletterClicks,
      }
    : { views24h: 0, newsletterClicks: 0 };

  const handleToggleContent = (contentId: string) => {
    setForm((current) => ({
      ...current,
      contentIds: current.contentIds.includes(contentId)
        ? current.contentIds.filter((item) => item !== contentId)
        : [...current.contentIds, contentId],
    }));
  };

  const moveContent = (contentId: string, direction: "up" | "down") => {
    setForm((current) => {
      const index = current.contentIds.indexOf(contentId);
      const nextIndex = direction === "up" ? index - 1 : index + 1;
      if (index === -1 || nextIndex < 0 || nextIndex >= current.contentIds.length) return current;
      const nextIds = [...current.contentIds];
      [nextIds[index], nextIds[nextIndex]] = [nextIds[nextIndex], nextIds[index]];
      return { ...current, contentIds: nextIds };
    });
  };

  const handleSave = (statusOverride?: "draft" | "scheduled" | "sent") => {
    if (statusOverride === "sent" ? !canSendNewsletter : !canManageNewsletter) return;
    upsertNewsletterEdition({
      id: form.id,
      subject: form.subject,
      intro: form.intro,
      headlineContentId: form.headlineContentId || undefined,
      contentIds: form.contentIds,
      status: statusOverride ?? form.status,
      scheduledAt: statusOverride === "scheduled" && form.scheduledAt ? new Date(form.scheduledAt).toISOString() : undefined,
      sentAt: statusOverride === "sent" ? new Date().toISOString() : undefined,
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-foreground">Newsletter</h2>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Builder editorial com rascunho, ordenacao manual, destaque principal e preview local.
          </p>
        </div>
        <button
          type="button"
          disabled={!canManageNewsletter}
          onClick={() => {
            setSelectedId("");
            setForm({
              id: `newsletter-${Date.now()}`,
              subject: "",
              intro: "",
              headlineContentId: "",
              contentIds: [],
              status: "draft",
              scheduledAt: "",
            });
          }}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          Nova edicao
        </button>
      </div>

      {!canManageNewsletter && (
        <div className="rounded-lg border border-border bg-card p-4 text-[12px] text-muted-foreground">
          Leitura em modo protegido. O papel atual pode acompanhar a newsletter, mas nao editar nem agendar.
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)_360px]">
        <div className="overflow-hidden rounded-lg bg-card shadow-editorial">
          <div className="border-b border-border px-5 py-3.5">
            <h3 className="text-[14px] font-semibold text-foreground">Edicoes</h3>
          </div>
          <div className="divide-y divide-border">
            {editions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`w-full px-5 py-4 text-left transition-colors ${
                  item.id === selected?.id ? "bg-secondary/60" : "hover:bg-secondary/40"
                }`}
              >
                <p className="line-clamp-2 text-[13px] font-medium text-foreground">{item.subject}</p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span>{item.status}</span>
                  <span>-</span>
                  <span>{item.items.length} itens</span>
                  <span>-</span>
                  <span>{item.totalNewsletterClicks} cliques</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5 rounded-lg bg-card p-6 shadow-editorial">
          <div className="flex items-center justify-between">
            <h3 className="font-ui text-[16px] font-semibold text-foreground">Builder da edicao</h3>
            <div className="flex items-center gap-2">
              <button
                disabled={!canManageNewsletter}
                onClick={() => handleSave("draft")}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-input px-4 text-[12px] hover:bg-secondary disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" strokeWidth={2} />
                Rascunho
              </button>
              <button
                disabled={!canManageNewsletter}
                onClick={() => handleSave("scheduled")}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-input px-4 text-[12px] hover:bg-secondary disabled:opacity-50"
              >
                <Calendar className="h-3.5 w-3.5" strokeWidth={1.5} />
                Agendar
              </button>
            </div>
          </div>

          <fieldset disabled={!canManageNewsletter} className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-[12px] font-medium text-foreground">Assunto</span>
              <input
                value={form.subject}
                onChange={(e) => setForm((current) => ({ ...current, subject: e.target.value }))}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-[12px] font-medium text-foreground">Texto de abertura</span>
              <textarea
                value={form.intro}
                onChange={(e) => setForm((current) => ({ ...current, intro: e.target.value }))}
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-[13px]"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-[12px] font-medium text-foreground">Destaque principal</span>
              <select
                value={form.headlineContentId}
                onChange={(e) => setForm((current) => ({ ...current, headlineContentId: e.target.value }))}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]"
              >
                <option value="">Selecionar</option>
                {publishedCards.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className="text-[12px] font-medium text-foreground">Agendamento</span>
              <input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => setForm((current) => ({ ...current, scheduledAt: e.target.value }))}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]"
              />
            </label>
          </fieldset>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-md border border-border px-3 py-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Views 24h dos itens</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{selectedEditionAnalytics.views24h}</p>
            </div>
            <div className="rounded-md border border-border px-3 py-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Cliques na newsletter</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{selectedEditionAnalytics.newsletterClicks}</p>
            </div>
          </div>

          <div className="grid gap-2">
            <p className="text-[12px] font-medium text-foreground">Conteudos publicados</p>
            <div className="max-h-[320px] space-y-2 overflow-auto pr-1">
              {publishedCards.map((item) => (
                <label key={item.id} className="flex items-start justify-between gap-3 rounded-md border border-border px-3 py-2">
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-[12px] font-medium text-foreground">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {item.editoriaName} - {item.publishedLabel}
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {item.authorName} - {item.readingTimeLabel ?? "Leitura editorial"}
                    </p>
                  </div>
                  <input type="checkbox" checked={form.contentIds.includes(item.id)} onChange={() => handleToggleContent(item.id)} />
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-lg bg-card p-5 shadow-editorial">
            <div className="mb-3 flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" strokeWidth={1.5} />
              <h3 className="text-[14px] font-semibold text-foreground">Preview</h3>
            </div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{siteConfig.newsletterLabel}</p>
            <h4 className="mt-2 font-display text-[22px] leading-tight">{form.subject || "Assunto da edicao"}</h4>
            <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
              {form.intro || "Texto de abertura da newsletter."}
            </p>
            {headlineCard && (
              <div className="mt-5 rounded-md border border-border p-4">
                <p className="section-label mb-2">Destaque principal</p>
                <p className="text-[14px] font-semibold text-foreground">{headlineCard.title}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {headlineCard.editoriaName} - {headlineCard.publishedLabel}
                </p>
              </div>
            )}
            <div className="mt-5 space-y-3">
              {selectedCards.map((item, index) => (
                <div key={item.id} className="rounded-md border border-border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[12px] font-medium text-foreground">{item.title}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">{item.editoriaName}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveContent(item.id, "up")}
                        className="h-7 rounded-md border border-input px-2 text-[10px]"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveContent(item.id, "down")}
                        className="h-7 rounded-md border border-input px-2 text-[10px]"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">posicao {index + 1}</p>
                </div>
              ))}
            </div>
            <button
              disabled={!canSendNewsletter}
              onClick={() => handleSave("sent")}
              className="mt-5 inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-[12px] font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" strokeWidth={2} />
              Marcar como enviada
            </button>
            {!canSendNewsletter && (
              <p className="mt-2 text-[11px] text-muted-foreground">
                O papel atual pode montar e agendar a newsletter, mas o envio exige permissao de publicacao.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
