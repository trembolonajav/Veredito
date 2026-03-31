import { editorialImages } from "./mockData";
import { getEditorialSnapshot, type EditorialSnapshot } from "./store";
import type {
  ContentRecord,
  EditorialPriority,
  PublicContentCardVM,
} from "./types";

export function getIndexes(snapshot: EditorialSnapshot) {
  return {
    contentById: new Map(snapshot.contents.map((item) => [item.id, item])),
    exposureById: new Map(snapshot.exposures.map((item) => [item.contentId, item])),
    seoById: new Map(snapshot.seo.map((item) => [item.contentId, item])),
    mediaById: new Map(snapshot.media.map((item) => [item.contentId, item])),
    decisionById: new Map(snapshot.decisionMeta.map((item) => [item.contentId, item])),
    authorById: new Map(snapshot.authors.map((item) => [item.id, item])),
    editoriaById: new Map(snapshot.editorias.map((item) => [item.id, item])),
    sourceById: new Map(snapshot.sources.map((item) => [item.id, item])),
  };
}

export function getPublishedContents(snapshot = getEditorialSnapshot()): ContentRecord[] {
  const { exposureById } = getIndexes(snapshot);
  return snapshot.contents.filter((content) => exposureById.get(content.id)?.isPublished);
}

export function getPublicCardByContent(content: ContentRecord, snapshot = getEditorialSnapshot()): PublicContentCardVM {
  const { exposureById, authorById, editoriaById, mediaById, decisionById } = getIndexes(snapshot);
  const exposure = exposureById.get(content.id);
  const author = authorById.get(content.authorId);
  const editoria = editoriaById.get(content.editoriaId);
  const image = mediaById.get(content.id);
  const decision = decisionById.get(content.id);

  return {
    id: content.id,
    type: content.type,
    title: content.title,
    summary: content.summaryCard ?? content.lead,
    slug: content.slug,
    editoriaName: editoria?.name ?? content.editoriaId,
    authorName: author?.publicName ?? author?.name ?? "Redacao Veredito",
    authorRole: author?.role,
    publishedLabel: formatPublishedLabel(content.publishedAt),
    readingTimeLabel: content.readingTime ? `${content.readingTime} min` : undefined,
    imageUrl: image?.coverImageId ? editorialImages[image.coverImageId] : undefined,
    imageAlt: image?.altText,
    urgentLabel: exposure?.isUrgent ? exposure.urgentTitle : undefined,
    decisionMeta: decision
      ? {
          court: decision.court,
          practicalImpact: formatImpact(decision.practicalImpact),
          judgmentDate: formatPublishedLabel(decision.judgmentDate),
        }
      : undefined,
  };
}

export function byPublishedDateDesc(a: ContentRecord, b: ContentRecord) {
  return new Date(b.publishedAt ?? b.updatedAt).getTime() - new Date(a.publishedAt ?? a.updatedAt).getTime();
}

export function priorityRank(priority: EditorialPriority) {
  const ranks: Record<EditorialPriority, number> = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };
  return ranks[priority];
}

export function formatPublishedLabel(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export function translateType(type: ContentRecord["type"]) {
  const labels = { news: "Noticia", decision: "Decisao", article: "Artigo", opinion: "Opiniao" } as const;
  return labels[type];
}

export function translateStatus(status: ContentRecord["status"]) {
  const labels = {
    draft: "Rascunho",
    in_review: "Revisao",
    legal_review: "Revisao juridica",
    approved: "Aprovado",
    scheduled: "Agendado",
    published: "Publicado",
    archived: "Arquivado",
  } as const;
  return labels[status];
}

export function formatImpact(value?: "low" | "medium" | "high") {
  if (!value) return undefined;
  const labels = { low: "Baixo", medium: "Medio", high: "Alto" } as const;
  return labels[value];
}
