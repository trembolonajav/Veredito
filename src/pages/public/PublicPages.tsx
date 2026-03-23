import React, { useMemo, useState } from "react";
import { Mail, Search } from "lucide-react";
import { useParams } from "react-router-dom";
import {
  EditorialAuthorSummary,
  EditorialCollectionBlock,
  EditorialContextPanel,
  EditorialFeature,
  EditorialNewsletterPanel,
  EditorialRail,
  EditorialTagList,
  PublicArticleHeader,
  PublicBreadcrumb,
  PublicEmptyState,
  PublicHeroSplit,
  PublicInstitutionalPanel,
  PublicListingHero,
  PublicPageContainer,
  PublicPageSection,
  PublicPageTitle,
  PublicSectionShell,
} from "@/components/public/PublicEditorial";
import { PublicSeo } from "@/components/public/PublicSeo";
import { normalizePublicText, type PublicContentItem, usePublicEditorialData } from "./public-content";

function ListingPage({
  eyebrow,
  title,
  subtitle,
  items,
  path,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: PublicContentItem[];
  path: string;
}) {
  const [visibleCount, setVisibleCount] = useState(4);
  const visibleItems = items.slice(0, visibleCount);
  const featuredItem = visibleItems[0];
  const remainingItems = visibleItems.slice(1, 4);
  const archiveItems = visibleItems.slice(4);

  return (
    <PublicPageSection className="pt-8 sm:pt-10">
      <PublicSeo title={`${title} | Veredito`} description={subtitle} path={path} />
      <PublicPageContainer>
        <PublicBreadcrumb items={[{ label: "Veredito", to: "/" }, { label: title }]} />
        <PublicListingHero eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className="mt-10 space-y-10">
          {featuredItem ? (
            <PublicHeroSplit
              featured={featuredItem}
              railEyebrow="Fluxo"
              railTitle="Leituras desta secao"
              railDescription="Recortes complementares da mesma conversa editorial, mantendo metadata, ritmo e densidade publica consistentes."
              railItems={remainingItems}
            />
          ) : (
            <PublicEmptyState
              title="Nenhum conteudo publicado ainda"
              description="Esta secao ainda nao possui conteudos publicados na base editorial integrada do admin."
              actionLabel="Voltar para a home"
              actionTo="/"
            />
          )}

          {archiveItems.length ? (
            <EditorialCollectionBlock
              eyebrow="Arquivo"
              title="Mais desta secao"
              description="A mesma linguagem de cards e metadata continua na camada de arquivo publico."
              items={archiveItems}
            />
          ) : null}

          <PublicSectionShell tone="card" className="p-6 sm:p-7">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center">
              <div>
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-bronze">
                  Curadoria semanal
                </span>
                <h2 className="font-display text-[1.8rem] leading-tight text-foreground sm:text-[2rem]">
                  Continue a leitura com a newsletter do Veredito
                </h2>
                <p className="mt-3 max-w-2xl text-[14px] leading-[1.8] text-muted-foreground">
                  As listagens publicas desembocam na mesma chamada editorial de assinatura, reforcando a coerencia entre secao, detalhe e recorrencia de leitura.
                </p>
              </div>
              <EditorialNewsletterPanel />
            </div>
          </PublicSectionShell>

          {visibleCount < items.length ? (
            <div className="flex justify-center">
              <button
                onClick={() => setVisibleCount((count) => Math.min(count + 4, items.length))}
                className="h-11 rounded-full border border-border/80 bg-card px-6 text-[13px] font-medium text-foreground shadow-editorial-sm transition-colors hover:border-primary/20 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-ui"
              >
                Carregar mais publicacoes
              </button>
            </div>
          ) : null}
        </div>
      </PublicPageContainer>
    </PublicPageSection>
  );
}

export function NoticiasListPage() {
  const { noticias } = usePublicEditorialData();

  return (
    <ListingPage
      eyebrow="Noticias"
      title="Ultimas noticias"
      subtitle="Fatos, regulamentacoes e movimentos relevantes do ambiente juridico brasileiro."
      items={noticias}
      path="/noticias"
    />
  );
}

export function DecisoesListPage() {
  const { decisoes } = usePublicEditorialData();

  return (
    <ListingPage
      eyebrow="Decisoes"
      title="Decisoes judiciais"
      subtitle="Leitura editorial de precedentes e julgados com impacto pratico para leitores tecnicos."
      items={decisoes}
      path="/decisoes"
    />
  );
}

