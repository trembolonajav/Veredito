import { useSyncExternalStore } from "react";
import { adminUsers, authors, contentPerformance, contents, decisionMeta, editorias, exposures, homeZoneConfigs, media, newsletterEditions, rolePermissions, seo, siteConfig, sources, workflowComments, workflowEvents } from "./mockData";
import type {
  AdminUserRecord,
  AuthorRecord,
  ContentPerformanceRecord,
  ContentDecisionMetaRecord,
  ContentExposureRecord,
  ContentMediaRecord,
  ContentRecord,
  ContentSeoRecord,
  ContentStatus,
  EditoriaRecord,
  HomeZoneConfigRecord,
  NewsletterEditionRecord,
  RolePermissionRecord,
  SiteConfigRecord,
  SourceRecord,
  WorkflowCommentRecord,
  WorkflowEventRecord,
} from "./types";

export type EditorialSnapshot = {
  contents: ContentRecord[];
  exposures: ContentExposureRecord[];
  seo: ContentSeoRecord[];
  media: ContentMediaRecord[];
  decisionMeta: ContentDecisionMetaRecord[];
  authors: AuthorRecord[];
  editorias: EditoriaRecord[];
  sources: SourceRecord[];
  siteConfig: SiteConfigRecord;
  rolePermissions: RolePermissionRecord[];
  adminUsers: AdminUserRecord[];
  contentPerformance: ContentPerformanceRecord[];
  newsletterEditions: NewsletterEditionRecord[];
  homeZoneConfigs: HomeZoneConfigRecord[];
  workflowComments: WorkflowCommentRecord[];
  workflowEvents: WorkflowEventRecord[];
};

type ContentUpsertInput = {
  originalId?: string;
  content: ContentRecord;
  exposure: ContentExposureRecord;
  seo: ContentSeoRecord;
  media: ContentMediaRecord;
  decisionMeta?: ContentDecisionMetaRecord | null;
};

