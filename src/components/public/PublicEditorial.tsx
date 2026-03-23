import React from "react";
import { ArrowRight, ChevronRight, Clock, Mail, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  type PublicAuthor,
  type PublicContentItem,
  type PublicMostReadItem,
  getAuthorHref,
  getPublicContentHref,
  getPublicTypeLabel,
} from "@/pages/public/public-content";

export function PublicPageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function PublicPageSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={cn("py-10 sm:py-12 lg:py-14", className)}>{children}</section>;
}

export function PublicDivider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-border/80", className)} />;
}

export function PublicSectionShell({
  children,
  className,
  tone = "plain",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "plain" | "warm" | "card";
}) {
  return (
    <div
      className={cn(
        "rounded-[28px]",
        tone === "warm" && "border border-border/80 bg-[linear-gradient(180deg,rgba(247,243,236,0.92)_0%,rgba(255,253,249,0.98)_100%)] shadow-editorial-sm",
        tone === "card" && "border border-border/80 bg-card/90 shadow-editorial",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PublicPageTitle({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("mb-8", align === "center" && "mx-auto max-w-3xl text-center")}>
      {eyebrow ? (
        <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.24em] text-bronze">
          {eyebrow}
        </span>
      ) : null}
      <h1 className="max-w-[16ch] font-display text-[2rem] leading-[1.04] tracking-[-0.03em] text-foreground sm:text-[2.55rem] lg:text-[2.85rem]">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.9] text-muted-foreground sm:text-[16px]">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function EditorialSectionHeader({
  eyebrow,
  title,
  description,
  actionLabel = "Ver todas",
  actionTo,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 border-b border-border/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-bronze">
            {eyebrow}
          </span>
        ) : null}
        <h2 className="font-display text-[1.7rem] leading-tight tracking-[-0.02em] text-foreground sm:text-[2rem]">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-[14px] leading-[1.85] text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actionTo ? (
        <Link
          to={actionTo}
          className="inline-flex items-center gap-1 rounded-full px-1 py-1 text-[13px] font-medium text-primary transition-colors hover:text-primary/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-ui"
        >
          {actionLabel}
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </Link>
      ) : null}
    </div>
  );
}

function EditorialMeta({ item, compact = false }: { item: PublicContentItem; compact?: boolean }) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <span className="font-semibold uppercase tracking-[0.24em] text-bronze">{item.editoria}</span>
        <span className="text-muted-foreground/30">.</span>
        <span className="uppercase tracking-[0.2em] text-muted-foreground">{getPublicTypeLabel(item.type)}</span>
      </div>
      <div
        className={cn(
          "mt-2 flex flex-wrap items-center gap-2 text-muted-foreground",
          compact ? "text-[11px]" : "text-[12px]",
        )}
      >
        <span className="font-medium text-foreground/85">{item.author}</span>
        {item.sourceLabel ? (
          <>
            <span>.</span>
            <span>{item.sourceLabel}</span>
          </>
        ) : null}
        <span>.</span>
        <span>{item.date}</span>
        <span>.</span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" strokeWidth={1.5} />
          {item.readTime}
        </span>
      </div>
    </>
  );
}

function EditorialMediaPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-full min-h-[220px] items-end rounded-[22px] border border-dashed border-border/80 bg-[linear-gradient(180deg,rgba(247,243,236,0.82)_0%,rgba(255,253,249,0.98)_100%)] p-5">
      <div>
        <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze">Sem imagem</span>
        <p className="max-w-xs text-[13px] leading-[1.75] text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function EditorialFeature({
  item,
  className,
}: {
  item: PublicContentItem;
  className?: string;
}) {
  return (
    <Link
      to={getPublicContentHref(item)}
      className={cn("group block rounded-[28px] border border-border/80 bg-card/80 p-4 shadow-editorial transition-shadow hover:shadow-editorial-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
    >
      {item.image ? (
        <div className="aspect-[16/9] overflow-hidden rounded-[22px] bg-muted">
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <EditorialMediaPlaceholder label="A cobertura segue publicada com integridade editorial mesmo sem imagem de apoio." />
      )}
      <div className="px-1 pb-1 pt-5">
        <EditorialMeta item={item} />
        <h2 className="mt-4 font-display text-[2rem] leading-[1.08] tracking-[-0.03em] text-foreground transition-colors group-hover:text-primary lg:text-[2.7rem]">
          {item.title}
        </h2>
        {item.subtitle && item.subtitle !== item.lead ? (
          <p className="mt-3 text-[15px] leading-[1.8] text-foreground/82 lg:text-[16px]">{item.subtitle}</p>
        ) : null}
        {item.lead ? (
          <p className="mt-4 max-w-3xl text-[15px] leading-[1.9] text-muted-foreground lg:text-[16px]">
            {item.lead}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

export function EditorialCard({
  item,
  variant = "default",
  className,
}: {
  item: PublicContentItem;
  variant?: "default" | "compact";
  className?: string;
}) {
  const compact = variant === "compact";

  return (
    <Link to={getPublicContentHref(item)} className={cn("group block rounded-[20px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}>
      {item.image ? (
        <div
          className={cn(
            "overflow-hidden rounded-[20px] bg-muted",
            compact ? "mb-3 aspect-[4/3]" : "mb-4 aspect-[16/10]",
          )}
        >
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
      ) : compact ? null : (
        <EditorialMediaPlaceholder label="Este item aparece sem arte principal, mas preserva a hierarquia editorial do portal." />
      )}
      <EditorialMeta item={item} compact={compact} />
      <h3
        className={cn(
          "mt-3 font-display leading-snug tracking-[-0.02em] text-foreground transition-colors group-hover:text-primary",
          compact ? "text-[1.05rem]" : "text-[1.35rem]",
        )}
      >
        {item.title}
      </h3>
      {item.lead && !compact ? (
        <p className="mt-2 text-[13px] leading-[1.8] text-muted-foreground line-clamp-3">{item.lead}</p>
      ) : null}
    </Link>
  );
}

export function EditorialListItem({ item }: { item: PublicContentItem }) {
  return (
    <Link to={getPublicContentHref(item)} className="group block rounded-[18px] px-1 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <EditorialMeta item={item} compact />
      <h3 className="mt-2 font-display text-[1.15rem] leading-snug tracking-[-0.02em] text-foreground transition-colors group-hover:text-primary">
        {item.title}
      </h3>
      {item.lead ? (
        <p className="mt-1.5 text-[13px] leading-[1.75] text-muted-foreground line-clamp-2">{item.lead}</p>
      ) : null}
    </Link>
  );
}

export function EditorialRail({
  eyebrow,
  title,
  description,
  items,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: PublicContentItem[];
  className?: string;
}) {
  return (
    <PublicSectionShell tone="card" className={cn("p-5 sm:p-6", className)}>
      <EditorialSectionHeader eyebrow={eyebrow} title={title} description={description} />
      {items.length ? (
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.slug} className="border-b border-border/70 pb-6 last:border-b-0 last:pb-0">
              <EditorialCard item={item} variant="compact" />
            </div>
          ))}
        </div>
      ) : (
        <PublicEmptyState
          title="Secao em atualizacao"
          description="Novos conteudos serao organizados neste mesmo rail editorial conforme a proxima etapa da camada publica."
        />
      )}
    </PublicSectionShell>
  );
}

export function PublicHeroSplit({
  featured,
  railEyebrow,
  railTitle,
  railDescription,
  railItems,
  className,
}: {
  featured: PublicContentItem;
  railEyebrow: string;
  railTitle: string;
  railDescription: string;
  railItems: PublicContentItem[];
  className?: string;
}) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,0.95fr)]", className)}>
      <EditorialFeature item={featured} />
      <EditorialRail
        eyebrow={railEyebrow}
        title={railTitle}
        description={railDescription}
        items={railItems}
      />
    </div>
  );
}