export function ArtigosListPage() {
  const { artigos } = usePublicEditorialData();

  return (
    <ListingPage
      eyebrow="Artigos"
      title="Artigos e analises"
      subtitle="Textos aprofundados para leitores que acompanham direito, regulacao e transformacoes institucionais."
      items={artigos}
      path="/artigos"
    />
  );
}

export function OpinioesListPage() {
  const { opinioes } = usePublicEditorialData();

  return (
    <ListingPage
      eyebrow="Opiniao"
      title="Opiniao"
      subtitle="Posicionamentos editoriais e colunas assinadas com linguagem institucional, tecnica e sobria."
      items={opinioes}
      path="/opiniao"
    />
  );
}

export function ConteudoPublicoPage() {
  const { slug } = useParams();
  const { findAuthorBySlug, findPublicContentBySlug, getContentByAuthorSlug, getRelatedPublicContent } = usePublicEditorialData();
  const content = findPublicContentBySlug(slug);

  if (!content) {
    return (
      <PublicPageSection className="pt-8 sm:pt-10">
        <PublicSeo
          title="Conteudo indisponivel | Veredito"
          description="Este conteudo nao foi encontrado na camada publica do Veredito."
          path={slug ? `/${slug}` : "/conteudo-indisponivel"}
          noindex
        />
        <PublicPageContainer>
          <PublicEmptyState
            title="Conteudo indisponivel"
            description="Este conteudo nao esta publicado ou nao existe na base editorial integrada."
            actionLabel="Voltar para a home"
            actionTo="/"
          />
        </PublicPageContainer>
      </PublicPageSection>
    );
  }

  const author = findAuthorBySlug(content.authorSlug);
  const relatedItems = getRelatedPublicContent(content, 3);
  const authorContentCount = author ? getContentByAuthorSlug(author.slug).length : 0;
  const contentPath = `/${content.type.toLowerCase()}/${content.slug}`;

  return (
    <PublicPageSection className="pt-8 sm:pt-10">
      <PublicSeo
        title={content.metaTitle}
        description={content.metaDescription}
        path={contentPath}
        image={content.image}
        type="article"
      />
      <PublicPageContainer>
        <article className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl">
            <PublicBreadcrumb
              items={[
                { label: "Veredito", to: "/" },
                { label: content.editoria, to: `/editoria/${content.editoriaSlug}` },
                { label: content.title },
              ]}
            />
            <PublicArticleHeader item={content} authorRole={author?.role} />
          </div>

          {content.image ? (
            <div className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-[28px] border border-border/80 bg-muted shadow-editorial">
              <div className="aspect-[16/8.5]">
                <img src={content.image} alt={content.title} className="h-full w-full object-cover" />
              </div>
            </div>
          ) : null}

          <div className="mx-auto mt-10 grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.8fr)]">
            <div className="min-w-0">
              <div className="mx-auto max-w-3xl space-y-5 text-[16px] leading-[1.95] text-foreground sm:text-[17px]">
                {content.bodyParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <div className="pt-2">
                  <EditorialTagList tags={content.tags} />
                </div>
              </div>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              <EditorialContextPanel title={content.contextTitle} lines={content.contextLines} />
              {author ? <EditorialAuthorSummary author={author} contentCount={authorContentCount} /> : null}
            </aside>
          </div>
        </article>

        <div className="mt-14">
          <EditorialCollectionBlock
            eyebrow="Relacionados"
            title="Leituras para continuar"
            description="Conteudos da mesma conversa editorial, mantendo contexto, editoria ou tipo."
            items={relatedItems}
          />
        </div>

        <div className="mt-12">
          <EditorialNewsletterPanel />
        </div>
      </PublicPageContainer>
    </PublicPageSection>
  );
}

export function EditoriaPublicaPage() {
  const { slug } = useParams();
  const { findEditoriaBySlug, getContentByEditoriaSlug } = usePublicEditorialData();
  const editoria = findEditoriaBySlug(slug);

  if (!editoria) {
    return (
      <PublicPageSection className="pt-8 sm:pt-10">
        <PublicSeo
          title="Editoria indisponivel | Veredito"
          description="Esta editoria nao possui publicacoes visiveis no portal."
          path={slug ? `/editoria/${slug}` : "/editoria"}
          noindex
        />
        <PublicPageContainer>
          <PublicEmptyState
            title="Editoria indisponivel"
            description="Esta editoria nao possui publicacoes visiveis na base editorial integrada."
            actionLabel="Voltar para a home"
            actionTo="/"
          />
        </PublicPageContainer>
      </PublicPageSection>
    );
  }

  const items = getContentByEditoriaSlug(editoria.slug);
  const featuredItem = items[0];

  return (
    <PublicPageSection className="pt-8 sm:pt-10">
      <PublicSeo
        title={`${editoria.name} | Veredito`}
        description={editoria.description}
        path={`/editoria/${editoria.slug}`}
        image={featuredItem?.image}
      />
      <PublicPageContainer>
        <PublicBreadcrumb items={[{ label: "Veredito", to: "/" }, { label: editoria.name }]} />
        <PublicListingHero eyebrow="Editoria" title={editoria.name} subtitle={editoria.description} />

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.8fr)]">
          <div>
            {featuredItem ? (
              <EditorialFeature item={featuredItem} />
            ) : (
              <PublicEmptyState
                title="Nenhuma publicacao nesta editoria"
                description="Assim que o admin publicar novos conteudos vinculados a esta editoria, eles aparecerao aqui."
              />
            )}
          </div>
          <EditorialRail
            eyebrow="Curadoria"
            title="Como ler esta secao"
            description={editoria.deck}
            items={items.slice(1, 4)}
          />
        </div>

        {items.length > 1 ? (
          <div className="mt-12">
            <EditorialCollectionBlock
              eyebrow="Arquivo editorial"
              title={`Mais da editoria ${editoria.name}`}
              description="A editoria funciona como secao curada do jornal, nao como arquivo neutro."
              items={items.slice(1)}
            />
          </div>
        ) : null}
      </PublicPageContainer>
    </PublicPageSection>
  );
}

