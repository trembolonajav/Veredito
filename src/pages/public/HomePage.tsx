import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, TrendingUp, User } from "lucide-react";
import { getEditorialEditorias, getHomeZoneConfigByKey, getHomeZones, getMostReadCards, getSiteConfig } from "@/domain/editorial/selectors";
import { type EditorialSnapshot, useEditorialSnapshot } from "@/domain/editorial/store";

function getContentHref(type: string, slug: string) {
  const base = type === "news" ? "noticias" : type === "decision" ? "decisoes" : type === "article" ? "artigos" : "opiniao";
  return `/${base}/${slug}`;
}

export default function HomePage() {
  const snapshot = useEditorialSnapshot();
  return <HomePageContent snapshot={snapshot} />;
}

export function HomePageContent({ snapshot }: { snapshot: EditorialSnapshot }) {
  const zones = getHomeZones(snapshot);
  const headline = zones.find((zone) => zone.key === "headline")?.items[0];
  const secondary = zones.find((zone) => zone.key === "secondary_highlights")?.items ?? [];
  const latestNews = zones.find((zone) => zone.key === "latest_news")?.items ?? [];
  const recentDecisions = zones.find((zone) => zone.key === "recent_decisions")?.items ?? [];
  const articles = zones.find((zone) => zone.key === "articles_analysis")?.items ?? [];
  const opinions = zones.find((zone) => zone.key === "opinion")?.items ?? [];
  const urgentItems = zones.find((zone) => zone.key === "urgent_bar")?.items ?? [];
  const mostRead = getMostReadCards(snapshot);
  const siteConfig = getSiteConfig(snapshot);
  const editoriasZone = getHomeZoneConfigByKey("editorias", snapshot);
  const editorias = getEditorialEditorias(snapshot)
    .filter((item) => item.isFeaturedOnHome)
    .slice(0, editoriasZone?.maxItems ?? 4);
  const newsRail = urgentItems.length > 0 ? urgentItems : latestNews.slice(0, 7);

  if (!headline) return null;

  return (
    <div className="bg-background">
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-8 lg:pr-6 lg:border-r border-border">
            <Link to={getContentHref(headline.type, headline.slug)} className="group block">
              <div className="relative overflow-hidden mb-4">
                <img
                  src={headline.imageUrl}
                  alt={headline.imageAlt || headline.title}
                  className="w-full h-[280px] sm:h-[360px] lg:h-[420px] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  width={1280}
                  height={720}
                />
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="section-label">{headline.editoriaName}</span>
                <span className="w-px h-3 bg-border" />
                <span className="text-[10px] text-muted-foreground font-ui">{headline.publishedLabel}</span>
              </div>
              <h1 className="font-display text-[26px] sm:text-[32px] lg:text-[38px] leading-[1.12] mb-3 group-hover:text-bronze transition-colors duration-300">
                {headline.title}
              </h1>
              <p className="text-[14px] text-muted-foreground leading-relaxed mb-4 max-w-2xl font-ui">
                {headline.summary}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-ui">
                <span className="font-medium text-foreground">{headline.authorName}</span>
                <span className="w-px h-3 bg-border" />
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{headline.readingTimeLabel} de leitura</span>
              </div>
            </Link>

            <div className="mt-6 pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-5">
              {secondary.map((item) => (
                <Link key={item.id} to={getContentHref(item.type, item.slug)} className="group block">
                  <div className="overflow-hidden mb-2.5">
                    <img src={item.imageUrl} alt={item.imageAlt || item.title} className="w-full h-[140px] object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" width={800} height={600} />
                  </div>
                  <span className="section-label text-[9px]">{item.editoriaName}</span>
                  <h3 className="font-display text-[15px] leading-snug mt-1 group-hover:text-bronze transition-colors line-clamp-3">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-ui mt-1.5">{item.authorName} · {item.publishedLabel}</p>
                </Link>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-4 lg:pl-6 mt-8 lg:mt-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-label flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 bg-destructive rounded-full animate-pulse" />
                Ultimas noticias
              </h2>
              <Link to="/noticias" className="text-[10px] text-bronze font-ui editorial-link">Ver todas</Link>
            </div>
            <div className="divider-editorial mb-0" />
            <div className="space-y-0">
              {newsRail.map((item, index) => (
                <Link key={item.id} to={getContentHref(item.type, item.slug)} className="group block py-3.5 border-b border-border last:border-0">
                  <div className="flex gap-3">
                    <span className="text-[10px] text-bronze font-ui font-semibold tabular-nums shrink-0 pt-0.5 w-10">{String(index + 1).padStart(2, "0")}</span>
                    <div className="min-w-0">
                      <h4 className="text-[13px] font-ui font-medium text-foreground leading-snug group-hover:text-bronze transition-colors line-clamp-2">
                        {item.urgentLabel || item.title}
                      </h4>
                      <span className="text-[9px] text-muted-foreground font-ui mt-0.5 block uppercase tracking-wider">{item.editoriaName}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t-2 border-primary">
              <h2 className="section-label flex items-center gap-1.5 mb-3">
                <TrendingUp className="h-3 w-3 text-bronze" />
                Mais lidas
              </h2>
              <div className="space-y-0">
                {mostRead.map((item, index) => (
                  <Link key={item.id} to={getContentHref(item.type, item.slug)} className="group flex gap-3 py-2.5 border-b border-border last:border-0">
                    <span className="font-display text-[24px] leading-none text-bronze/40 shrink-0 w-7 text-right tabular-nums">{index + 1}</span>
                    <h4 className="text-[12px] font-ui font-medium text-foreground leading-snug group-hover:text-bronze transition-colors line-clamp-2 pt-0.5">{item.title}</h4>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t-2 border-primary bg-card">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-label">Decisoes recentes</h2>
            <Link to="/decisoes" className="text-[10px] text-bronze font-ui editorial-link flex items-center gap-1">
              Todas as decisoes <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
            {recentDecisions.map((item, index) => (
              <Link
                key={item.id}
                to={getContentHref(item.type, item.slug)}
                className={`group block py-4 px-4 first:pl-0 last:pr-0 ${index < recentDecisions.length - 1 ? "lg:border-r border-border" : ""}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block text-[10px] font-bold font-ui text-primary-foreground bg-primary px-1.5 py-0.5 tracking-wider">
                    {item.decisionMeta?.court}
                  </span>
                  <span className={`text-[9px] font-ui font-medium px-1.5 py-0.5 ${item.decisionMeta?.practicalImpact === "Alto" ? "text-destructive bg-destructive/8" : "text-muted-foreground bg-muted"}`}>
                    {item.decisionMeta?.practicalImpact || "Medio"}
                  </span>
                </div>
                <h3 className="font-display text-[15px] leading-snug group-hover:text-bronze transition-colors line-clamp-3">
                  {item.title}
                </h3>
                <p className="text-[10px] text-muted-foreground font-ui mt-2">{item.decisionMeta?.judgmentDate || item.publishedLabel}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-8 lg:pr-6 lg:border-r border-border">
              <div className="flex items-center justify-between mb-1">
                <h2 className="section-label">Artigos & Analises</h2>
                <Link to="/artigos" className="text-[10px] text-bronze font-ui editorial-link flex items-center gap-1">Ver todos <ArrowRight className="h-3 w-3" /></Link>
              </div>
              <div className="divider-editorial mb-6" />

              {articles[0] && (
                <Link to={getContentHref(articles[0].type, articles[0].slug)} className="group block mb-6">
                  <div className="sm:flex gap-5">
                    <div className="overflow-hidden w-full sm:w-60 shrink-0 mb-3 sm:mb-0">
                      <img src={articles[0].imageUrl} alt={articles[0].imageAlt || articles[0].title} className="w-full h-40 sm:h-36 object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" width={800} height={600} />
                    </div>
                    <div>
                      <span className="section-label text-[9px]">Artigo</span>
                      <h3 className="font-display text-[22px] leading-tight mt-1 group-hover:text-bronze transition-colors">{articles[0].title}</h3>
                      <p className="text-[12px] text-muted-foreground font-ui mt-2">{articles[0].authorName} · {articles[0].readingTimeLabel} de leitura</p>
                    </div>
                  </div>
                </Link>
              )}

              <div className="border-t border-border pt-4 space-y-0">
                {articles.slice(1).map((item) => (
                  <Link key={item.id} to={getContentHref(item.type, item.slug)} className="group flex items-start gap-4 py-3.5 border-b border-border last:border-0">
                    <div className="overflow-hidden w-16 h-16 shrink-0">
                      <img src={item.imageUrl} alt={item.imageAlt || item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" width={800} height={600} />
                    </div>
                    <div>
                      <h4 className="font-display text-[15px] leading-snug group-hover:text-bronze transition-colors">{item.title}</h4>
                      <p className="text-[10px] text-muted-foreground font-ui mt-1">{item.authorName} · {item.readingTimeLabel}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <aside className="lg:col-span-4 lg:pl-6 mt-8 lg:mt-0">
              <div className="flex items-center justify-between mb-1">
                <h2 className="section-label">Opiniao</h2>
                <Link to="/opiniao" className="text-[10px] text-bronze font-ui editorial-link">Ver todas</Link>
              </div>
              <div className="divider-editorial mb-4" />
              {opinions.map((item) => (
                <Link key={item.id} to={getContentHref(item.type, item.slug)} className="group block py-3.5 border-b border-border last:border-0">
                  <h4 className="font-display text-[15px] italic leading-snug group-hover:text-bronze transition-colors line-clamp-2">
                    "{item.title}"
                  </h4>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <div>
                      <span className="text-[11px] font-ui font-semibold text-foreground">{item.authorName}</span>
                      <span className="text-[10px] text-bronze font-ui ml-1">· {item.editoriaName}</span>
                    </div>
                  </div>
                </Link>
              ))}

              {siteConfig.homeNewsletterEnabled !== false && <div className="mt-6 bg-primary p-5">
                <p className="section-label !text-bronze-foreground mb-2">Curadoria editorial</p>
                <h3 className="font-display text-[18px] text-primary-foreground leading-tight mb-2">Receba o que importa, sem ruido.</h3>
                <p className="text-[10px] text-primary-foreground/40 font-ui mb-3 leading-relaxed">Todo domingo: decisoes, analises e panorama juridico.</p>
                <div className="flex gap-1.5">
                  <input type="email" placeholder="Seu e-mail" className="h-8 flex-1 bg-transparent border border-primary-foreground/15 px-2.5 text-[11px] text-primary-foreground placeholder:text-primary-foreground/25 focus:outline-none focus:border-bronze/50 transition-colors font-ui" />
                  <button className="h-8 bg-bronze px-3 text-[10px] font-bold text-bronze-foreground font-ui uppercase tracking-wider hover:bg-bronze/90 transition-colors">OK</button>
                </div>
              </div>}
            </aside>
          </div>
        </div>
      </section>

      <section className="border-t-2 border-primary">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
          <h2 className="section-label mb-1">Editorias</h2>
          <div className="divider-editorial mb-6" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
            {editorias.map((item, index) => (
              <Link key={item.id} to={`/editoria/${item.slug}`} className={`group block py-4 px-5 first:pl-0 last:pr-0 ${index < editorias.length - 1 ? "lg:border-r border-border" : ""}`}>
                <h3 className="font-display text-[18px] group-hover:text-bronze transition-colors">{item.name}</h3>
                <p className="text-[11px] text-muted-foreground font-ui mt-1 leading-relaxed line-clamp-2">{item.description}</p>
                <span className="text-[10px] text-bronze font-ui mt-2 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Explorar <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {siteConfig.homeNewsletterEnabled !== false && <section className="bg-primary relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-14 lg:py-18 relative">
          <div className="max-w-xl mx-auto text-center">
            <p className="section-label !text-bronze-foreground mb-3">{siteConfig.newsletterLabel}</p>
            <h2 className="font-display text-[28px] lg:text-[36px] text-primary-foreground leading-tight mb-3">
              Receba o que importa,<br className="hidden sm:block" /> sem ruido.
            </h2>
            <p className="text-[13px] text-primary-foreground/45 font-ui mb-6 leading-relaxed">
              Todo domingo pela manha: as decisoes mais relevantes, analises exclusivas e o panorama juridico da semana.
            </p>
            <div className="flex gap-2 max-w-sm mx-auto">
              <input type="email" placeholder="seu@email.com" className="h-10 flex-1 bg-transparent border border-primary-foreground/15 px-3 text-[13px] text-primary-foreground placeholder:text-primary-foreground/25 focus:outline-none focus:border-bronze/50 transition-colors font-ui" />
              <button className="h-10 bg-bronze px-5 text-[11px] font-bold text-bronze-foreground hover:bg-bronze/90 transition-colors font-ui uppercase tracking-[0.1em]">Assinar</button>
            </div>
            <p className="text-[10px] text-primary-foreground/25 font-ui mt-3">Gratuita · Sem spam · Cancele quando quiser</p>
          </div>
        </div>
      </section>}
    </div>
  );
}
