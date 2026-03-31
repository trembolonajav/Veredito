import { getEditorialSnapshot, type EditorialSnapshot } from "./store";
import {
  byPublishedDateDesc,
  getIndexes,
  getPublicCardByContent,
  getPublishedContents,
  priorityRank,
  translateStatus,
  translateType,
} from "./selectorCore";
import type {
  AuthorRecord,
  ContentRecord,
  ContentStatus,
  EditorialPriority,
  EditoriaRecord,
  PublicAuthorPageVM,
  HomeZoneKey,
  HomeZoneConfigRecord,
  HomeZoneInspectionVM,
  HomeZoneItemOrigin,
  HomeZoneVM,
  PublicContentCardVM,
  PublicContentPageVM,
  SourceRecord,
  WorkflowChecklistItemRecord,
} from "./types";

export { getAnalyticsOverview } from "./analyticsSelectors";
export { getNewsletterEditionRows, getNewsletterOperationalRows } from "./newsletterSelectors";
export { getIndexes, getPublishedContents, getPublicCardByContent } from "./selectorCore";

type ResolvedZoneItem = {
  card: PublicContentCardVM;
  origin: HomeZoneItemOrigin;
  priority: EditorialPriority;
};

export function getEditorialAuthors(snapshot = getEditorialSnapshot()): AuthorRecord[] {
  return snapshot.authors;
}

export function getEditorialEditorias(snapshot = getEditorialSnapshot()): EditoriaRecord[] {
  return [...snapshot.editorias].sort((a, b) => a.menuOrder - b.menuOrder);
}

export function getEditorialSources(snapshot = getEditorialSnapshot()): SourceRecord[] {
  return snapshot.sources;
}

export function getAdminUsers(snapshot = getEditorialSnapshot()) {
  return [...snapshot.adminUsers].sort((a, b) => a.name.localeCompare(b.name));
}

export function getRolePermissions(snapshot = getEditorialSnapshot()) {
  return snapshot.rolePermissions;
}

export function getPermissionsForRole(role: string, snapshot = getEditorialSnapshot()) {
  return snapshot.rolePermissions.find((item) => item.role === role)?.permissions ?? [];
}

export function getSiteConfig(snapshot = getEditorialSnapshot()) {
  return snapshot.siteConfig;
}

export function getCurrentAdminUser(snapshot = getEditorialSnapshot()) {
  const currentId = snapshot.siteConfig.currentAdminUserId;
  return snapshot.adminUsers.find((item) => item.id === currentId) ?? snapshot.adminUsers[0];
}

export function currentUserCan(permission: string, snapshot = getEditorialSnapshot()) {
  const currentUser = getCurrentAdminUser(snapshot);
  if (!currentUser) return false;
  return getPermissionsForRole(currentUser.role, snapshot).includes(permission);
}

export function getPublicNavigation(snapshot = getEditorialSnapshot()) {
  return {
    formatos: [
      { label: "Notícias", to: "/noticias" },
      { label: "Decisões", to: "/decisoes" },
      { label: "Artigos", to: "/artigos" },
      { label: "Opinião", to: "/opiniao" },
      { label: "Sobre", to: "/sobre" },
    ],
    editorias: getEditorialEditorias(snapshot)
      .filter((item) => item.isVisibleInNavigation)
      .map((item) => ({ label: item.name, to: `/editoria/${item.slug}` })),
  };
}

export function getPrimaryNavigationItems(snapshot = getEditorialSnapshot()) {
  const fixedItems = [
    { key: "home", label: "Início", to: "/" },
    { key: "news", label: "Notícias", to: "/noticias" },
    { key: "decision", label: "Decisões", to: "/decisoes" },
    { key: "article", label: "Artigos", to: "/artigos" },
    { key: "opinion", label: "Opinião", to: "/opiniao" },
    { key: "newsletter", label: "Newsletter", to: "/newsletter" },
  ];

  const editoriaItems = getEditorialEditorias(snapshot)
    .filter((item) => item.isVisibleInNavigation)
    .map((item) => ({
      key: `editoria:${item.slug}`,
      label: item.name,
      to: `/editoria/${item.slug}`,
      kind: "editoria" as const,
      slug: item.slug,
    }));

  return [...fixedItems.map((item) => ({ ...item, kind: "fixed" as const })), ...editoriaItems];
}