export function AutorPublicoPage() {
  const { slug } = useParams();
  const { findAuthorBySlug, getContentByAuthorSlug } = usePublicEditorialData();
  const author = findAuthorBySlug(slug);

  if (!author) {
    return (
      <PublicPageSection className="pt-8 sm:pt-10">
        <PublicSeo
          title="Autor indisponivel | Veredito"
          description="Este autor ainda nao possui publicacoes visiveis no portal."
          path={slug ? `/autor/${slug}` : "/autor"}
          noindex
        />
        <PublicPageContainer>
          <PublicEmptyState
            title="Autor indisponivel"
            description="Este autor ainda nao possui publicacoes publicadas na base integrada."
            actionLabel="Ver noticias"
            actionTo="/noticias"
          />
        </PublicPageContainer>
      </PublicPageSection>
    );
  }

  const authorItems = getContentByAuthorSlug(author.slug);

  return (
    <PublicPageSection className="pt-8 sm:pt-10">
      <PublicSeo
        title={`${author.name} | Veredito`}
        description={author.shortBio}
        path={`/autor/${author.slug}`}
      />
      <PublicPageContainer>
        <PublicBreadcrumb items={[{ label: "Veredito", to: "/" }, { label: "Autores" }, { label: author.name }]} />
        <PublicSectionShell tone="warm" className="p-6 shadow-editorial sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)]">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary text-3xl font-semibold text-primary-foreground shadow-editorial-sm">
              {author.avatarLabel}
            </div>
            <div>
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-bronze">
                Autoria
              </span>
              <h1 className="font-display text-[2.2rem] leading-tight tracking-[-0.03em] text-foreground sm:text-[2.8rem]">
                {author.name}
              </h1>
              <p className="mt-2 text-[12px] uppercase tracking-[0.22em] text-muted-foreground">{author.role}</p>
              <p className="mt-4 max-w-3xl text-[15px] leading-[1.9] text-muted-foreground">{author.bio || "Biografia editorial em atualização."}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {author.focus.length ? author.focus.map((focus) => (
                  <span key={focus} className="rounded-full bg-secondary px-3 py-1 text-[11px] text-muted-foreground">
                    {focus}
                  </span>
                )) : (
                  <span className="rounded-full bg-secondary px-3 py-1 text-[11px] text-muted-foreground">Equipe editorial</span>
                )}
              </div>
            </div>
          </div>
        </PublicSectionShell>

        <div className="mt-12">
          {authorItems.length ? (
            <EditorialCollectionBlock
              eyebrow="Publicacoes"
              title={`Conteudos de ${author.name}`}
              description="Pagina editorial de autoria, com contexto institucional e leitura organizada por publicacoes do colaborador."
              items={authorItems}
            />
          ) : (
            <PublicEmptyState
              title="Autor sem publicacoes"
              description="Os proximos conteudos publicados por este autor aparecerao automaticamente aqui."
              actionLabel="Voltar para a home"
              actionTo="/"
            />
          )}
        </div>
      </PublicPageContainer>
    </PublicPageSection>
  );
}

