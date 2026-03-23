import React, { useMemo } from "react";
import {
  isConteudoCanonicallySupported,
  type ContentEntity,
  type ContentTypeKey,
  type EditorialSectionEntity,
  type AuthorEntity,
  type SourceEntity,
  useEditorialStore,
} from "@/pages/admin/editorial-store";

export type PublicContentType = "Noticia" | "Decisao" | "Artigo" | "Opiniao";

export type PublicContentItem = {
  id: number;
  slug: string;
  type: PublicContentType;
  editoria: string;
  editoriaSlug: string;
  title: string;
  subtitle?: string;
  lead?: string;
  author: string;
  authorSlug: string;
  date: string;
  readTime: string;
  image?: string;
  tags: string[];
  contextTitle: string;
  contextLines: string[];
  bodyParagraphs: string[];
  sourceLabel?: string;
  sourceUrl?: string;
  views: number;
  metaTitle: string;
  metaDescription: string;
};

export type PublicMostReadItem = {
  position: number;
  title: string;
  views: string;
};

export type PublicAuthor = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  shortBio: string;
  avatarLabel: string;
  focus: string[];
};

export type PublicEditoria = {
  slug: string;
  name: string;
  description: string;
  deck: string;
};

export type PublicEditorialSection = {
  eyebrow: string;
  title: string;
  description: string;
  featured: PublicContentItem;
  items: PublicContentItem[];
};

const typePathMap: Record<PublicContentType, string> = {
  Noticia: "noticia",
  Decisao: "decisao",
  Artigo: "artigo",
  Opiniao: "opiniao",
};

const typeCollectionMap: Record<PublicContentType, string> = {
  Noticia: "/noticias",
  Decisao: "/decisoes",
  Artigo: "/artigos",
  Opiniao: "/opiniao",
};

const typeImageMap: Record<ContentTypeKey, string> = {
  noticia: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
  decisao: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80",
  artigo: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80",
  opiniao: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80",
};

function toPublicType(typeKey: ContentTypeKey): PublicContentType {
  switch (typeKey) {
    case "noticia":
      return "Noticia";
    case "decisao":
      return "Decisao";
    case "artigo":
      return "Artigo";
    case "opiniao":
      return "Opiniao";
  }
}