export function getActiveNavContext(pathname: string, snapshot = getEditorialSnapshot()) {
  const primaryItems = getPrimaryNavigationItems(snapshot);
  const activeContent = getContentByPathname(pathname, snapshot);

  const editoriaFromContent = activeContent
    ? snapshot.editorias.find((item) => item.id === activeContent.editoriaId && item.isVisibleInNavigation)
    : undefined;

  const activePrimary =
    primaryItems.find((item) => item.to !== "/" && pathname.startsWith(item.to)) ??
    (pathname === "/" ? primaryItems.find((item) => item.key === "home") : undefined) ??
    (editoriaFromContent ? primaryItems.find((item) => item.key === `editoria:${editoriaFromContent.slug}`) : undefined);

  const activeEditoria =
    (activePrimary?.kind === "editoria" && snapshot.editorias.find((item) => item.slug === activePrimary.slug)) ??
    editoriaFromContent;

  return {
    activePrimaryKey: activePrimary?.key,
    activeSubnavLabel: activeEditoria?.name,
    contextualLinks: activeEditoria ? getEditoriaContextLinks(activeEditoria.slug, snapshot) : [],
  };
}

export function getHomeZoneConfigs(snapshot = getEditorialSnapshot()): HomeZoneConfigRecord[] {
  return snapshot.homeZoneConfigs;
}

export function getHomeZoneConfigByKey(key: HomeZoneKey, snapshot = getEditorialSnapshot()): HomeZoneConfigRecord | undefined {
  return snapshot.homeZoneConfigs.find((zone) => zone.key === key);
}

export function getContentPageBySlug(slug: string, snapshot = getEditorialSnapshot()): PublicContentPageVM | null {
  const { contentById, authorById, seoById, mediaById } = getIndexes(snapshot);
  const content = snapshot.contents.find((item) => item.slug === slug);
  if (!content) return null;

  const author = authorById.get(content.authorId);
  const seoEntry = seoById.get(content.id);
  const mediaEntry = mediaById.get(content.id);
  const related = content.relatedContentIds
    .map((id) => contentById.get(id))
    .filter((item): item is ContentRecord => Boolean(item))
    .map((item) => getPublicCardByContent(item, snapshot));

  return {
    content: {
      ...getPublicCardByContent(content, snapshot),
      subtitle: content.subtitle,
      lead: content.lead,
      body: content.body,
      caption: mediaEntry?.caption,
      credit: mediaEntry?.credit,
      tags: content.tags,
      seo: seoEntry ?? { contentId: content.id, noindex: false },
    },
    author: author ?? {
      id: "redacao",
      name: "Redação Veredito",
      publicName: "Redação Veredito",
      role: "Redação",
      email: "redacao@veredito.com.br",
      shortBio: "Equipe editorial do Veredito.",
      slug: "redacao",
      type: "internal",
      isPublicPageEnabled: false,
    },
    related,
  };
}

export function getAuthorPageBySlug(slug: string, snapshot = getEditorialSnapshot()): PublicAuthorPageVM | null {
  const author = snapshot.authors.find((item) => item.slug === slug && item.isPublicPageEnabled);
  if (!author) return null;

  const contents = getPublishedContents(snapshot)
    .filter((item) => item.authorId === author.id)
    .sort(byPublishedDateDesc)
    .map((item) => getPublicCardByContent(item, snapshot));

  return { author, contents };
}