let snapshot: EditorialSnapshot = {
  contents: structuredClone(contents),
  exposures: structuredClone(exposures),
  seo: structuredClone(seo),
  media: structuredClone(media),
  decisionMeta: structuredClone(decisionMeta),
  authors: structuredClone(authors),
  editorias: structuredClone(editorias),
  sources: structuredClone(sources),
  siteConfig: structuredClone(siteConfig),
  rolePermissions: structuredClone(rolePermissions),
  adminUsers: structuredClone(adminUsers),
  contentPerformance: structuredClone(contentPerformance),
  newsletterEditions: structuredClone(newsletterEditions),
  homeZoneConfigs: structuredClone(homeZoneConfigs),
  workflowComments: structuredClone(workflowComments),
  workflowEvents: structuredClone(workflowEvents),
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeEditorialStore(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getEditorialSnapshot() {
  return snapshot;
}

export function useEditorialSnapshot() {
  return useSyncExternalStore(subscribeEditorialStore, getEditorialSnapshot, getEditorialSnapshot);
}

export function upsertEditorialContent(input: ContentUpsertInput) {
  const targetId = input.originalId ?? input.content.id;

  snapshot = {
    ...snapshot,
    contents: upsertById(snapshot.contents, targetId, input.content),
    exposures: upsertByKey(snapshot.exposures, "contentId", targetId, input.exposure),
    seo: upsertByKey(snapshot.seo, "contentId", targetId, input.seo),
    media: upsertByKey(snapshot.media, "contentId", targetId, input.media),
    decisionMeta: input.decisionMeta
      ? upsertByKey(snapshot.decisionMeta, "contentId", targetId, input.decisionMeta)
      : snapshot.decisionMeta.filter((item) => item.contentId !== targetId),
  };
  emit();
}

export function addWorkflowComment(contentId: string, body: string, authorName = "Redação Veredito") {
  const comment = {
    id: `comment-${contentId}-${Date.now()}`,
    contentId,
    authorName,
    body,
    createdAt: new Date().toISOString(),
  };

  snapshot = {
    ...snapshot,
    workflowComments: [comment, ...snapshot.workflowComments],
  };
  emit();
}

export function transitionWorkflowStatus(contentId: string, toStatus: ContentStatus, actorName = "Redação Veredito", note?: string, fromStatusOverride?: ContentStatus) {
  const current = snapshot.contents.find((item) => item.id === contentId);
  if (!current) return;
  const now = new Date().toISOString();

  snapshot = {
    ...snapshot,
    contents: snapshot.contents.map((item) =>
      item.id === contentId
        ? {
            ...item,
            status: toStatus,
            publishedAt: toStatus === "published" ? item.publishedAt ?? now : item.publishedAt,
            scheduledAt: toStatus === "scheduled" ? item.scheduledAt ?? now : item.scheduledAt,
            archivedAt: toStatus === "archived" ? now : item.archivedAt,
            updatedAt: now,
          }
        : item
    ),
    exposures: snapshot.exposures.map((item) =>
      item.contentId === contentId
        ? {
            ...item,
            isPublished: toStatus === "published",
            isArchivedPublicly: toStatus === "archived",
          }
        : item
    ),
    workflowEvents: [
      {
        id: `event-${contentId}-${Date.now()}`,
        contentId,
        fromStatus: fromStatusOverride ?? current.status,
        toStatus,
        actorName,
        createdAt: now,
        note,
      },
      ...snapshot.workflowEvents,
    ],
  };
  emit();
}

export function applyBulkEditorialAction(ids: string[], action: "approve" | "publish" | "archive" | "toggle_home" | "toggle_urgent" | "change_editoria", editoriaName?: string) {
  const now = new Date().toISOString();
  const editoria = editoriaName ? snapshot.editorias.find((item) => item.name === editoriaName) : undefined;

  snapshot = {
    ...snapshot,
    contents: snapshot.contents.map((item) => {
      if (!ids.includes(item.id)) return item;
      if (action === "approve") return { ...item, status: "approved", updatedAt: now };
      if (action === "publish") return { ...item, status: "published", publishedAt: item.publishedAt ?? now, updatedAt: now };
      if (action === "archive") return { ...item, status: "archived", archivedAt: now, updatedAt: now };
      if (action === "change_editoria" && editoria) return { ...item, editoriaId: editoria.id, updatedAt: now };
      return item;
    }),
    exposures: snapshot.exposures.map((item) => {
      if (!ids.includes(item.contentId)) return item;
      if (action === "toggle_home") return { ...item, homeVisibility: !item.homeVisibility, isHomeFeatured: !item.isHomeFeatured };
      if (action === "toggle_urgent") {
        const nextUrgent = !item.isUrgent;
        return {
          ...item,
          isUrgent: nextUrgent,
          urgentTitle: nextUrgent ? item.urgentTitle ?? "Urgente editorial" : undefined,
          urgentStartsAt: nextUrgent ? item.urgentStartsAt ?? now : undefined,
          urgentExpiresAt: nextUrgent ? item.urgentExpiresAt ?? now : undefined,
        };
      }
      return item;
    }),
  };
  emit();
}

export function getEditorialContentById(id: string) {
  return {
    content: snapshot.contents.find((item) => item.id === id),
    exposure: snapshot.exposures.find((item) => item.contentId === id),
    seo: snapshot.seo.find((item) => item.contentId === id),
    media: snapshot.media.find((item) => item.contentId === id),
    decisionMeta: snapshot.decisionMeta.find((item) => item.contentId === id),
    workflowComments: snapshot.workflowComments.filter((item) => item.contentId === id),
    workflowEvents: snapshot.workflowEvents.filter((item) => item.contentId === id),
  };
}

export function updateHomeZoneConfig(
  key: HomeZoneConfigRecord["key"],
  updates: Partial<HomeZoneConfigRecord>
) {
  snapshot = {
    ...snapshot,
    homeZoneConfigs: snapshot.homeZoneConfigs.map((zone) =>
      zone.key === key
        ? {
            ...zone,
            ...updates,
            pinnedContentIds: (updates.maxItems ? zone.pinnedContentIds.slice(0, updates.maxItems) : zone.pinnedContentIds),
          }
        : zone
    ),
  };
  emit();
}

export function pinContentToHomeZone(
  key: HomeZoneConfigRecord["key"],
  contentId: string,
  expiresAt?: string
) {
  snapshot = {
    ...snapshot,
    homeZoneConfigs: snapshot.homeZoneConfigs.map((zone) => {
      if (zone.key !== key) return zone;
      const pinnedContentIds = zone.pinnedContentIds.includes(contentId)
        ? zone.pinnedContentIds
        : [...zone.pinnedContentIds, contentId];
      return {
        ...zone,
        pinnedContentIds: pinnedContentIds.slice(0, zone.maxItems),
        pinExpiresAtByContentId: expiresAt
          ? { ...(zone.pinExpiresAtByContentId ?? {}), [contentId]: expiresAt }
          : zone.pinExpiresAtByContentId,
      };
    }),
  };
  emit();
}

export function unpinContentFromHomeZone(
  key: HomeZoneConfigRecord["key"],
  contentId: string
) {
  snapshot = {
    ...snapshot,
    homeZoneConfigs: snapshot.homeZoneConfigs.map((zone) =>
      zone.key === key
        ? {
            ...zone,
            pinnedContentIds: zone.pinnedContentIds.filter((id) => id !== contentId),
            pinExpiresAtByContentId: Object.fromEntries(
              Object.entries(zone.pinExpiresAtByContentId ?? {}).filter(([id]) => id !== contentId)
            ),
          }
        : zone
    ),
  };
  emit();
}

export function movePinnedContentInHomeZone(
  key: HomeZoneConfigRecord["key"],
  contentId: string,
  direction: "up" | "down"
) {
  snapshot = {
    ...snapshot,
    homeZoneConfigs: snapshot.homeZoneConfigs.map((zone) => {
      if (zone.key !== key) return zone;
      const currentIndex = zone.pinnedContentIds.indexOf(contentId);
      if (currentIndex === -1) return zone;
      const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (nextIndex < 0 || nextIndex >= zone.pinnedContentIds.length) return zone;

      const pinnedContentIds = [...zone.pinnedContentIds];
      [pinnedContentIds[currentIndex], pinnedContentIds[nextIndex]] = [pinnedContentIds[nextIndex], pinnedContentIds[currentIndex]];
      return { ...zone, pinnedContentIds };
    }),
  };
  emit();
}

export function upsertEditoria(nextItem: EditoriaRecord) {
  snapshot = {
    ...snapshot,
    editorias: upsertById(snapshot.editorias, nextItem.id, nextItem),
  };
  emit();
}

export function upsertAuthor(nextItem: AuthorRecord) {
  snapshot = {
    ...snapshot,
    authors: upsertById(snapshot.authors, nextItem.id, nextItem),
  };
  emit();
}

export function upsertSource(nextItem: SourceRecord) {
  snapshot = {
    ...snapshot,
    sources: upsertById(snapshot.sources, nextItem.id, nextItem),
  };
  emit();
}

export function updateSiteConfig(updates: Partial<SiteConfigRecord>) {
  snapshot = {
    ...snapshot,
    siteConfig: { ...snapshot.siteConfig, ...updates },
  };
  emit();
}

export function updateRolePermissions(role: string, permissions: string[]) {
  snapshot = {
    ...snapshot,
    rolePermissions: upsertByKey(snapshot.rolePermissions, "role", role, { role, permissions }),
  };
  emit();
}

export function upsertAdminUser(nextItem: AdminUserRecord) {
  snapshot = {
    ...snapshot,
    adminUsers: upsertById(snapshot.adminUsers, nextItem.id, nextItem),
  };
  emit();
}

export function upsertNewsletterEdition(nextItem: NewsletterEditionRecord) {
  snapshot = {
    ...snapshot,
    newsletterEditions: upsertById(snapshot.newsletterEditions, nextItem.id, nextItem),
  };
  emit();
}

function upsertById<T extends { id: string }>(items: T[], originalId: string, nextItem: T) {
  const exists = items.some((item) => item.id === originalId);
  if (exists) return items.map((item) => (item.id === originalId ? nextItem : item));
  return [nextItem, ...items];
}

function upsertByKey<T, K extends keyof T>(items: T[], key: K, originalValue: T[K], nextItem: T) {
  const exists = items.some((item) => item[key] === originalValue);
  if (exists) return items.map((item) => (item[key] === originalValue ? nextItem : item));
  return [nextItem, ...items];
}
