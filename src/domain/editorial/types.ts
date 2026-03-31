export type ContentType = "news" | "decision" | "article" | "opinion";

export type ContentStatus =
  | "draft"
  | "in_review"
  | "legal_review"
  | "approved"
  | "scheduled"
  | "published"
  | "archived";

export type WorkflowChecklistKey =
  | "title"
  | "slug"
  | "coverImage"
  | "altText"
  | "imageCredit"
  | "seo"
  | "editoria"
  | "author"
  | "review"
  | "source";

export type EditorialPriority = "low" | "medium" | "high" | "critical";

export type HomeSlotType =
  | "headline"
  | "secondary"
  | "list"
  | "decision"
  | "article"
  | "opinion"
  | "none";

export type HomeZoneKey =
  | "urgent_bar"
  | "headline"
  | "secondary_highlights"
  | "latest_news"
  | "recent_decisions"
  | "articles_analysis"
  | "opinion"
  | "editorias"
  | "newsletter";

export type HomeZoneMode = "manual" | "automatic" | "hybrid";
export type HomeZoneItemOrigin = "manual" | "automatic" | "fallback";
export type HomeZoneSort = "published_desc" | "priority_desc";

export type ContentRecord = {
  id: string;
  type: ContentType;
  title: string;
  subtitle?: string;
  lead?: string;
  summaryCard?: string;
  body: string;
  slug: string;
  status: ContentStatus;
  editorialPriority: EditorialPriority;
  editoriaId: string;
  authorId: string;
  sourceId?: string;
  featuredImageId?: string;
  publishedAt?: string;
  scheduledAt?: string;
  updatedAt: string;
  archivedAt?: string;
  readingTime?: number;
  tags: string[];
  relatedContentIds: string[];
};

export type ContentExposureRecord = {
  contentId: string;
  isPublished: boolean;
  isHomeFeatured: boolean;
  homeVisibility: boolean;
  homeSlotType: HomeSlotType;
  homeZone?: string;
  homeOrder?: number;
  exposureEndsAt?: string;
  isUrgent: boolean;
  urgentTitle?: string;
  urgentStartsAt?: string;
  urgentExpiresAt?: string;
  urgentPriority?: number;
  isNewsletterFeatured: boolean;
  isArchivedPublicly: boolean;
};

export type ContentSeoRecord = {
  contentId: string;
  seoTitle?: string;
  seoDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
  noindex: boolean;
};

export type ContentMediaRecord = {
  contentId: string;
  coverImageId?: string;
  socialImageId?: string;
  caption?: string;
  credit?: string;
  altText?: string;
  focalPointX?: number;
  focalPointY?: number;
};

export type ContentDecisionMetaRecord = {
  contentId: string;
  court: string;
  decisionType: string;
  rapporteur: string;
  caseNumber: string;
  judgmentDate: string;
  thesis?: string;
  syllabus?: string;
  practicalImpact?: "low" | "medium" | "high";
  officialUrl?: string;
  affectedTheme?: string;
};

export type AuthorRecord = {
  id: string;
  name: string;
  publicName: string;
  role: string;
  email: string;
  shortBio: string;
  longBio?: string;
  slug: string;
  specialty?: string;
  jobTitle?: string;
  avatarImageId?: string;
  socialLinkedin?: string;
  socialX?: string;
  type: "internal" | "external" | "columnist";
  isPublicPageEnabled: boolean;
};

export type EditoriaRecord = {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  seoDescription?: string;
  menuOrder: number;
  isVisibleInNavigation: boolean;
  isFeaturedOnHome: boolean;
  defaultImageId?: string;
  editorResponsible?: string;
};

export type SourceRecord = {
  id: string;
  name: string;
  shortName: string;
  type: string;
  officialUrl?: string;
  defaultEditoriaId?: string;
  monitoringEnabled: boolean;
  priority: "low" | "medium" | "high";
  monitoredTags?: string[];
  internalOwner?: string;
  reliability?: "low" | "medium" | "high";
  origin?: "manual" | "rss" | "api" | "clipping";
};

export type SiteConfigRecord = {
  siteName: string;
  siteDescription: string;
  seoTitleDefault: string;
  seoDescriptionDefault: string;
  newsletterLabel: string;
  analyticsId?: string;
  editorialAlertsEmail?: string;
  currentAdminUserId?: string;
  homeNewsletterEnabled?: boolean;
};

export type RolePermissionRecord = {
  role: string;
  permissions: string[];
};

export type ContentPerformanceRecord = {
  contentId: string;
  views24h: number;
  views7d: number;
  views30d: number;
  homeClicks: number;
  homeImpressions: number;
  newsletterClicks: number;
};

export type NewsletterEditionRecord = {
  id: string;
  subject: string;
  intro: string;
  headlineContentId?: string;
  contentIds: string[];
  status: "draft" | "scheduled" | "sent";
  scheduledAt?: string;
  sentAt?: string;
};

export type AdminUserRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
};

export type PublicContentCardVM = {
  id: string;
  type: ContentType;
  title: string;
  summary?: string;
  slug: string;
  editoriaName: string;
  authorName: string;
  authorRole?: string;
  publishedLabel: string;
  readingTimeLabel?: string;
  imageUrl?: string;
  imageAlt?: string;
  urgentLabel?: string;
  decisionMeta?: {
    court: string;
    practicalImpact?: string;
    judgmentDate?: string;
  };
};

export type PublicContentPageVM = {
  content: PublicContentCardVM & {
    subtitle?: string;
    lead?: string;
    body: string;
    caption?: string;
    credit?: string;
    tags: string[];
    seo: ContentSeoRecord;
  };
  author: AuthorRecord;
  related: PublicContentCardVM[];
};

export type PublicAuthorPageVM = {
  author: AuthorRecord;
  contents: PublicContentCardVM[];
};

export type HomeZoneVM = {
  key: HomeZoneKey;
  title?: string;
  mode: HomeZoneMode;
  maxItems?: number;
  items: PublicContentCardVM[];
};

export type HomeZoneInspectionItemVM = {
  id: string;
  title: string;
  editoriaName: string;
  type: ContentType;
  publishedLabel: string;
  priority: EditorialPriority;
  origin: HomeZoneItemOrigin;
  position: number;
};

export type HomeZoneInspectionVM = {
  key: HomeZoneKey;
  title: string;
  mode: HomeZoneMode;
  maxItems: number;
  items: HomeZoneInspectionItemVM[];
};

export type HomeZoneConfigRecord = {
  key: HomeZoneKey;
  title: string;
  mode: HomeZoneMode;
  maxItems: number;
  allowedTypes: ContentType[];
  excludedTypes?: ContentType[];
  allowedEditorias?: string[];
  allowedPriorities?: EditorialPriority[];
  allowedStatuses?: ContentStatus[];
  dateWindowDays?: number;
  requireHomeEligibility: boolean;
  preferHighImpactDecisions?: boolean;
  sort: HomeZoneSort;
  pinnedContentIds: string[];
  pinExpiresAtByContentId?: Record<string, string>;
  fallbackToAutomatic: boolean;
};

export type WorkflowCommentRecord = {
  id: string;
  contentId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type WorkflowEventRecord = {
  id: string;
  contentId: string;
  fromStatus?: ContentStatus;
  toStatus: ContentStatus;
  actorName: string;
  createdAt: string;
  note?: string;
};

export type WorkflowChecklistItemRecord = {
  key: WorkflowChecklistKey;
  label: string;
  checked: boolean;
  required: boolean;
};
