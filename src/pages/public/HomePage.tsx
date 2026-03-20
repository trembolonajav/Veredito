import React from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Mock data ────────────────────────────────── */

const manchete = {
  slug: "stf-suspende-icms",
  type: "Decisão",
  editoria: "Tributário",
  title: "STF suspende efeitos de lei estadual sobre ICMS — decisão impacta 12 estados",
  lead: "O Supremo Tribunal Federal decidiu, por maioria de votos, suspender os efeitos de lei estadual que concedia benefícios fiscais de ICMS sem aprovação do CONFAZ.",
  author: "Ana Beatriz Duarte",
  date: "20 mar 2026",
  readTime: "8 min",
  image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
};

const destaques = [
  { slug: "reforma-tributaria", type: "Artigo", editoria: "Tributário", title: "Impacto da reforma tributária nos escritórios de advocacia", author: "Dra. Fernanda Lima", date: "19 mar 2026", readTime: "12 min", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80" },
  { slug: "direito-sucessorio-digital", type: "Opinião", editoria: "Sucessório", title: "O futuro do direito sucessório digital: desafios e oportunidades", author: "Prof. Ricardo Alves", date: "19 mar 2026", readTime: "6 min", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80" },
  { slug: "marco-legal-garantias", type: "Notícia", editoria: "Empresarial", title: "Novo marco legal das garantias entra em vigor e altera regras do crédito", author: "Carlos Mendes", date: "18 mar 2026", readTime: "5 min", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
];

const ultimasNoticias = [
  { slug: "tst-trabalho-remoto", type: "Decisão", editoria: "Trabalhista", title: "TST define nova súmula sobre trabalho remoto e jornada flexível", author: "Mariana Costa", date: "21 mar 2026", readTime: "7 min" },
  { slug: "compliance-startups", type: "Artigo", editoria: "Empresarial", title: "Análise: compliance nas startups brasileiras — o que muda com a nova regulamentação", author: "João Pedro Silva", date: "20 mar 2026", readTime: "10 min" },
  { slug: "lei-inquilinato", type: "Notícia", editoria: "Imobiliário", title: "Alterações na lei do inquilinato são aprovadas pelo Senado", author: "Carlos Mendes", date: "20 mar 2026", readTime: "4 min" },
  { slug: "lgpd-decisoes", type: "Decisão", editoria: "Constitucional", title: "ANPD aplica multa recorde por descumprimento da LGPD", author: "Ana Beatriz Duarte", date: "19 mar 2026", readTime: "6 min" },
  { slug: "heranca-digital", type: "Opinião", editoria: "Sucessório", title: "Herança digital: o direito ainda não está preparado para o metaverso", author: "Prof. Ricardo Alves", date: "19 mar 2026", readTime: "8 min" },
];

const maisLidos = [
  { position: 1, title: "STF suspende efeitos de lei estadual sobre ICMS", views: "2.342" },
  { position: 2, title: "Novo marco legal das garantias entra em vigor", views: "2.105" },
  { position: 3, title: "Impacto da reforma tributária nos escritórios", views: "1.284" },
  { position: 4, title: "O futuro do direito sucessório digital", views: "876" },
  { position: 5, title: "TST define nova súmula sobre trabalho remoto", views: "654" },
];

/* ── Components ───────────────────────────────── */

function SectionHeader({ title, editoria, viewAllTo }: { title: string; editoria?: string; viewAllTo?: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {editoria && (
          <span className="text-[11px] font-semibold uppercase tracking-widest text-bronze">{editoria}</span>
        )}
        <h2 className="font-display text-2xl text-foreground">{title}</h2>
      </div>
      {viewAllTo && (
        <Link to={viewAllTo} className="flex items-center gap-1 text-[13px] font-medium text-primary hover:text-primary/80 transition-colors font-ui">
          Ver todas <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </Link>
      )}
    </div>
  );
}

function CardNoticia({ slug, type, editoria, title, author, date, readTime, image, size = "default" }: {
  slug: string; type: string; editoria: string; title: string; author: string; date: string; readTime: string; image?: string; size?: "default" | "small";
}) {
  return (
    <Link to={`/${type.toLowerCase()}/${slug}`} className="group block">
      {image && (
        <div className="aspect-[16/10] rounded-lg overflow-hidden mb-3 bg-muted">
          <img src={image} alt={title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        </div>
      )}
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-bronze">{editoria}</span>
        <span className="text-muted-foreground/30">·</span>
        <span className="text-[11px] text-muted-foreground">{type}</span>
      </div>
      <h3 className={cn(
        "font-display text-foreground group-hover:text-primary transition-colors leading-snug",
        size === "small" ? "text-[15px]" : "text-lg"
      )}>
        {title}
      </h3>
      <div className="flex items-center gap-2 mt-2 text-[12px] text-muted-foreground">
        <span className="font-medium">{author}</span>
        <span>·</span>
        <span>{date}</span>
        <span>·</span>
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" strokeWidth={1.5} />{readTime}</span>
      </div>
    </Link>
  );
}

/* ── Page ──────────────────────────────────────── */

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main story */}
          <div className="lg:col-span-2">
            <Link to={`/decisao/${manchete.slug}`} className="group block">
              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-muted mb-4">
                <img src={manchete.image} alt={manchete.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-bronze">{manchete.editoria}</span>
                <span className="text-muted-foreground/30">·</span>
                <span className="text-[11px] font-medium text-muted-foreground">{manchete.type}</span>
              </div>
              <h1 className="font-display text-3xl lg:text-4xl text-foreground group-hover:text-primary transition-colors leading-tight">
                {manchete.title}
              </h1>
              <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed max-w-2xl">
                {manchete.lead}
              </p>
              <div className="flex items-center gap-2 mt-3 text-[12px] text-muted-foreground">
                <span className="font-medium">{manchete.author}</span>
                <span>·</span>
                <span>{manchete.date}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" strokeWidth={1.5} />{manchete.readTime}</span>
              </div>
            </Link>
          </div>

          {/* Side highlights */}
          <div className="space-y-6">
            {destaques.map((d) => (
              <CardNoticia key={d.slug} {...d} size="small" />
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-border" />
      </div>

      {/* Latest + Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Latest */}
          <div className="lg:col-span-2">
            <SectionHeader title="Últimas publicações" viewAllTo="/noticias" />
            <div className="space-y-6 divide-y divide-border">
              {ultimasNoticias.map((item, i) => (
                <div key={item.slug} className={cn(i > 0 && "pt-6")}>
                  <Link to={`/${item.type.toLowerCase()}/${item.slug}`} className="group flex gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-bronze">{item.editoria}</span>
                        <span className="text-muted-foreground/30">·</span>
                        <span className="text-[11px] text-muted-foreground">{item.type}</span>
                      </div>
                      <h3 className="font-display text-[17px] text-foreground group-hover:text-primary transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5 text-[12px] text-muted-foreground">
                        <span className="font-medium">{item.author}</span>
                        <span>·</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Most read */}
            <div className="rounded-xl bg-card p-6 shadow-editorial">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-bronze" strokeWidth={1.5} />
                <h3 className="text-[14px] font-semibold text-foreground font-ui">Mais lidas</h3>
              </div>
              <div className="space-y-3.5">
                {maisLidos.map((item) => (
                  <div key={item.position} className="flex gap-3 group cursor-pointer">
                    <span className="text-2xl font-display text-muted-foreground/30 tabular-nums leading-none pt-0.5">
                      {item.position}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
                        {item.title}
                      </p>
                      <span className="text-[11px] text-muted-foreground tabular-nums">{item.views} leituras</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="rounded-xl bg-primary p-6 text-primary-foreground">
              <h3 className="font-display text-xl mb-2">Newsletter Veredito</h3>
              <p className="text-[13px] text-primary-foreground/70 mb-4 leading-relaxed">
                Receba toda semana as análises mais relevantes do universo jurídico.
              </p>
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="h-10 w-full rounded-md bg-primary-foreground/10 border border-primary-foreground/20 px-3 text-[13px] text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary-foreground/30 mb-2"
              />
              <button className="h-10 w-full rounded-md bg-bronze text-[13px] font-medium text-bronze-foreground hover:bg-bronze/90 transition-colors font-ui">
                Assinar gratuitamente
              </button>
              <p className="text-[11px] text-primary-foreground/40 mt-2 text-center">
                Mais de 1.200 assinantes · Sem spam
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
