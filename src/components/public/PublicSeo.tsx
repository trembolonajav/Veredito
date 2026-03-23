import { useEffect } from "react";

const SITE_NAME = "Veredito";
const DEFAULT_IMAGE = "/brand/favicon-png.png";
const SITE_URL = "https://veredito.com.br";

type PublicSeoProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
};

function ensureMeta(selector: string, create: () => HTMLMetaElement) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = create();
    document.head.appendChild(element);
  }
  return element;
}

function ensureLink(selector: string, create: () => HTMLLinkElement) {
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!element) {
    element = create();
    document.head.appendChild(element);
  }
  return element;
}

export function PublicSeo({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
}: PublicSeoProps) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const canonicalHref = `${SITE_URL}${path}`;
    const imageHref = image.startsWith("http") ? image : `${SITE_URL}${image}`;

    document.title = fullTitle;

    const descriptionMeta = ensureMeta('meta[name="description"]', () => {
      const meta = document.createElement("meta");
      meta.name = "description";
      return meta;
    });
    descriptionMeta.content = description;

    const robotsMeta = ensureMeta('meta[name="robots"]', () => {
      const meta = document.createElement("meta");
      meta.name = "robots";
      return meta;
    });
    robotsMeta.content = noindex ? "noindex,nofollow" : "index,follow";

    const ogTitle = ensureMeta('meta[property="og:title"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:title");
      return meta;
    });
    ogTitle.content = fullTitle;

    const ogDescription = ensureMeta('meta[property="og:description"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:description");
      return meta;
    });
    ogDescription.content = description;

    const ogType = ensureMeta('meta[property="og:type"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:type");
      return meta;
    });
    ogType.content = type;

    const ogUrl = ensureMeta('meta[property="og:url"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:url");
      return meta;
    });
    ogUrl.content = canonicalHref;

    const ogSiteName = ensureMeta('meta[property="og:site_name"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:site_name");
      return meta;
    });
    ogSiteName.content = SITE_NAME;

    const ogImage = ensureMeta('meta[property="og:image"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:image");
      return meta;
    });
    ogImage.content = imageHref;

    const twitterCard = ensureMeta('meta[name="twitter:card"]', () => {
      const meta = document.createElement("meta");
      meta.name = "twitter:card";
      return meta;
    });
    twitterCard.content = "summary_large_image";

    const twitterTitle = ensureMeta('meta[name="twitter:title"]', () => {
      const meta = document.createElement("meta");
      meta.name = "twitter:title";
      return meta;
    });
    twitterTitle.content = fullTitle;

    const twitterDescription = ensureMeta('meta[name="twitter:description"]', () => {
      const meta = document.createElement("meta");
      meta.name = "twitter:description";
      return meta;
    });
    twitterDescription.content = description;

    const twitterImage = ensureMeta('meta[name="twitter:image"]', () => {
      const meta = document.createElement("meta");
      meta.name = "twitter:image";
      return meta;
    });
    twitterImage.content = imageHref;

    const canonical = ensureLink('link[rel="canonical"]', () => {
      const link = document.createElement("link");
      link.rel = "canonical";
      return link;
    });
    canonical.href = canonicalHref;
  }, [description, image, noindex, path, title, type]);

  return null;
}