export function BuscaPage() {
  const [query, setQuery] = React.useState("");
  const { allPublicContent } = usePublicEditorialData();

  const results = useMemo(() => {
    const normalizedQuery = normalizePublicText(query);
    if (normalizedQuery.length < 3) return [];

    return allPublicContent.filter((item) => {
      const haystack = [
        item.title,
        item.subtitle,
        item.lead,
        item.editoria,
        item.author,
        item.sourceLabel,
        ...item.tags,
      ]
        .filter(Boolean)
        .join(" ");

      return normalizePublicText(haystack).includes(normalizedQuery);
    });
  }, [allPublicContent, query]);

  const topResult = results[0];

  return (
    <PublicPageSection className="pt-8 sm:pt-10">
      <PublicSeo
        title="Busca | Veredito"
        description="Busque notícias, decisões, artigos e opinião na camada pública do Veredito."
        path="/busca"
        noindex
      />
      <PublicPageContainer>
        <PublicBreadcrumb items={[{ label: "Veredito", to: "/" }, { label: "Busca" }]} />
        <PublicPageTitle title="Busca" subtitle="Encontre noticias, decisoes, artigos e opinioes." />
        <div className="mb-8 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Digite para buscar..."
              autoFocus
              className="h-14 w-full rounded-[20px] border border-input bg-card px-12 pr-4 text-[16px] text-foreground shadow-editorial-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        {query.length > 2 ? (
          <p className="mb-6 text-[13px] text-muted-foreground">
            {results.length} resultado{results.length !== 1 ? "s" : ""} para "{query}"
          </p>
        ) : null}

        {topResult ? (
          <div className="space-y-10">
            <PublicHeroSplit
              featured={topResult}
              railEyebrow="Resultados"
              railTitle="Outras leituras encontradas"
              railDescription="A busca publica opera sobre a mesma base editorial publicada pelo admin."
              railItems={results.slice(1, 4)}
            />
            {results.length > 4 ? (
              <EditorialCollectionBlock
                eyebrow="Arquivo"
                title="Mais resultados"
                description="A mesma base de cards e metadata organiza a continuidade da busca."
                items={results.slice(4)}
              />
            ) : null}
          </div>
        ) : query.length > 2 ? (
          <PublicEmptyState
            title="Nenhum resultado encontrado"
            description="A busca publica nao encontrou conteudos publicados para esse termo."
            actionLabel="Ir para noticias"
            actionTo="/noticias"
          />
        ) : (
          <PublicEmptyState
            title="Comece pela busca"
            description="Digite ao menos tres caracteres para iniciar a leitura demonstrativa dos resultados."
            actionLabel="Ver ultimas noticias"
            actionTo="/noticias"
          />
        )}
      </PublicPageContainer>
    </PublicPageSection>
  );
}

export function SobrePage() {
  return (
    <PublicPageSection className="pt-8 sm:pt-10">
      <PublicSeo
        title="Sobre o Veredito"
        description="Conheça o posicionamento editorial, a missão e o contexto institucional do Veredito."
        path="/sobre"
      />
      <PublicPageContainer>
        <div className="mx-auto max-w-3xl">
          <PublicBreadcrumb items={[{ label: "Veredito", to: "/" }, { label: "Sobre" }]} />
          <PublicPageTitle
            eyebrow="Institucional"
            title="Sobre o Veredito"
            subtitle="Um jornal jurídico pensado para combinar densidade técnica, clareza narrativa e hierarquia editorial madura."
          />
          <PublicInstitutionalPanel title="Jornalismo juridico com rigor e clareza">
            <p>
              O <strong>Veredito</strong> e um portal de jornalismo juridico independente, dedicado a cobrir com profundidade e rigor editorial as decisoes, regulamentacoes e debates que moldam o cenario juridico brasileiro.
            </p>
            <p>
              Fundado por jornalistas e juristas, o Veredito nasceu da necessidade de um espaco editorial que combine a precisao tecnica do direito com a clareza e acessibilidade do bom jornalismo.
            </p>
            <h3 className="pt-3 font-display text-[1.45rem] text-foreground">Nossa missao</h3>
            <p>
              Democratizar o acesso a informacao juridica de qualidade, traduzindo decisoes complexas em conteudo compreensivel sem perder o rigor tecnico.
            </p>
            <h3 className="pt-3 font-display text-[1.45rem] text-foreground">Equipe editorial</h3>
            <p>
              Nossa equipe e formada por jornalistas especializados, advogados colaboradores e professores de direito que compartilham o compromisso com a informacao independente e qualificada.
            </p>
          </PublicInstitutionalPanel>
        </div>
      </PublicPageContainer>
    </PublicPageSection>
  );
}