export function getSourceOperationalRows(snapshot = getEditorialSnapshot()) {
  const { editoriaById } = getIndexes(snapshot);
  return snapshot.sources
    .map((source) => {
      const linkedContents = snapshot.contents.filter((item) => item.sourceId === source.id);
      const latestLinked = [...linkedContents].sort(byPublishedDateDesc)[0];
      const defaultEditoria = source.defaultEditoriaId ? editoriaById.get(source.defaultEditoriaId) : undefined;
      return {
        id: source.id,
        name: source.name,
        shortName: source.shortName,
        monitoringEnabled: source.monitoringEnabled,
        priority: source.priority,
        reliability: source.reliability ?? "medium",
        origin: source.origin ?? "manual",
        defaultEditoriaName: defaultEditoria?.name ?? "—",
        linkedContentCount: linkedContents.length,
        latestLinkedTitle: latestLinked?.title ?? "Sem conteúdo recente",
        monitoredTags: source.monitoredTags ?? [],
      };
    })
    .sort((a, b) => b.linkedContentCount - a.linkedContentCount || a.name.localeCompare(b.name));
}


export function getCardsByType(type: PublicContentCardVM["type"], snapshot = getEditorialSnapshot()): PublicContentCardVM[] {
  return getPublishedContents(snapshot)
    .filter((content) => content.type === type)
    .sort(byPublishedDateDesc)
    .map((item) => getPublicCardByContent(item, snapshot));
}

export function getCardsByEditoriaSlug(slug?: string, snapshot = getEditorialSnapshot()): PublicContentCardVM[] {
  const editoria = snapshot.editorias.find((item) => item.slug === slug);
  const editoriaId = editoria?.id;
  return getPublishedContents(snapshot)
    .filter((content) => !editoriaId || content.editoriaId === editoriaId)
    .sort(byPublishedDateDesc)
    .map((item) => getPublicCardByContent(item, snapshot));
}

export function getHomeZones(snapshot = getEditorialSnapshot()): HomeZoneVM[] {
  return snapshot.homeZoneConfigs.map((config) => {
    const resolution = resolveZoneItems(config, snapshot);
    return {
      key: config.key,
      title: config.title,
      mode: config.mode,
      maxItems: config.maxItems,
      items: resolution.items.map((item) => item.card),
    };
  });
}

export function getHomeZoneCandidates(key: HomeZoneKey, snapshot = getEditorialSnapshot()): PublicContentCardVM[] {
  const config = getHomeZoneConfigByKey(key, snapshot);
  if (!config || config.key === "urgent_bar" || config.key === "editorias" || config.key === "newsletter") {
    return [];
  }

  return getPublishedContents(snapshot)
    .filter((item) => isAllowedInZone(item, config, snapshot))
    .sort((a, b) => compareContents(a, b, config, snapshot))
    .map((item) => getPublicCardByContent(item, snapshot));
}

export function getHomeZoneInspection(snapshot = getEditorialSnapshot()): HomeZoneInspectionVM[] {
  return snapshot.homeZoneConfigs.map((config) => {
    const resolution = resolveZoneItems(config, snapshot);
    return {
      key: config.key,
      title: config.title,
      mode: config.mode,
      maxItems: config.maxItems,
      items: resolution.items.map((item, index) => ({
        id: item.card.id,
        title: item.card.title,
        editoriaName: item.card.editoriaName,
        type: item.card.type,
        publishedLabel: item.card.publishedLabel,
        priority: item.priority,
        origin: item.origin,
        position: index + 1,
      })),
    };
  });
}

export function getHomeZonePerformance(snapshot = getEditorialSnapshot()) {
  const performanceById = new Map(snapshot.contentPerformance.map((item) => [item.contentId, item]));
  return getHomeZoneInspection(snapshot).map((zone) => {
    const totals = zone.items.reduce(
      (acc, item) => {
        const perf = performanceById.get(item.id);
        acc.views24h += perf?.views24h ?? 0;
        acc.homeClicks += perf?.homeClicks ?? 0;
        acc.homeImpressions += perf?.homeImpressions ?? 0;
        return acc;
      },
      { views24h: 0, homeClicks: 0, homeImpressions: 0 }
    );
    return {
      key: zone.key,
      views24h: totals.views24h,
      homeCtr: totals.homeImpressions ? Math.round((totals.homeClicks / totals.homeImpressions) * 1000) / 10 : 0,
    };
  });
}