export function EditorialGrid({
  items,
  columns = 3,
}: {
  items: PublicContentItem[];
  columns?: 2 | 3;
}) {
  return (
    <div className={cn("grid gap-8", columns === 2 ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3")}>
      {items.map((item) => (
        <EditorialCard key={item.slug} item={item} />
      ))}
    </div>
  );
}

export function EditorialCollectionBlock({
  eyebrow,
  title,
  description,
  items,
  columns = 3,
  actionTo,
  actionLabel,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: PublicContentItem[];
  columns?: 2 | 3;
  actionTo?: string;
  actionLabel?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <EditorialSectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actionTo={actionTo}
        actionLabel={actionLabel}
      />
      {items.length ? (
        <EditorialGrid items={items} columns={columns} />
      ) : (
        <PublicEmptyState
          title="Secao sem publicacoes"
          description="Este bloco sera preenchido automaticamente quando houver conteudos publicados suficientes na base editorial."
        />
      )}
    </div>
  );
}

export function EditorialMostRead({
  title,
  items,
}: {
  title: string;
  items: PublicMostReadItem[];
}) {
  return (
    <div className="rounded-[24px] border border-border/80 bg-card/90 p-6 shadow-editorial">
      <div className="mb-5 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-bronze" strokeWidth={1.5} />
        <h3 className="text-[14px] font-semibold text-foreground font-ui">{title}</h3>
      </div>
      {items.length ? (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.position} className="flex gap-3 border-b border-border/60 pb-4 last:border-b-0 last:pb-0">
              <span className="pt-0.5 font-display text-[2rem] leading-none text-muted-foreground/30 tabular-nums">
                {item.position}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium leading-snug text-foreground">{item.title}</p>
                <span className="mt-1 block text-[11px] text-muted-foreground tabular-nums">{item.views} leituras</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[13px] leading-[1.8] text-muted-foreground">A lista de leituras mais acessadas aparecera aqui conforme a camada publica consolidar visualizacoes suficientes.</p>
      )}
    </div>
  );
}

export function EditorialNewsletterPanel({
  variant = "sidebar",
  className,
}: {
  variant?: "sidebar" | "footer";
  className?: string;
}) {
  const isFooter = variant === "footer";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[24px] border shadow-editorial",
        isFooter
          ? "border-primary-foreground/10 bg-primary-foreground/[0.04] p-5"
          : "border-primary/10 bg-primary p-6 text-primary-foreground",
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-2">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border",
            isFooter
              ? "border-primary-foreground/15 bg-primary-foreground/[0.06] text-primary-foreground/85"
              : "border-primary-foreground/15 bg-primary-foreground/10 text-bronze",
          )}
        >
          <Mail className="h-4 w-4" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-foreground/55">
            Curadoria
          </p>
          <h3 className="font-display text-[1.35rem] text-primary-foreground">Newsletter Veredito</h3>
        </div>
      </div>
      <p className={cn("text-[13px] leading-[1.8]", isFooter ? "text-primary-foreground/70" : "text-primary-foreground/72")}>
        Receba uma leitura semanal objetiva, com recortes juridicos relevantes e selecao editorial sem ruido promocional.
      </p>
      <div className="mt-4 flex flex-col gap-2">
        <input
          type="email"
          placeholder="Seu melhor e-mail"
          className={cn(
            "h-11 w-full rounded-md border px-3 text-[13px] transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
            isFooter
              ? "border-primary-foreground/18 bg-primary-foreground/[0.08] text-primary-foreground placeholder:text-primary-foreground/38"
              : "border-primary-foreground/16 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40",
          )}
        />
        <button className="h-11 rounded-md bg-bronze px-4 text-[13px] font-medium text-bronze-foreground transition-colors hover:bg-bronze/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-ui">
          Assinar gratuitamente
        </button>
      </div>
      <p className={cn("mt-3 text-[11px]", isFooter ? "text-primary-foreground/50" : "text-primary-foreground/42")}>
        Mais de 1.200 assinantes . Cancelamento livre
      </p>
    </div>
  );
}