export function ContatoPage() {
  return (
    <PublicPageSection className="pt-8 sm:pt-10">
      <PublicSeo
        title="Contato | Veredito"
        description="Fale com a redação do Veredito para pautas, esclarecimentos e contato institucional."
        path="/contato"
      />
      <PublicPageContainer>
        <div className="mx-auto max-w-2xl">
          <PublicBreadcrumb items={[{ label: "Veredito", to: "/" }, { label: "Contato" }]} />
          <PublicPageTitle title="Contato" subtitle="Entre em contato com a equipe do Veredito." />
          <div className="space-y-5 rounded-[24px] border border-border/80 bg-card/90 p-6 shadow-editorial sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-foreground">Nome</label>
                <input className="h-11 w-full rounded-md border border-input bg-background px-3 text-[13px] text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Seu nome" />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-foreground">E-mail</label>
                <input type="email" className="h-11 w-full rounded-md border border-input bg-background px-3 text-[13px] text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring" placeholder="seu@email.com" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-foreground">Mensagem</label>
              <textarea className="min-h-[144px] w-full resize-none rounded-md border border-input bg-background px-3 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Sua mensagem..." />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[12px] leading-relaxed text-muted-foreground">Resposta editorial e institucional em ate dois dias uteis nesta demonstracao.</p>
              <button className="h-11 rounded-md bg-primary px-6 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                Enviar mensagem
              </button>
            </div>
          </div>
        </div>
      </PublicPageContainer>
    </PublicPageSection>
  );
}