export function getUrgentPerformance(snapshot = getEditorialSnapshot()) {
  const performanceById = new Map(snapshot.contentPerformance.map((item) => [item.contentId, item]));
  const urgent = getUrgentCards("2026-03-24T16:00:00Z", snapshot);
  return urgent.map((item) => ({
    id: item.id,
    title: item.title,
    views24h: performanceById.get(item.id)?.views24h ?? 0,
    clicks: performanceById.get(item.id)?.homeClicks ?? 0,
  }));
}

export function getUrgentCards(nowIso = "2026-03-24T16:00:00Z", snapshot = getEditorialSnapshot()): PublicContentCardVM[] {
  const { exposureById } = getIndexes(snapshot);
  const now = new Date(nowIso).getTime();
  return getPublishedContents(snapshot)
    .filter((content) => {
      const exposure = exposureById.get(content.id);
      if (!exposure?.isUrgent) return false;
      const startsAt = exposure.urgentStartsAt ? new Date(exposure.urgentStartsAt).getTime() : 0;
      const expiresAt = exposure.urgentExpiresAt ? new Date(exposure.urgentExpiresAt).getTime() : Number.POSITIVE_INFINITY;
      return startsAt <= now && now <= expiresAt;
    })
    .sort((a, b) => (exposureById.get(a.id)?.urgentPriority ?? 999) - (exposureById.get(b.id)?.urgentPriority ?? 999))
    .map((item) => getPublicCardByContent(item, snapshot));
}

export function getMostReadCards(snapshot = getEditorialSnapshot()): PublicContentCardVM[] {
  const { contentById } = getIndexes(snapshot);
  return ["stf-icms-transferencia", "nova-lei-recuperacao", "cnj-ia-judiciario", "reforma-tributaria-contratos", "stj-itbi"]
    .map((id) => contentById.get(id))
    .filter((item): item is ContentRecord => Boolean(item))
    .map((item) => getPublicCardByContent(item, snapshot));
}

