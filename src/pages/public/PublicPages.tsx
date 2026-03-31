import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, ChevronRight, Clock, Mail, Search, User } from "lucide-react";
import {
  getAuthorPageBySlug,
  getCardsByEditoriaSlug,
  getCardsByType,
  getContentPageBySlug,
  getEditorialEditorias,
  getSiteConfig,
} from "@/domain/editorial/selectors";
import type { PublicAuthorPageVM, PublicContentCardVM } from "@/domain/editorial/types";
import { useEditorialSnapshot } from "@/domain/editorial/store";

function getContentHref(type: string, slug: string) {
  const base = type === "news" ? "noticias" : type === "decision" ? "decisoes" : type === "article" ? "artigos" : "opiniao";
  return `/${base}/${slug}`;
}

function getTypeLabel(type: string) {
  return type === "news" ? "Noticia" : type === "decision" ? "Decisao" : type === "article" ? "Artigo" : "Opiniao";
}

function EditorialListingPage({ titulo, descricao, items }: { titulo: string; descricao: string; items: PublicContentCardVM[] }) {
  const destaque = items[0];
  const restantes = items.slice(1);
  const snapshot = useEditorialSnapshot();
  const editorias = getEditorialEditorias(snapshot).filter((item) => item.isVisibleInNavigation);
  const siteConfig = getSiteConfig(snapshot);

  return (
    <div className="bg-background">
      <div className="border-b-2 border-primary">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="font-display text-[34px] lg:text-[42px] leading-none">{titulo}</h1>
              <p className="text-[13px] text-muted-foreground font-ui mt-2 max-w-lg">{descricao}</p>
            </div>
            <span className="hidden sm:block text-[10px] text-muted-foreground font-ui">
              {new Date("2026-03-29").toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-8 lg:pr-6 lg:border-r border-border">
            {destaque && (
              <Link to={getContentHref(destaque.type, destaque.slug)} className="group block mb-8">
                <div className="overflow-hidden mb-4">
                  <img src={destaque.imageUrl} alt={destaque.imageAlt || destaque.title} className="w-full h-[220px] sm:h-[300px] object-cover transition-transform duration-500 group-hover:scale-[1.02]" loading="lazy" width={800} height={600} />
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="section-label text-[9px]">{destaque.editoriaName}</span>
                  {destaque.decisionMeta?.court && <span className="inline-block text-[10px] font-bold font-ui text-primary-foreground bg-primary px-1.5 py-0.5 tracking-wider">{destaque.decisionMeta.court}</span>}
                  <span className="text-[9px] font-ui font-medium px-1.5 py-0.5 bg-muted text-muted-foreground">{getTypeLabel(destaque.type)}</span>
                </div>
                <h2 className="font-display text-[24px] lg:text-[30px] leading-tight group-hover:text-bronze transition-colors">{destaque.title}</h2>
                {destaque.summary && <p className="text-[13px] text-muted-foreground font-ui mt-2 leading-relaxed line-clamp-2">{destaque.summary}</p>}
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-ui mt-3">
                  <span className="font-medium text-foreground">{destaque.authorName}</span>
                  <span className="w-px h-3 bg-border" />
                  <span>{destaque.publishedLabel}</span>
                  {destaque.readingTimeLabel && (
                    <>
                      <span className="w-px h-3 bg-border" />
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{destaque.readingTimeLabel}</span>
                    </>
                  )}
                </div>
              </Link>
            )}

            <div className="space-y-0">
              {restantes.map((item) => (
                <Link key={item.id} to={getContentHref(item.type, item.slug)} className="group flex gap-4 py-4 border-t border-border">
                  <div className="overflow-hidden w-24 h-20 sm:w-28 sm:h-24 shrink-0">
                    <img src={item.imageUrl} alt={item.imageAlt || item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" width={800} height={600} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="section-label text-[9px]">{item.editoriaName}</span>
                      {item.decisionMeta?.court && <span className="text-[9px] font-bold font-ui text-primary-foreground bg-primary px-1 py-0.5 tracking-wider">{item.decisionMeta.court}</span>}
                      <span className="text-[9px] font-ui font-medium px-1 py-0.5 bg-muted text-muted-foreground">{getTypeLabel(item.type)}</span>
                    </div>
                    <h3 className="font-display text-[16px] leading-snug group-hover:text-bronze transition-colors line-clamp-2">{item.title}</h3>
                    {item.summary && <p className="text-[11px] text-muted-foreground font-ui mt-1 line-clamp-1 hidden sm:block">{item.summary}</p>}
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-ui mt-1.5">
                      <span className="font-medium text-foreground">{item.authorName}</span>
                      <span className="w-px h-3 bg-border" />
                      <span>{item.publishedLabel}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-4 lg:pl-6 mt-8 lg:mt-0">
            <div className="bg-primary p-5 mb-6">
              <p className="section-label !text-bronze-foreground mb-2">Newsletter</p>
              <h3 className="font-display text-[18px] text-primary-foreground mb-2">{siteConfig.newsletterLabel}</h3>
              <p className="text-[11px] text-primary-foreground/45 font-ui mb-3 leading-relaxed">As decisoes mais relevantes, direto na sua caixa de entrada.</p>
              <div className="flex gap-1.5">
                <input type="email" placeholder="Seu e-mail" className="h-8 flex-1 bg-transparent border border-primary-foreground/15 px-2.5 text-[11px] text-primary-foreground placeholder:text-primary-foreground/25 focus:outline-none font-ui" />
                <button className="h-8 bg-bronze px-3 text-[10px] font-bold text-bronze-foreground font-ui uppercase tracking-wider hover:bg-bronze/90 transition-colors">OK</button>
              </div>
            </div>

            <h3 className="section-label mb-1">Editorias</h3>
            <div className="divider-editorial mb-3" />
            {editorias.map((item) => (
              <Link key={item.id} to={`/editoria/${item.slug}`} className="flex items-center justify-between py-2.5 border-b border-border text-[12px] font-ui text-foreground hover:text-bronze transition-colors group">
                {item.name}
                <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-bronze transition-colors" />
              </Link>
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
}

export function NoticiasListPage() {
  const snapshot = useEditorialSnapshot();
  return <EditorialListingPage titulo="Noticias" descricao="Cobertura diaria do cenario juridico brasileiro com rigor editorial e profundidade analitica." items={getCardsByType("news", snapshot)} />;
}

export function DecisoesListPage() {
  const snapshot = useEditorialSnapshot();
  return <EditorialListingPage titulo="Decisoes" descricao="Acompanhamento das decisoes mais relevantes dos tribunais superiores e cortes regionais." items={getCardsByType("decision", snapshot)} />;
}

export function ArtigosListPage() {
  const snapshot = useEditorialSnapshot();
  return <EditorialListingPage titulo="Artigos & Analises" descricao="Analises aprofundadas e reflexoes de especialistas sobre temas juridicos contemporaneos." items={getCardsByType("article", snapshot)} />;
}

export function OpinioesListPage() {
  const snapshot = useEditorialSnapshot();
  return <EditorialListingPage titulo="Opiniao" descricao="Colunas e posicionamentos de juristas, academicos e profissionais do direito." items={getCardsByType("opinion", snapshot)} />;
}

export function ConteudoPublicoPage() {
  const { slug, tipo } = useParams();
  const snapshot = useEditorialSnapshot();
  const page = slug ? getContentPageBySlug(slug, snapshot) : null;

  if (!page) return null;

  return (
    <div className="bg-background">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
        <nav className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-ui mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">Inicio</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={`/${tipo}`} className="hover:text-foreground transition-colors capitalize">{tipo}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground truncate max-w-[200px]">{page.content.title.substring(0, 40)}...</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <article className="lg:col-span-8 lg:pr-8 lg:border-r border-border">
            <div className="flex items-center gap-2 mb-3">
              <span className="section-label">{page.content.editoriaName}</span>
              {page.content.decisionMeta?.court && <span className="inline-block text-[10px] font-bold font-ui text-primary-foreground bg-primary px-1.5 py-0.5 tracking-wider">{page.content.decisionMeta.court}</span>}
              <span className="section-label">{getTypeLabel(page.content.type)}</span>
            </div>

            <h1 className="font-display text-[28px] sm:text-[34px] lg:text-[40px] leading-[1.12] mb-4">{page.content.title}</h1>
            {page.content.subtitle && <p className="text-[16px] text-muted-foreground leading-relaxed mb-5 font-ui">{page.content.subtitle}</p>}
            {page.content.lead && <p className="text-[15px] text-muted-foreground leading-relaxed mb-5 font-ui border-l-2 border-bronze pl-4">{page.content.lead}</p>}

            <div className="flex items-center gap-3 pb-5 mb-6 border-b border-border">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <span className="text-[12px] font-ui font-semibold text-foreground">{page.content.authorName}</span>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-ui">
                  <span>{page.author.role}</span><span>·</span>
                  <span>{page.content.publishedLabel}</span><span>·</span>
                  {page.content.readingTimeLabel && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{page.content.readingTimeLabel} de leitura</span>}
                </div>
              </div>
            </div>

            {page.content.imageUrl && (
              <div className="overflow-hidden mb-8">
                <img src={page.content.imageUrl} alt={page.content.imageAlt || page.content.title} className="w-full h-[240px] sm:h-[360px] object-cover" width={800} height={600} />
              </div>
            )}

            <div className="max-w-[680px] mx-auto">
              <div className="text-[16px] text-foreground leading-[1.8] font-ui space-y-5">
                {page.content.body.split("\n\n").map((paragraph, index) => (
                  <p key={index} className={index === 0 ? "drop-cap" : ""}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="max-w-[680px] mx-auto mt-10 pt-6 border-t border-border">
              <p className="section-label mb-3">Temas relacionados</p>
              <div className="flex flex-wrap gap-2">
                {page.content.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-ui text-muted-foreground border border-border px-2 py-1 hover:text-foreground hover:border-foreground/30 transition-colors cursor-pointer">{tag}</span>
                ))}
              </div>
            </div>

            <div className="max-w-[680px] mx-auto mt-8 p-5 bg-card border border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-[13px] font-ui font-semibold text-foreground">{page.content.authorName}</p>
                  <p className="text-[11px] text-muted-foreground font-ui mt-0.5">{page.author.shortBio}</p>
                  <Link to={page.author.isPublicPageEnabled ? `/autores/${page.author.slug}` : "/sobre"} className="text-[10px] text-bronze font-ui mt-2 inline-flex items-center gap-1 editorial-link">
                    Ver perfil <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </article>

          <aside className="lg:col-span-4 lg:pl-6 mt-8 lg:mt-0">
            <h3 className="section-label mb-1">Leia tambem</h3>
            <div className="divider-editorial mb-4" />
            {page.related.map((item) => (
              <Link key={item.id} to={getContentHref(item.type, item.slug)} className="group block py-3 border-b border-border last:border-0">
                <h4 className="font-display text-[14px] leading-snug group-hover:text-bronze transition-colors line-clamp-2">{item.title}</h4>
                <p className="text-[10px] text-muted-foreground font-ui mt-1">{item.publishedLabel}</p>
              </Link>
            ))}

            <div className="bg-primary p-5 mt-6">
              <p className="section-label !text-bronze-foreground mb-2">Newsletter</p>
              <h4 className="font-display text-[16px] text-primary-foreground mb-2">Curadoria semanal</h4>
              <p className="text-[10px] text-primary-foreground/40 font-ui mb-3">Todo domingo na sua caixa de entrada.</p>
              <div className="flex gap-1.5">
                <input type="email" placeholder="Seu e-mail" className="h-8 flex-1 bg-transparent border border-primary-foreground/15 px-2.5 text-[10px] text-primary-foreground placeholder:text-primary-foreground/25 focus:outline-none font-ui" />
                <button className="h-8 bg-bronze px-3 text-[9px] font-bold text-bronze-foreground font-ui uppercase tracking-wider hover:bg-bronze/90 transition-colors">OK</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export function EditoriaPublicaPage() {
  const { slug } = useParams();
  const snapshot = useEditorialSnapshot();
  const editoria = getEditorialEditorias(snapshot).find((item) => item.slug === slug);
  const items = getCardsByEditoriaSlug(slug, snapshot);
  const titulo = editoria?.name || slug || "Editoria";
  const descricao = [editoria?.longDescription || editoria?.description || "", editoria?.editorResponsible ? `Editor responsavel: ${editoria.editorResponsible}.` : ""].filter(Boolean).join(" ");
  return <EditorialListingPage titulo={titulo} descricao={descricao} items={items} />;
}

function AuthorPublicPageLayout({ page }: { page: PublicAuthorPageVM }) {
  return (
    <div className="bg-background">
      <div className="border-b-2 border-primary">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
          <p className="section-label mb-3">Autor</p>
          <h1 className="font-display text-[32px] lg:text-[42px]">{page.author.publicName}</h1>
          <p className="text-[13px] text-muted-foreground font-ui mt-2 max-w-2xl">{page.author.jobTitle || page.author.role}</p>
          <p className="text-[14px] text-muted-foreground font-ui mt-4 max-w-3xl leading-relaxed">
            {page.author.longBio || page.author.shortBio}
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-8 lg:pr-6 lg:border-r border-border">
            <h2 className="font-display text-[22px] mb-4">Conteudos publicados</h2>
            <div className="space-y-0">
              {page.contents.map((item) => (
                <Link key={item.id} to={getContentHref(item.type, item.slug)} className="group flex gap-4 py-4 border-t border-border first:border-t-0">
                  <div className="overflow-hidden w-24 h-20 sm:w-28 sm:h-24 shrink-0">
                    <img src={item.imageUrl} alt={item.imageAlt || item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" width={800} height={600} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="section-label text-[9px]">{item.editoriaName}</span>
                      <span className="text-[9px] font-ui font-medium px-1 py-0.5 bg-muted text-muted-foreground">{getTypeLabel(item.type)}</span>
                    </div>
                    <h3 className="font-display text-[16px] leading-snug group-hover:text-bronze transition-colors line-clamp-2">{item.title}</h3>
                    {item.summary && <p className="text-[11px] text-muted-foreground font-ui mt-1 hidden sm:block">{item.summary}</p>}
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-ui mt-1.5">
                      <span>{item.publishedLabel}</span>
                      {item.readingTimeLabel && (
                        <>
                          <span className="w-px h-3 bg-border" />
                          <span>{item.readingTimeLabel}</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-4 lg:pl-6 mt-8 lg:mt-0">
            <div className="rounded-lg bg-card p-5 border border-border">
              <p className="section-label mb-2">Perfil</p>
              <p className="text-[13px] text-foreground font-ui">{page.author.shortBio}</p>
              <p className="text-[11px] text-muted-foreground font-ui mt-3">Publicacoes: {page.contents.length}</p>
              {page.author.specialty && <p className="text-[11px] text-muted-foreground font-ui mt-3">Especialidade: {page.author.specialty}</p>}
              {page.author.socialLinkedin && <a href={page.author.socialLinkedin} className="text-[11px] text-bronze font-ui mt-3 inline-block">LinkedIn</a>}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export function AutorPublicoPage() {
  const { slug } = useParams();
  const snapshot = useEditorialSnapshot();
  const page = slug ? getAuthorPageBySlug(slug, snapshot) : null;

  if (!page) return null;

  return <AuthorPublicPageLayout page={page} />;
}

export function BuscaPage() {
  const snapshot = useEditorialSnapshot();
  const allItems = [
    ...getCardsByType("news", snapshot),
    ...getCardsByType("decision", snapshot),
    ...getCardsByType("article", snapshot),
    ...getCardsByType("opinion", snapshot),
  ];

  return (
    <div className="bg-background min-h-[60vh]">
      <div className="border-b-2 border-primary">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
          <h1 className="font-display text-[32px] lg:text-[40px] mb-4">Busca</h1>
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
            <input type="text" placeholder="Buscar noticias, decisoes, artigos..." autoFocus className="h-11 w-full border-b-2 border-primary bg-transparent pl-10 pr-4 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none font-ui" />
          </div>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
        <p className="text-[12px] text-muted-foreground font-ui mb-6">Mostrando resultados editoriais mais recentes.</p>
        <div className="space-y-0 max-w-3xl">
          {allItems.slice(0, 6).map((item) => (
            <Link key={item.id} to={getContentHref(item.type, item.slug)} className="group flex gap-4 py-4 border-b border-border">
              <div className="overflow-hidden w-20 h-16 shrink-0">
                <img src={item.imageUrl} alt={item.imageAlt || item.title} className="w-full h-full object-cover" loading="lazy" width={400} height={300} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="section-label text-[9px]">{item.editoriaName}</span>
                  {item.decisionMeta?.court && <span className="text-[9px] font-bold font-ui text-primary-foreground bg-primary px-1 py-0.5 tracking-wider">{item.decisionMeta.court}</span>}
                </div>
                <h3 className="font-display text-[15px] leading-snug group-hover:text-bronze transition-colors line-clamp-1">{item.title}</h3>
                <p className="text-[10px] text-muted-foreground font-ui mt-1">{item.publishedLabel} · {item.readingTimeLabel}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function InstitutionalPage({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="bg-background">
      <div className="border-b-2 border-primary">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
          <h1 className="font-display text-[32px] lg:text-[40px]">{titulo}</h1>
        </div>
      </div>
      <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-10">{children}</div>
    </div>
  );
}

export function SobrePage() {
  const snapshot = useEditorialSnapshot();
  const siteConfig = getSiteConfig(snapshot);
  return (
    <InstitutionalPage titulo={`Sobre o ${siteConfig.siteName}`}>
      <div className="space-y-5 text-[15px] text-foreground leading-[1.8] font-ui">
        <p className="drop-cap">{siteConfig.siteName} e uma publicacao editorial juridica independente, dedicada a cobrir com profundidade e rigor as decisoes, debates e transformacoes que moldam o cenario juridico brasileiro.</p>
        <p>O projeto combina analise tecnica com linguagem clara, servindo advogados, juizes, academicos e leitores interessados no funcionamento da Justica.</p>
      </div>
    </InstitutionalPage>
  );
}

export function ContatoPage() {
  return (
    <InstitutionalPage titulo="Contato">
      <div className="space-y-5 text-[15px] text-foreground leading-[1.8] font-ui">
        {[
          { t: "Redacao", e: "redacao@veredito.com.br" },
          { t: "Comercial", e: "comercial@veredito.com.br" },
          { t: "Sugestoes de pauta", e: "pautas@veredito.com.br" },
        ].map((c) => (
          <div key={c.t} className="flex items-center gap-3 py-3 border-b border-border text-[13px]">
            <Mail className="h-4 w-4 text-bronze" />
            <div><p className="font-medium">{c.t}</p><p className="text-muted-foreground">{c.e}</p></div>
          </div>
        ))}
      </div>
    </InstitutionalPage>
  );
}

export function NewsletterPublicaPage() {
  const snapshot = useEditorialSnapshot();
  const siteConfig = getSiteConfig(snapshot);
  return (
    <div className="bg-background">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 lg:py-20">
        <div className="max-w-xl mx-auto text-center">
          <p className="section-label mb-4">{siteConfig.newsletterLabel}</p>
          <h1 className="font-display text-[32px] lg:text-[42px] leading-tight mb-4">Curadoria juridica semanal, sem ruido.</h1>
          <p className="text-[14px] text-muted-foreground font-ui leading-relaxed mb-8 max-w-md mx-auto">Todo domingo pela manha: decisoes relevantes, analises exclusivas e o panorama do cenario juridico brasileiro.</p>
          <div className="flex gap-2 max-w-sm mx-auto mb-4">
            <input type="email" placeholder="seu@email.com" className="h-11 flex-1 border border-border bg-transparent px-4 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors font-ui" />
            <button className="h-11 bg-primary px-6 text-[11px] font-bold text-primary-foreground hover:bg-primary/90 transition-colors font-ui uppercase tracking-[0.1em]">Assinar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PrivacidadePage() {
  return (
    <InstitutionalPage titulo="Politica de Privacidade">
      <div className="space-y-4 text-[14px] text-foreground leading-[1.8] font-ui">
        <p>Ultima atualizacao: 24 de marco de 2026</p>
        <p>O Veredito respeita a privacidade dos leitores e esta comprometido com a protecao dos dados pessoais, em conformidade com a LGPD.</p>
      </div>
    </InstitutionalPage>
  );
}

export function TermosPage() {
  return (
    <InstitutionalPage titulo="Termos de Uso">
      <div className="space-y-4 text-[14px] text-foreground leading-[1.8] font-ui">
        <p>Ultima atualizacao: 24 de marco de 2026</p>
        <p>Todo o conteudo publicado tem carater exclusivamente informativo e editorial.</p>
      </div>
    </InstitutionalPage>
  );
}