export function normalizePublicText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function normalizePublicSlug(value: string) {
  return normalizePublicText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function estimateReadTime(body: string) {
  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(4, Math.ceil(wordCount / 180));
  return `${minutes} min`;
}

function buildContextLines(
  conteudo: ContentEntity,
  editoria: EditorialSectionEntity,
  autor: AuthorEntity,
  fonte?: SourceEntity | null,
) {
  if (conteudo.typeKey === "decisao") {
    return [
      conteudo.tribunal || fonte?.name || "Cobertura judicial em destaque no Veredito.",
      conteudo.relator ? `Relatoria: ${conteudo.relator}.` : `Autor: ${autor.name}.`,
      conteudo.teseFixada || conteudo.impacto || editoria.description,
    ].filter(Boolean).slice(0, 3);
  }

  if (conteudo.typeKey === "noticia") {
    return [
      fonte ? `Fonte principal: ${fonte.sigla} - ${fonte.name}.` : `Editoria: ${editoria.name}.`,
      conteudo.impacto || editoria.description,
      conteudo.referencias || `Cobertura assinada por ${autor.name}.`,
    ].filter(Boolean).slice(0, 3);
  }

  if (conteudo.typeKey === "artigo") {
    return [
      conteudo.temaCentral || `Analise orientada pela editoria ${editoria.name}.`,
      conteudo.referencias || `Texto assinado por ${autor.name}.`,
      conteudo.impacto || editoria.description,
    ].filter(Boolean).slice(0, 3);
  }

  return [
    conteudo.posicao || `Coluna de ${autor.name}.`,
    conteudo.disclaimer || editoria.description,
    conteudo.temaCentral || conteudo.impacto || `Leitura editorial da editoria ${editoria.name}.`,
  ].filter(Boolean).slice(0, 3);
}

function buildContextTitle(type: PublicContentType) {
  switch (type) {
    case "Decisao":
      return "Leitura do precedente";
    case "Artigo":
      return "Eixo da analise";
    case "Opiniao":
      return "Posicionamento editorial";
    case "Noticia":
      return "Contexto da cobertura";
  }
}

function buildFallbackImage(typeKey: ContentTypeKey, editoriaSlug: string) {
  if (editoriaSlug === "tributario") return "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&q=80";
  if (editoriaSlug === "empresarial") return "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1200&q=80";
  if (editoriaSlug === "trabalhista") return "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80";
  return typeImageMap[typeKey];
}

function buildPublicContentItem(
  conteudo: ContentEntity,
  editorias: EditorialSectionEntity[],
  autores: AuthorEntity[],
  fontes: SourceEntity[],
): PublicContentItem | null {
  const editoria = editorias.find((item) => item.id === conteudo.editoriaId);
  const autor = autores.find((item) => item.id === conteudo.authorId);
  const fonte = conteudo.fonteId ? fontes.find((item) => item.id === conteudo.fonteId) ?? null : null;

  if (!editoria || !autor) return null;
  if (!isConteudoCanonicallySupported(conteudo, editorias, autores, fontes)) return null;
  if (conteudo.status !== "published") return null;

  const type = toPublicType(conteudo.typeKey);
  const slug = normalizePublicSlug(conteudo.title);
  const bodyParagraphs = conteudo.body.split(/\n+/).map((item) => item.trim()).filter(Boolean);
  const image = buildFallbackImage(conteudo.typeKey, editoria.slug);
  const metaTitle = conteudo.metaTitle?.trim() || `${conteudo.title} | ${editoria.name} | Veredito`;
  const metaDescription = conteudo.metaDesc?.trim() || conteudo.lead || conteudo.subtitle || editoria.description;

  return {
    id: conteudo.id,
    slug,
    type,
    editoria: editoria.name,
    editoriaSlug: editoria.slug,
    title: conteudo.title,
    subtitle: conteudo.subtitle || undefined,
    lead: conteudo.lead || conteudo.subtitle || undefined,
    author: autor.name,
    authorSlug: autor.slug,
    date: conteudo.dateLabel,
    readTime: estimateReadTime(conteudo.body),
    image,
    tags: conteudo.tags,
    contextTitle: buildContextTitle(type),
    contextLines: buildContextLines(conteudo, editoria, autor, fonte),
    bodyParagraphs,
    sourceLabel: fonte ? `${fonte.sigla} - ${fonte.name}` : undefined,
    sourceUrl: fonte?.url,
    views: conteudo.views,
    metaTitle,
    metaDescription,
  };
}

function formatViews(views: number) {
  return new Intl.NumberFormat("pt-BR").format(views);
}

export function getPublicTypeLabel(type: PublicContentType) {
  return type;
}

export function getPublicTypePath(type: PublicContentType) {
  return typePathMap[type];
}

export function getPublicCollectionPath(type: PublicContentType) {
  return typeCollectionMap[type];
}

export function getPublicContentHref(item: Pick<PublicContentItem, "type" | "slug">) {
  return `/${getPublicTypePath(item.type)}/${item.slug}`;
}

export function getAuthorHref(authorSlug: string) {
  return `/autor/${authorSlug}`;
}

export function usePublicEditorialData() {
  const { autores, conteudos, editorias, fontes, homeHighlights } = useEditorialStore();

  return useMemo(() => {
    const allPublicContent = conteudos
      .map((item) => buildPublicContentItem(item, editorias, autores, fontes))
      .filter((item): item is PublicContentItem => Boolean(item))
      .sort((a, b) => b.id - a.id);

    const allPublicContentById = new Map(allPublicContent.map((item) => [item.id, item]));

    const noticias = allPublicContent.filter((item) => item.type === "Noticia");
    const decisoes = allPublicContent.filter((item) => item.type === "Decisao");
    const artigos = allPublicContent.filter((item) => item.type === "Artigo");
    const opinioes = allPublicContent.filter((item) => item.type === "Opiniao");

    const editoriasPublicas = editorias
      .filter((item) => item.status === "active")
      .map((item) => {
        const itemConteudos = allPublicContent.filter((content) => content.editoriaSlug === item.slug);
        if (!itemConteudos.length) return null;
        return {
          slug: item.slug,
          name: item.name,
          description: item.description,
          deck: `${item.description}. Leitura editorial organizada a partir da base canônica do admin.`,
        } satisfies PublicEditoria;
      })
      .filter((item): item is PublicEditoria => Boolean(item));

    const publicAuthors = autores
      .filter((item) => item.status === "active")
      .map((item) => {
        const authorItems = allPublicContent.filter((content) => content.authorSlug === item.slug);
        if (!authorItems.length) return null;
        const focus = Array.from(new Set(authorItems.map((content) => content.editoria))).slice(0, 3);
        return {
          slug: item.slug,
          name: item.name,
          role: item.role,
          bio: item.bio,
          shortBio: item.bio,
          avatarLabel: item.initials,
          focus,
        } satisfies PublicAuthor;
      })
      .filter((item): item is PublicAuthor => Boolean(item));

    const orderedHighlights = [...homeHighlights]
      .sort((a, b) => a.position - b.position)
      .map((item) => ({ ...item, content: allPublicContentById.get(item.contentId) }))
      .filter((item): item is typeof item & { content: PublicContentItem } => Boolean(item.content));

    const homeManchete = orderedHighlights.find((item) => item.slotType === "Manchete")?.content ?? allPublicContent[0] ?? null;
    const homeHighlightsItems = orderedHighlights
      .filter((item) => item.slotType !== "Manchete")
      .map((item) => item.content)
      .slice(0, 3);

    const fallbackHomeHighlights = allPublicContent.filter((item) => item.id !== homeManchete?.id).slice(0, 3);
    const latestPublications = allPublicContent.slice(0, 5);

    const homeEditorialSections = editoriasPublicas
      .map((section, index) => {
        const sectionItems = allPublicContent.filter((item) => item.editoriaSlug === section.slug);
        if (!sectionItems.length) return null;
        return {
          eyebrow: index === 0 ? "Editoria em foco" : "Leitura setorial",
          title: section.name,
          description: section.description,
          featured: sectionItems[0],
          items: sectionItems.slice(1, 4),
        } satisfies PublicEditorialSection;
      })
      .filter((item): item is PublicEditorialSection => Boolean(item))
      .slice(0, 2);

    const mostReadItems = [...allPublicContent]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map((item, index) => ({ position: index + 1, title: item.title, views: formatViews(item.views) }));

    const findPublicContentBySlug = (slug?: string) => {
      if (!slug) return allPublicContent[0];
      return allPublicContent.find((item) => item.slug === slug) ?? allPublicContent[0];
    };

    const findAuthorBySlug = (slug?: string) => {
      if (!slug) return publicAuthors[0];
      return publicAuthors.find((author) => author.slug === slug) ?? publicAuthors[0];
    };

    const getContentByAuthorSlug = (authorSlug: string) => allPublicContent.filter((item) => item.authorSlug === authorSlug);

    const findEditoriaBySlug = (slug?: string) => {
      if (!slug) return editoriasPublicas[0];
      return editoriasPublicas.find((editoria) => editoria.slug === slug) ?? editoriasPublicas[0];
    };

    const getContentByEditoriaSlug = (slug: string) => allPublicContent.filter((item) => item.editoriaSlug === slug);

    const getRelatedPublicContent = (current: PublicContentItem, limit = 3) =>
      allPublicContent
        .filter((item) => item.slug !== current.slug)
        .sort((a, b) => {
          const aScore = Number(a.editoriaSlug === current.editoriaSlug) + Number(a.type === current.type);
          const bScore = Number(b.editoriaSlug === current.editoriaSlug) + Number(b.type === current.type);
          return bScore - aScore;
        })
        .slice(0, limit);

    return {
      allPublicContent,
      noticias,
      decisoes,
      artigos,
      opinioes,
      editorias: editoriasPublicas,
      authors: publicAuthors,
      homeManchete,
      homeHighlights: homeHighlightsItems.length ? homeHighlightsItems : fallbackHomeHighlights,
      latestPublications,
      homeEditorialSections,
      mostReadItems,
      findPublicContentBySlug,
      findAuthorBySlug,
      getContentByAuthorSlug,
      findEditoriaBySlug,
      getContentByEditoriaSlug,
      getRelatedPublicContent,
      publicationRuleLabel: "Apenas conteúdos publicados aparecem no portal público.",
    };
  }, [autores, conteudos, editorias, fontes, homeHighlights]);
}