export function getAdminContentRows(snapshot = getEditorialSnapshot()) {
  const { exposureById, authorById, editoriaById, sourceById, seoById, mediaById } = getIndexes(snapshot);
  return snapshot.contents
    .map((content) => {
      const exposure = exposureById.get(content.id);
      const author = authorById.get(content.authorId);
      const editoria = editoriaById.get(content.editoriaId);
      const source = content.sourceId ? sourceById.get(content.sourceId) : undefined;
      const seoEntry = seoById.get(content.id);
      const mediaEntry = mediaById.get(content.id);
      const checklist = getWorkflowChecklist(content.id, snapshot);
      return {
        id: content.id,
        title: content.title,
        type: translateType(content.type),
        editoria: editoria?.name ?? content.editoriaId,
        author: author?.name ?? "Redação Veredito",
        source: source?.shortName ?? "—",
        status: translateStatus(content.status),
        statusKey: content.status,
        updatedAt: content.updatedAt,
        publishedAt: content.publishedAt,
        scheduledAt: content.scheduledAt,
        isUrgent: exposure?.isUrgent ?? false,
        isHome: exposure?.homeVisibility ?? false,
        isNewsletter: exposure?.isNewsletterFeatured ?? false,
        hasImage: Boolean(mediaEntry?.coverImageId),
        hasSeo: Boolean(seoEntry?.seoTitle && seoEntry?.seoDescription),
        checklistProgress: `${checklist.filter((item) => item.checked).length}/${checklist.length}`,
        hasWorkflowComments: snapshot.workflowComments.some((item) => item.contentId === content.id),
      };
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getWorkflowChecklist(contentId: string, snapshot = getEditorialSnapshot()): WorkflowChecklistItemRecord[] {
  const content = snapshot.contents.find((item) => item.id === contentId);
  const exposure = snapshot.exposures.find((item) => item.contentId === contentId);
  const seoEntry = snapshot.seo.find((item) => item.contentId === contentId);
  const mediaEntry = snapshot.media.find((item) => item.contentId === contentId);

  if (!content) return [];

  return [
    { key: "title", label: "Título preenchido", checked: Boolean(content.title.trim()), required: true },
    { key: "slug", label: "Slug preenchido", checked: Boolean(content.slug.trim()), required: true },
    { key: "coverImage", label: "Imagem de capa", checked: Boolean(mediaEntry?.coverImageId), required: true },
    { key: "altText", label: "Alt text", checked: Boolean(mediaEntry?.altText?.trim()), required: true },
    { key: "imageCredit", label: "Crédito de imagem", checked: Boolean(mediaEntry?.credit?.trim()), required: true },
    { key: "seo", label: "SEO mínimo", checked: Boolean(seoEntry?.seoTitle && seoEntry?.seoDescription), required: true },
    { key: "editoria", label: "Editoria", checked: Boolean(content.editoriaId), required: true },
    { key: "author", label: "Autor", checked: Boolean(content.authorId), required: true },
    { key: "review", label: "Passou por revisão", checked: ["approved", "scheduled", "published"].includes(content.status), required: true },
    { key: "source", label: "Fonte preenchida quando aplicável", checked: content.type === "opinion" || Boolean(content.sourceId || exposure?.isUrgent), required: false },
  ];
}

export function getAvailableWorkflowTransitions(contentId: string, snapshot = getEditorialSnapshot()): ContentStatus[] {
  const content = snapshot.contents.find((item) => item.id === contentId);
  if (!content) return [];

  const map: Record<ContentStatus, ContentStatus[]> = {
    draft: ["in_review", "archived"],
    in_review: ["draft", "legal_review", "approved"],
    legal_review: ["draft", "approved"],
    approved: ["scheduled", "published", "draft"],
    scheduled: ["published", "draft", "archived"],
    published: ["archived", "draft"],
    archived: ["draft"],
  };

  return map[content.status];
}

export function getWorkflowTransitionIssues(
  contentId: string,
  toStatus: ContentStatus,
  snapshot = getEditorialSnapshot()
): string[] {
  const content = snapshot.contents.find((item) => item.id === contentId);
  const decisionMeta = snapshot.decisionMeta.find((item) => item.contentId === contentId);
  const checklist = getWorkflowChecklist(contentId, snapshot);

  if (!content) return ["Conteúdo não encontrado."];

  const requiredPending = checklist.filter((item) => item.required && !item.checked);
  const issues: string[] = [];
  const allowedTransitions = getAvailableWorkflowTransitions(contentId, snapshot);

  if (toStatus !== content.status && !allowedTransitions.includes(toStatus)) {
    issues.push("Transição de status não permitida a partir do estado atual.");
  }

  if (toStatus === "scheduled" && !content.scheduledAt) {
    issues.push("Defina uma data de agendamento antes de agendar.");
  }

  if (["approved", "scheduled", "published"].includes(toStatus) && requiredPending.length > 0) {
    issues.push(`Checklist incompleto: ${requiredPending.map((item) => item.label).join(", ")}.`);
  }

  if ((toStatus === "scheduled" || toStatus === "published") && content.type === "decision") {
    if (!decisionMeta?.court || !decisionMeta?.caseNumber || !decisionMeta?.judgmentDate || !decisionMeta?.decisionType) {
      issues.push("Decisão exige tribunal, tipo de decisão, processo e data do julgamento.");
    }
  }

  if ((toStatus === "scheduled" || toStatus === "published") && content.type === "decision" && !["legal_review", "approved", "scheduled", "published"].includes(content.status)) {
    issues.push("Decisões devem passar por revisão jurídica ou aprovação antes de seguir para agenda/publicação.");
  }

  return issues;
}

export function getDashboardUrgentSummary(nowIso = "2026-03-24T16:00:00Z", snapshot = getEditorialSnapshot()) {
  const { exposureById } = getIndexes(snapshot);
  const now = new Date(nowIso).getTime();
  const urgentRows = getPublishedContents(snapshot)
    .map((content) => ({ content, exposure: exposureById.get(content.id) }))
    .filter(({ exposure }) => exposure?.isUrgent);

  return {
    active: urgentRows.filter(({ exposure }) => isWithinRange(now, exposure?.urgentStartsAt, exposure?.urgentExpiresAt)).length,
    expiringToday: urgentRows.filter(({ exposure }) => {
      if (!exposure?.urgentExpiresAt) return false;
      const expires = new Date(exposure.urgentExpiresAt);
      const current = new Date(nowIso);
      return expires.getUTCDate() === current.getUTCDate() && expires.getUTCMonth() === current.getUTCMonth();
    }).length,
    expired: urgentRows.filter(({ exposure }) => exposure?.urgentExpiresAt && new Date(exposure.urgentExpiresAt).getTime() < now).length,
  };
}

function resolveZoneItems(config: HomeZoneConfigRecord, snapshot = getEditorialSnapshot()): { items: ResolvedZoneItem[] } {
  if (config.key === "urgent_bar") {
    return {
      items: getUrgentCards("2026-03-24T16:00:00Z", snapshot)
        .slice(0, config.maxItems)
        .map((card) => {
          const content = snapshot.contents.find((item) => item.id === card.id);
          return {
            card,
            origin: "automatic" as HomeZoneItemOrigin,
            priority: content?.editorialPriority ?? "medium",
          };
        }),
    };
  }

  const { contentById } = getIndexes(snapshot);
  const pinned = config.pinnedContentIds
    .filter((id) => {
      const expiresAt = config.pinExpiresAtByContentId?.[id];
      return !expiresAt || new Date(expiresAt).getTime() >= new Date("2026-03-24T16:00:00Z").getTime();
    })
    .map((id) => contentById.get(id))
    .filter((item): item is ContentRecord => Boolean(item))
    .filter((item) => isAllowedInZone(item, config, snapshot))
    .map((item) => ({
      card: getPublicCardByContent(item, snapshot),
      origin: "manual" as HomeZoneItemOrigin,
      priority: item.editorialPriority,
    }));

  const automatic = getPublishedContents(snapshot)
    .filter((item) => isAllowedInZone(item, config, snapshot))
    .sort((a, b) => compareContents(a, b, config, snapshot))
    .map((item) => ({
      card: getPublicCardByContent(item, snapshot),
      origin: "automatic" as HomeZoneItemOrigin,
      priority: item.editorialPriority,
    }));

  const relaxedAutomatic = getPublishedContents(snapshot)
    .filter((item) => isAllowedInZone(item, { ...config, requireHomeEligibility: false, dateWindowDays: undefined }, snapshot))
    .sort((a, b) => compareContents(a, b, config, snapshot))
    .map((item) => ({
      card: getPublicCardByContent(item, snapshot),
      origin: "fallback" as HomeZoneItemOrigin,
      priority: item.editorialPriority,
    }));

  if (config.mode === "automatic") {
    const base = automatic.slice(0, config.maxItems);
    return config.fallbackToAutomatic ? { items: mergeZoneItems(base, relaxedAutomatic, config.maxItems) } : { items: base };
  }

  if (config.mode === "manual") {
    if (!config.fallbackToAutomatic) {
      return { items: pinned.slice(0, config.maxItems) };
    }

    return {
      items: mergeZoneItems(pinned, automatic.map((item) => ({ ...item, origin: "fallback" as HomeZoneItemOrigin })), config.maxItems),
    };
  }

  return { items: mergeZoneItems(pinned, automatic, config.maxItems) };
}

function isAllowedInZone(content: ContentRecord, config: HomeZoneConfigRecord, snapshot = getEditorialSnapshot()) {
  const exposure = snapshot.exposures.find((item) => item.contentId === content.id);
  const editoria = snapshot.editorias.find((item) => item.id === content.editoriaId);
  const typeAllowed = config.allowedTypes.length === 0 || config.allowedTypes.includes(content.type);
  const typeExcluded = config.excludedTypes?.includes(content.type) ?? false;
  const editoriaAllowed = !config.allowedEditorias?.length || (editoria ? config.allowedEditorias.includes(editoria.slug) : false);
  const priorityAllowed = !config.allowedPriorities?.length || config.allowedPriorities.includes(content.editorialPriority);
  const statusAllowed = !config.allowedStatuses?.length || config.allowedStatuses.includes(content.status);
  const withinWindow = !config.dateWindowDays || isWithinDateWindow(content.publishedAt ?? content.updatedAt, config.dateWindowDays);
  const exposureEligible = !config.requireHomeEligibility || Boolean(exposure?.homeVisibility || exposure?.isHomeFeatured);
  const exposureOpen = !exposure?.exposureEndsAt || new Date(exposure.exposureEndsAt).getTime() >= new Date("2026-03-24T16:00:00Z").getTime();
  return typeAllowed && !typeExcluded && editoriaAllowed && priorityAllowed && statusAllowed && withinWindow && exposureEligible && exposureOpen;
}

function isWithinRange(now: number, start?: string, end?: string) {
  const startsAt = start ? new Date(start).getTime() : 0;
  const expiresAt = end ? new Date(end).getTime() : Number.POSITIVE_INFINITY;
  return startsAt <= now && now <= expiresAt;
}

function compareContents(
  a: ContentRecord,
  b: ContentRecord,
  config: Pick<HomeZoneConfigRecord, "sort" | "preferHighImpactDecisions">,
  snapshot: EditorialSnapshot
) {
  if (config.preferHighImpactDecisions) {
    const impactDiff = getDecisionImpactRank(b, snapshot) - getDecisionImpactRank(a, snapshot);
    if (impactDiff !== 0) return impactDiff;
  }

  if (config.sort === "priority_desc") {
    const diff = priorityRank(b.editorialPriority) - priorityRank(a.editorialPriority);
    if (diff !== 0) return diff;
  }
  return byPublishedDateDesc(a, b);
}

function getDecisionImpactRank(content: ContentRecord, snapshot: EditorialSnapshot) {
  const decision = snapshot.decisionMeta.find((item) => item.contentId === content.id);
  const map = { low: 1, medium: 2, high: 3 } as const;
  return decision?.practicalImpact ? map[decision.practicalImpact] : 0;
}

function mergeZoneItems(
  pinned: ResolvedZoneItem[],
  automatic: ResolvedZoneItem[],
  maxItems: number
) {
  const merged = [...pinned];
  for (const item of automatic) {
    if (merged.some((existing) => existing.card.id === item.card.id)) continue;
    merged.push(item);
    if (merged.length >= maxItems) break;
  }
  return merged.slice(0, maxItems);
}

function isWithinDateWindow(value: string | undefined, days: number) {
  if (!value) return false;
  const current = new Date("2026-03-24T16:00:00Z").getTime();
  const target = new Date(value).getTime();
  return current - target <= days * 24 * 60 * 60 * 1000;
}

function getEditoriaContextLinks(slug: string, snapshot: EditorialSnapshot) {
  const editoria = snapshot.editorias.find((item) => item.slug === slug);
  if (!editoria) return [];

  const items = getPublishedContents(snapshot).filter((item) => item.editoriaId === editoria.id);
  const latestNews = items.find((item) => item.type === "news");
  const latestDecision = items.find((item) => item.type === "decision");
  const latestArticle = items.find((item) => item.type === "article");
  const latestOpinion = items.find((item) => item.type === "opinion");

  return [
    { label: "Visão geral", to: `/editoria/${slug}` },
    latestNews ? { label: "Notícia em destaque", to: `/${getTypeBase(latestNews.type)}/${latestNews.slug}` } : null,
    latestDecision ? { label: "Decisão recente", to: `/${getTypeBase(latestDecision.type)}/${latestDecision.slug}` } : null,
    latestArticle ? { label: "Artigo em destaque", to: `/${getTypeBase(latestArticle.type)}/${latestArticle.slug}` } : null,
    latestOpinion ? { label: "Opinião em foco", to: `/${getTypeBase(latestOpinion.type)}/${latestOpinion.slug}` } : null,
  ].filter(Boolean);
}

function getContentByPathname(pathname: string, snapshot: EditorialSnapshot) {
  const match = pathname.match(/^\/(noticias|decisoes|artigos|opiniao)\/([^/]+)$/);
  if (!match) return null;
  const [, , slug] = match;
  return snapshot.contents.find((item) => item.slug === slug) ?? null;
}

function getTypeBase(type: ContentRecord["type"]) {
  const map = {
    news: "noticias",
    decision: "decisoes",
    article: "artigos",
    opinion: "opiniao",
  } as const;
  return map[type];
}
