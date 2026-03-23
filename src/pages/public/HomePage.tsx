import React from "react";
import {
  EditorialCollectionBlock,
  EditorialListItem,
  EditorialMostRead,
  EditorialNewsletterPanel,
  EditorialSectionHeader,
  PublicDivider,
  PublicEmptyState,
  PublicHeroSplit,
  PublicPageContainer,
  PublicPageSection,
  PublicSectionShell,
} from "@/components/public/PublicEditorial";
import { PublicSeo } from "@/components/public/PublicSeo";
import { usePublicEditorialData } from "./public-content";

export default function HomePage() {
  const {
    artigos,
    decisoes,
    homeEditorialSections,
    homeHighlights,
    homeManchete,
    latestPublications,
    mostReadItems,
    noticias,
    opinioes,
  } = usePublicEditorialData();

  return (
    <div className="pb-2">
      <PublicSeo
        title="Veredito | Jornal jurídico editorial premium"
        description="Portal jurídico com notícias, decisões, artigos e opinião em leitura editorial premium, clara e sóbria."
        path="/"
      />

      <PublicPageSection className="pt-8 sm:pt-10">
        <PublicPageContainer>
          {homeManchete ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-3 border-b border-border/80 pb-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-bronze">
                    Edicao principal
                  </span>
                  <h1 className="font-display text-[2.2rem] leading-[1.02] tracking-[-0.035em] text-foreground sm:text-[2.8rem] lg:text-[3.35rem]">
                    Leitura jurídica com contexto, rigor editorial e hierarquia de jornal.
                  </h1>
                </div>
                <p className="max-w-xl text-[14px] leading-[1.85] text-muted-foreground lg:pb-1">
                  A home organiza a manchete, os recortes laterais e os cadernos editoriais em uma entrada pública mais madura, sem perder sobriedade.
                </p>
              </div>

              <PublicHeroSplit
                featured={homeManchete}
                railEyebrow="Recortes"
                railTitle="Destaques da edicao"
                railDescription="Uma leitura lateral mais curta, com analises, opiniao e fatos que ampliam o contexto juridico."
                railItems={homeHighlights}
              />
            </div>
          ) : (
            <PublicEmptyState
              title="Portal em atualizacao"
              description="Ainda nao ha conteudos publicados suficientes para compor a home publica demonstrativa."
              actionLabel="Ir para a newsletter"
              actionTo="/newsletter"
            />
          )}
        </PublicPageContainer>
      </PublicPageSection>

      <PublicPageContainer>
        <PublicDivider />
      </PublicPageContainer>

      <PublicPageSection>
        <PublicPageContainer>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,0.8fr)] lg:gap-12">
            <div>
              <EditorialSectionHeader
                eyebrow="Fluxo continuo"
                title="Ultimas publicacoes"
                description="Noticias, decisoes, artigos e opiniao organizados em uma leitura publica consistente."
                actionTo="/noticias"
              />
              <div className="space-y-5">
                {latestPublications.length ? latestPublications.map((item) => (
                  <div key={item.slug} className="border-b border-border/70 pb-5 last:border-b-0 last:pb-0">
                    <EditorialListItem item={item} />
                  </div>
                )) : (
                  <PublicEmptyState
                    title="Nenhuma publicacao disponivel"
                    description="A base editorial do admin ainda nao possui conteudos publicados para esta secao."
                    actionLabel="Explorar newsletter"
                    actionTo="/newsletter"
                  />
                )}
              </div>
            </div>

            <aside className="space-y-6">
              <EditorialMostRead title="Mais lidas" items={mostReadItems} />
              <EditorialNewsletterPanel />
            </aside>
          </div>
        </PublicPageContainer>
      </PublicPageSection>

      <PublicPageSection className="pt-0">
        <PublicPageContainer>
          <PublicSectionShell tone="warm" className="p-6 sm:p-8">
            <div className="grid gap-10 xl:grid-cols-2">
              <EditorialCollectionBlock
                eyebrow="Cobertura"
                title="Noticias em destaque"
                description="Fatos, regulamentacoes e movimentacoes do ambiente juridico em leitura objetiva."
                actionTo="/noticias"
                items={noticias.slice(0, 4)}
                columns={2}
              />
              <EditorialCollectionBlock
                eyebrow="Jurisprudencia"
                title="Decisoes em foco"
                description="Precedentes e julgados com impacto pratico para leitores tecnicos."
                actionTo="/decisoes"
                items={decisoes.slice(0, 4)}
                columns={2}
              />
            </div>
          </PublicSectionShell>
        </PublicPageContainer>
      </PublicPageSection>

      <PublicPageSection className="pt-0">
        <PublicPageContainer>
          <div className="grid gap-10 xl:grid-cols-2">
            <EditorialCollectionBlock
              eyebrow="Analise"
              title="Artigos"
              description="Textos analiticos e leituras aprofundadas sobre transformacoes juridicas em curso."
              actionTo="/artigos"
              items={artigos.slice(0, 3)}
              columns={2}
            />
            <EditorialCollectionBlock
              eyebrow="Colunas"
              title="Opiniao"
              description="Posicionamentos editoriais e reflexoes de autores convidados, com linguagem institucional e sobria."
              actionTo="/opiniao"
              items={opinioes.slice(0, 3)}
              columns={2}
            />
          </div>
        </PublicPageContainer>
      </PublicPageSection>

      <PublicPageSection className="pt-0">
        <PublicPageContainer>
          <EditorialSectionHeader
            eyebrow="Editorias em foco"
            title="Cadernos editoriais do portal"
            description="A camada publica principal organiza editorias como secoes curatoriais do jornal, e nao como arquivos neutros."
          />
          <div className="space-y-12">
            {homeEditorialSections.length ? homeEditorialSections.map((section) => (
              <section key={section.title} className="border-b border-border/70 pb-12 last:border-b-0 last:pb-0">
                <PublicHeroSplit
                  featured={section.featured}
                  railEyebrow={section.eyebrow}
                  railTitle={section.title}
                  railDescription={section.description}
                  railItems={section.items}
                  className="lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
                />
              </section>
            )) : (
              <PublicEmptyState
                title="Editorias em preparacao"
                description="As secoes editoriais publicas serao preenchidas assim que houver publicacoes suficientes por editoria."
                actionLabel="Ver noticias"
                actionTo="/noticias"
              />
            )}
          </div>
        </PublicPageContainer>
      </PublicPageSection>
    </div>
  );
}