export function PublicBreadcrumb({
  items,
}: {
  items: Array<{ label: string; to?: string }>;
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-[12px] text-muted-foreground">
      {items.map((item, index) => (
        <React.Fragment key={`${item.label}-${index}`}>
          {index > 0 ? <ChevronRight className="h-3 w-3" /> : null}
          {item.to ? (
            <Link to={item.to} className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {item.label}
            </Link>
          ) : (
            <span className="truncate">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

export function EditorialTagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-border/80 bg-card/80 px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-editorial-sm"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export function EditorialContextPanel({
  title,
  lines,
}: {
  title: string;
  lines: string[];
}) {
  return (
    <aside className="rounded-[24px] border border-border/80 bg-[linear-gradient(180deg,rgba(247,243,236,0.86)_0%,rgba(255,253,249,0.98)_100%)] p-6 shadow-editorial-sm">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-bronze">Contexto</span>
      <h3 className="font-display text-[1.45rem] leading-tight text-foreground">{title}</h3>
      <ul className="mt-4 space-y-3">
        {lines.map((line) => (
          <li key={line} className="flex gap-3 text-[14px] leading-[1.8] text-muted-foreground">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-bronze" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function EditorialAuthorSummary({
  author,
  contentCount,
}: {
  author: PublicAuthor;
  contentCount?: number;
}) {
  return (
    <div className="rounded-[24px] border border-border/80 bg-card/90 p-6 shadow-editorial">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
          {author.avatarLabel}
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-foreground">{author.name}</p>
          <p className="mt-1 text-[12px] uppercase tracking-[0.2em] text-bronze">{author.role}</p>
          <p className="mt-3 text-[13px] leading-[1.8] text-muted-foreground">{author.shortBio || "Biografia editorial em atualização."}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {author.focus.length ? author.focus.map((focus) => (
              <span key={focus} className="rounded-full bg-secondary px-3 py-1 text-[11px] text-muted-foreground">
                {focus}
              </span>
            )) : (
              <span className="rounded-full bg-secondary px-3 py-1 text-[11px] text-muted-foreground">Equipe editorial</span>
            )}
          </div>
          {contentCount ? (
            <Link
              to={getAuthorHref(author.slug)}
              className="mt-4 inline-flex items-center gap-1 rounded-full px-1 py-1 text-[13px] font-medium text-primary transition-colors hover:text-primary/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-ui"
            >
              Ver publicacoes do autor ({contentCount})
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function PublicArticleHeader({
  item,
  authorRole,
}: {
  item: PublicContentItem;
  authorRole?: string;
}) {
  return (
    <header>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-bronze">{item.editoria}</span>
        <span className="text-muted-foreground/30">.</span>
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {getPublicTypeLabel(item.type)}
        </span>
      </div>
      <h1 className="mt-4 font-display text-[2.2rem] leading-[1.04] tracking-[-0.03em] text-foreground sm:text-[2.9rem] lg:text-[3.2rem]">
        {item.title}
      </h1>
      {item.subtitle && item.subtitle !== item.lead ? (
        <p className="mt-3 max-w-3xl text-[16px] leading-[1.8] text-foreground/82">{item.subtitle}</p>
      ) : null}
      {item.lead ? (
        <p className="mt-5 max-w-3xl text-[17px] leading-[1.9] text-muted-foreground">{item.lead}</p>
      ) : null}
      <div className="mt-7 flex flex-col gap-4 border-y border-border/80 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
            {item.author
              .split(" ")
              .map((word) => word[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div>
            <p className="text-[13px] font-medium text-foreground">{item.author}</p>
            <p className="text-[12px] text-muted-foreground">{authorRole ?? "Equipe editorial Veredito"}</p>
          </div>
        </div>
        <EditorialMeta item={item} />
      </div>
    </header>
  );
}

export function PublicListingHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <PublicSectionShell tone="warm" className="px-6 py-8 shadow-editorial-sm sm:px-8 lg:px-10">
      <PublicPageTitle eyebrow={eyebrow} title={title} subtitle={subtitle} />
    </PublicSectionShell>
  );
}

export function PublicInstitutionalPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-border/80 bg-card/90 p-7 shadow-editorial sm:p-8">
      <h2 className="font-display text-[1.65rem] leading-tight text-foreground">{title}</h2>
      <div className="mt-5 space-y-4 text-[15px] leading-[1.9] text-foreground">{children}</div>
    </div>
  );
}

export function PublicEmptyState({
  title,
  description,
  actionLabel,
  actionTo,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
}) {
  return (
    <div className="rounded-[24px] border border-border/80 bg-card/90 px-6 py-12 text-center shadow-editorial-sm sm:px-8">
      <h3 className="font-display text-[1.5rem] text-foreground">{title}</h3>
      <p className="mx-auto mt-3 max-w-2xl text-[14px] leading-[1.8] text-muted-foreground">{description}</p>
      {actionLabel && actionTo ? (
        <Link
          to={actionTo}
          className="mt-5 inline-flex items-center gap-1 rounded-full border border-border/80 bg-background px-4 py-2 text-[13px] font-medium text-foreground transition-colors hover:border-primary/20 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-ui"
        >
          {actionLabel}
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </Link>
      ) : null}
    </div>
  );
}