export function NewsletterPublicaPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <PublicPageSection className="pt-8 sm:pt-10">
      <PublicSeo
        title="Newsletter Veredito"
        description="Assine a curadoria semanal do Veredito com decisões, análises e recortes editoriais jurídicos."
        path="/newsletter"
      />
      <PublicPageContainer>
        <PublicBreadcrumb items={[{ label: "Veredito", to: "/" }, { label: "Newsletter" }]} />
        <section className="relative overflow-hidden rounded-[28px] border border-[#ddd5c7]/80 bg-[#f4efe6] px-5 py-12 shadow-editorial lg:px-10 lg:py-16">
          <div className="absolute inset-0 opacity-[0.82]" style={{ backgroundImage: "url('/brand/newsletter_background.png')", backgroundPosition: "center", backgroundSize: "cover", backgroundRepeat: "no-repeat" }} aria-hidden="true" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at center, rgba(255,253,249,0.95) 0%, rgba(255,253,249,0.88) 24%, rgba(255,253,249,0.48) 48%, rgba(244,239,230,0.16) 72%, rgba(244,239,230,0.06) 100%)" }} aria-hidden="true" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,253,249,0.16)_0%,rgba(244,239,230,0.28)_100%)]" aria-hidden="true" />

          <div className="relative mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-bronze/20 bg-background/85 text-bronze shadow-editorial-sm backdrop-blur-[2px]">
              <Mail className="h-7 w-7" strokeWidth={1.25} />
            </div>
            <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.24em] text-bronze">Curadoria editorial</span>
            <h1 className="font-display text-[2rem] leading-tight text-foreground sm:text-[2.35rem] lg:text-[2.85rem]">Newsletter Veredito</h1>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-[1.9] text-muted-foreground sm:text-[16px]">Receba, em uma leitura semanal mais enxuta e criteriosa, decisoes relevantes, analises juridicas e recortes editoriais preparados para quem acompanha o direito com profundidade.</p>
          </div>

          <div className="relative mx-auto mt-10 max-w-2xl rounded-[22px] border border-[#d8cfbf] bg-[rgba(255,253,249,0.9)] p-5 shadow-editorial-lg backdrop-blur-sm sm:p-7">
            <div className="mx-auto max-w-xl">
              <div className="mb-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[12px] text-muted-foreground">
                <span className="font-medium text-foreground">Envio semanal</span>
                <span className="text-[#c3b7a4]">.</span>
                <span>Sem ruido promocional</span>
                <span className="text-[#c3b7a4]">.</span>
                <span>Leitura editorial objetiva</span>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (submitted) setSubmitted(false);
                  }}
                  placeholder="Seu melhor e-mail"
                  className="h-12 flex-1 rounded-md border border-[#d7cebf] bg-background/95 px-4 text-[14px] text-foreground shadow-editorial-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button type="submit" className="h-12 rounded-md bg-primary px-6 text-[14px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-ui sm:min-w-[144px]">
                  Assinar
                </button>
              </form>

              <div className="mt-4 space-y-2 text-center text-[12px] leading-relaxed text-muted-foreground">
                <p>Mais de 1.200 profissionais do direito ja assinam.</p>
                <p>Cancelamento livre, sem alterar sua navegacao no portal.</p>
              </div>

              {submitted ? (
                <p className="mt-3 text-center text-[12px] font-medium text-bronze">
                  Inscricao registrada localmente para demonstracao desta etapa.
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </PublicPageContainer>
    </PublicPageSection>
  );
}

export function PrivacidadePage() {
  return (
    <PublicPageSection className="pt-8 sm:pt-10">
      <PublicSeo
        title="Politica de Privacidade | Veredito"
        description="Entenda como o Veredito trata dados pessoais, newsletter e navegação no portal."
        path="/privacidade"
      />
      <PublicPageContainer>
        <div className="mx-auto max-w-3xl">
          <PublicBreadcrumb items={[{ label: "Veredito", to: "/" }, { label: "Privacidade" }]} />
          <PublicPageTitle eyebrow="Institucional" title="Politica de Privacidade" subtitle="Diretrizes de coleta, tratamento e proteção de dados no ambiente editorial do Veredito." />
          <PublicInstitutionalPanel title="Protecao de dados e uso editorial">
            <p>O Veredito respeita a privacidade de seus leitores e se compromete com a protecao dos dados pessoais.</p>
            <h3 className="pt-3 font-display text-[1.45rem] text-foreground">Dados coletados</h3>
            <p>Coletamos apenas dados necessarios para o funcionamento do servico: e-mail para newsletter, dados de navegacao via analytics e informacoes fornecidas voluntariamente via formularios de contato.</p>
            <h3 className="pt-3 font-display text-[1.45rem] text-foreground">Uso dos dados</h3>
            <p>Os dados sao utilizados exclusivamente para envio de newsletter, melhoria da experiencia de navegacao e comunicacao editorial.</p>
            <h3 className="pt-3 font-display text-[1.45rem] text-foreground">Seus direitos</h3>
            <p>Conforme a LGPD, voce pode solicitar acesso, correcao ou exclusao dos seus dados a qualquer momento pelo e-mail privacidade@veredito.com.br.</p>
          </PublicInstitutionalPanel>
        </div>
      </PublicPageContainer>
    </PublicPageSection>
  );
}

export function TermosPage() {
  return (
    <PublicPageSection className="pt-8 sm:pt-10">
      <PublicSeo
        title="Termos de Uso | Veredito"
        description="Consulte as condições editoriais de uso, reprodução de conteúdo e assinatura da newsletter do Veredito."
        path="/termos"
      />
      <PublicPageContainer>
        <div className="mx-auto max-w-3xl">
          <PublicBreadcrumb items={[{ label: "Veredito", to: "/" }, { label: "Termos" }]} />
          <PublicPageTitle eyebrow="Institucional" title="Termos de Uso" subtitle="Condições editoriais de acesso, leitura, reprodução e uso dos materiais publicados no portal." />
          <PublicInstitutionalPanel title="Condicoes editoriais de uso">
            <p>Ao acessar o portal Veredito, voce concorda com os termos descritos abaixo.</p>
            <h3 className="pt-3 font-display text-[1.45rem] text-foreground">Conteudo editorial</h3>
            <p>Todo o conteudo publicado no Veredito e de propriedade intelectual do portal e de seus autores. A reproducao total ou parcial sem autorizacao expressa e proibida.</p>
            <h3 className="pt-3 font-display text-[1.45rem] text-foreground">Uso informativo</h3>
            <p>O conteudo do Veredito tem carater informativo e educacional. Nao constitui aconselhamento juridico e nao substitui a consulta a um advogado.</p>
            <h3 className="pt-3 font-display text-[1.45rem] text-foreground">Newsletter</h3>
            <p>Ao se inscrever na newsletter, voce autoriza o envio de conteudo editorial por e-mail. Pode cancelar a inscricao a qualquer momento.</p>
          </PublicInstitutionalPanel>
        </div>
      </PublicPageContainer>
    </PublicPageSection>
  );
}
