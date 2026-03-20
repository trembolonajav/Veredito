import React from "react";
import { Link, useParams } from "react-router-dom";
import { Clock, ArrowRight, Search, Mail, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Shared helpers ───────────────────────────── */

function PageContainer({ children }: { children: React.ReactNode }) {
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>;
}

function PageTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      {eyebrow && <span className="text-[11px] font-semibold uppercase tracking-widest text-bronze mb-2 block">{eyebrow}</span>}
      <h1 className="font-display text-3xl lg:text-4xl text-foreground">{title}</h1>
      {subtitle && <p className="mt-2 text-[15px] text-muted-foreground max-w-2xl leading-relaxed">{subtitle}</p>}
    </div>
  );
}

function ContentCard({ slug, type, editoria, title, lead, author, date, readTime, image }: {
  slug: string; type: string; editoria: string; title: string; lead?: string; author: string; date: string; readTime: string; image?: string;
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
      </div>
      <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors leading-snug">{title}</h3>
      {lead && <p className="mt-1.5 text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">{lead}</p>}
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

/* ── Mock data pools ──────────────────────────── */

const mockNoticias = [
  { slug: "marco-legal-garantias", type: "Notícia", editoria: "Empresarial", title: "Novo marco legal das garantias entra em vigor e altera regras do crédito", lead: "Legislação promete simplificar a constituição de garantias e ampliar o acesso ao crédito no país.", author: "Carlos Mendes", date: "18 mar 2026", readTime: "5 min", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { slug: "lei-inquilinato", type: "Notícia", editoria: "Imobiliário", title: "Alterações na lei do inquilinato são aprovadas pelo Senado", lead: "Projeto altera regras sobre despejos, garantias locatícias e renovação compulsória.", author: "Carlos Mendes", date: "20 mar 2026", readTime: "4 min", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80" },
  { slug: "regulamentacao-cripto", type: "Notícia", editoria: "Empresarial", title: "Banco Central publica regulamentação para criptoativos", lead: "Norma define regras para corretoras e custódia de ativos digitais no Brasil.", author: "João Pedro Silva", date: "17 mar 2026", readTime: "6 min", image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80" },
];

const mockDecisoes = [
  { slug: "stf-suspende-icms", type: "Decisão", editoria: "Tributário", title: "STF suspende efeitos de lei estadual sobre ICMS", lead: "Decisão afeta diretamente a arrecadação de 12 estados e abre precedente para novas contestações.", author: "Ana Beatriz Duarte", date: "20 mar 2026", readTime: "8 min", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80" },
  { slug: "tst-trabalho-remoto", type: "Decisão", editoria: "Trabalhista", title: "TST define nova súmula sobre trabalho remoto e jornada flexível", lead: "Tribunal unifica entendimento sobre controle de jornada em regime de teletrabalho.", author: "Mariana Costa", date: "21 mar 2026", readTime: "7 min", image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=400&q=80" },
  { slug: "lgpd-decisoes", type: "Decisão", editoria: "Constitucional", title: "ANPD aplica multa recorde por descumprimento da LGPD", lead: "Empresa de telecomunicações é penalizada em R$ 14,4 milhões por vazamento de dados.", author: "Ana Beatriz Duarte", date: "19 mar 2026", readTime: "6 min", image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&q=80" },
];

const mockArtigos = [
  { slug: "reforma-tributaria", type: "Artigo", editoria: "Tributário", title: "Impacto da reforma tributária nos escritórios de advocacia", lead: "Como as mudanças propostas afetam a operação dos escritórios e o planejamento tributário dos clientes.", author: "Dra. Fernanda Lima", date: "19 mar 2026", readTime: "12 min", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80" },
  { slug: "compliance-startups", type: "Artigo", editoria: "Empresarial", title: "Compliance nas startups brasileiras — o que muda com a nova regulamentação", lead: "Análise detalhada das obrigações regulatórias para empresas de tecnologia.", author: "João Pedro Silva", date: "20 mar 2026", readTime: "10 min", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80" },
];

const mockOpinioes = [
  { slug: "direito-sucessorio-digital", type: "Opinião", editoria: "Sucessório", title: "O futuro do direito sucessório digital: desafios e oportunidades", lead: "A legislação brasileira precisa avançar para lidar com heranças digitais e ativos virtuais.", author: "Prof. Ricardo Alves", date: "19 mar 2026", readTime: "6 min", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80" },
  { slug: "heranca-digital", type: "Opinião", editoria: "Sucessório", title: "Herança digital: o direito ainda não está preparado para o metaverso", lead: "Reflexões sobre a necessidade de atualização legislativa.", author: "Prof. Ricardo Alves", date: "19 mar 2026", readTime: "8 min", image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80" },
];

/* ── Listing template ─────────────────────────── */

function ListingPage({ eyebrow, title, subtitle, items }: {
  eyebrow: string; title: string; subtitle: string; items: typeof mockNoticias;
}) {
  return (
    <PageContainer>
      <PageTitle eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => <ContentCard key={item.slug} {...item} />)}
      </div>
      {items.length === 0 && (
        <p className="text-center text-muted-foreground py-20 text-[15px]">Nenhum conteúdo publicado ainda.</p>
      )}
    </PageContainer>
  );
}

/* ── Exported pages ───────────────────────────── */

export function NoticiasListPage() {
  return <ListingPage eyebrow="Notícias" title="Últimas notícias" subtitle="Fatos e acontecimentos relevantes do universo jurídico brasileiro." items={mockNoticias} />;
}

export function DecisoesListPage() {
  return <ListingPage eyebrow="Decisões" title="Decisões judiciais" subtitle="Análises de decisões de tribunais superiores e suas consequências." items={mockDecisoes} />;
}

export function ArtigosListPage() {
  return <ListingPage eyebrow="Artigos" title="Artigos e análises" subtitle="Análises aprofundadas sobre temas relevantes do direito." items={mockArtigos} />;
}

export function OpinioesListPage() {
  return <ListingPage eyebrow="Opinião" title="Opinião" subtitle="Posicionamentos editoriais e colunas de especialistas." items={mockOpinioes} />;
}

/* ── Content individual page ──────────────────── */

export function ConteudoPublicoPage() {
  const { slug } = useParams();

  // Find content from all pools
  const allContent = [...mockNoticias, ...mockDecisoes, ...mockArtigos, ...mockOpinioes];
  const content = allContent.find((c) => c.slug === slug) || allContent[0];

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">Veredito</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={`/${content.type.toLowerCase()}s`} className="text-bronze hover:text-bronze/80 transition-colors">{content.editoria}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="truncate max-w-[200px]">{content.title}</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-bronze">{content.editoria}</span>
          <span className="text-muted-foreground/30">·</span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{content.type}</span>
        </div>

        <h1 className="font-display text-3xl lg:text-4xl text-foreground leading-tight mb-3">{content.title}</h1>

        {content.lead && (
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">{content.lead}</p>
        )}

        <div className="flex items-center gap-4 pb-6 border-b border-border mb-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
              {content.author.split(" ").map(w => w[0]).slice(0, 2).join("")}
            </div>
            <div>
              <p className="text-[13px] font-medium text-foreground">{content.author}</p>
            </div>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="text-[12px] text-muted-foreground flex items-center gap-2">
            <span>{content.date}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" strokeWidth={1.5} />{content.readTime}</span>
          </div>
        </div>

        {content.image && (
          <div className="aspect-[16/9] rounded-xl overflow-hidden bg-muted mb-8">
            <img src={content.image} alt={content.title} className="h-full w-full object-cover" />
          </div>
        )}

        <div className="prose prose-lg max-w-none text-foreground space-y-4">
          <p className="text-[15px] leading-[1.8]">
            {content.lead} Esta é uma versão demonstrativa do conteúdo. Em produção, o texto completo será carregado do banco de dados.
          </p>
          <p className="text-[15px] leading-[1.8]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
          </p>
          <p className="text-[15px] leading-[1.8]">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>

        {/* Author box */}
        <div className="mt-10 rounded-lg bg-card p-6 shadow-editorial flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shrink-0">
            {content.author.split(" ").map(w => w[0]).slice(0, 2).join("")}
          </div>
          <div>
            <p className="text-[15px] font-semibold text-foreground">{content.author}</p>
            <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
              Jornalista e especialista em direito. Contribuidor regular do Veredito.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

/* ── Editoria page ────────────────────────────── */

export function EditoriaPublicaPage() {
  const { slug } = useParams();
  const name = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "Editoria";
  const items = [...mockNoticias, ...mockDecisoes, ...mockArtigos, ...mockOpinioes].filter(
    (c) => c.editoria.toLowerCase() === slug
  );

  return (
    <PageContainer>
      <PageTitle eyebrow="Editoria" title={name} subtitle={`Todos os conteúdos da editoria ${name}.`} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => <ContentCard key={item.slug} {...item} />)}
      </div>
      {items.length === 0 && (
        <p className="text-center text-muted-foreground py-20 text-[15px]">Nenhum conteúdo nesta editoria.</p>
      )}
    </PageContainer>
  );
}

/* ── Busca ─────────────────────────────────────── */

export function BuscaPage() {
  const [query, setQuery] = React.useState("");
  const allContent = [...mockNoticias, ...mockDecisoes, ...mockArtigos, ...mockOpinioes];
  const results = query.length > 2
    ? allContent.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <PageContainer>
      <PageTitle title="Busca" subtitle="Encontre notícias, decisões, artigos e opiniões." />
      <div className="max-w-2xl mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite para buscar..."
            autoFocus
            className="h-14 w-full rounded-xl border border-input bg-card pl-12 pr-4 text-[16px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          />
        </div>
      </div>
      {query.length > 2 && (
        <p className="text-[13px] text-muted-foreground mb-6">{results.length} resultado{results.length !== 1 ? "s" : ""} para "{query}"</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {results.map((item) => <ContentCard key={item.slug} {...item} />)}
      </div>
    </PageContainer>
  );
}

/* ── Institutional pages ──────────────────────── */

export function SobrePage() {
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto">
        <PageTitle title="Sobre o Veredito" />
        <div className="prose max-w-none space-y-4">
          <p className="text-[15px] text-foreground leading-[1.8]">
            O <strong>Veredito</strong> é um portal de jornalismo jurídico independente, dedicado a cobrir com profundidade e rigor editorial as decisões, regulamentações e debates que moldam o cenário jurídico brasileiro.
          </p>
          <p className="text-[15px] text-foreground leading-[1.8]">
            Fundado por jornalistas e juristas, o Veredito nasceu da necessidade de um espaço editorial que combine a precisão técnica do direito com a clareza e acessibilidade do bom jornalismo.
          </p>
          <h2 className="font-display text-2xl text-foreground mt-8">Nossa missão</h2>
          <p className="text-[15px] text-foreground leading-[1.8]">
            Democratizar o acesso à informação jurídica de qualidade, traduzindo decisões complexas em conteúdo compreensível sem perder o rigor técnico.
          </p>
          <h2 className="font-display text-2xl text-foreground mt-8">Equipe editorial</h2>
          <p className="text-[15px] text-foreground leading-[1.8]">
            Nossa equipe é formada por jornalistas especializados, advogados colaboradores e professores de direito que compartilham o compromisso com a informação independente e qualificada.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}

export function ContatoPage() {
  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto">
        <PageTitle title="Contato" subtitle="Entre em contato com a equipe do Veredito." />
        <div className="rounded-lg bg-card p-8 shadow-editorial space-y-5">
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-foreground">Nome</label>
            <input className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors" placeholder="Seu nome" />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-foreground">E-mail</label>
            <input type="email" className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors" placeholder="seu@email.com" />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-foreground">Mensagem</label>
            <textarea className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors resize-none" placeholder="Sua mensagem..." />
          </div>
          <button className="h-10 rounded-md bg-primary px-6 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Enviar mensagem
          </button>
        </div>
      </div>
    </PageContainer>
  );
}

export function NewsletterPublicaPage() {
  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6">
          <Mail className="h-12 w-12 text-bronze mx-auto mb-4" strokeWidth={1} />
          <h1 className="font-display text-3xl lg:text-4xl text-foreground">Newsletter Veredito</h1>
          <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Receba toda semana as análises jurídicas mais relevantes, decisões importantes e artigos de opinião diretamente no seu e-mail.
          </p>
        </div>
        <div className="rounded-xl bg-card p-8 shadow-editorial-lg">
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="h-12 flex-1 rounded-md border border-input bg-background px-4 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            />
            <button className="h-12 rounded-md bg-primary px-6 text-[14px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors font-ui">
              Assinar
            </button>
          </div>
          <p className="mt-4 text-[12px] text-muted-foreground">
            Mais de 1.200 profissionais do direito já assinam · Cancele quando quiser
          </p>
        </div>
      </div>
    </PageContainer>
  );
}

export function PrivacidadePage() {
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto">
        <PageTitle title="Política de Privacidade" />
        <div className="prose max-w-none space-y-4">
          <p className="text-[15px] text-foreground leading-[1.8]">O Veredito respeita a privacidade de seus leitores e se compromete com a proteção dos dados pessoais.</p>
          <h2 className="font-display text-xl text-foreground mt-6">Dados coletados</h2>
          <p className="text-[15px] text-foreground leading-[1.8]">Coletamos apenas dados necessários para o funcionamento do serviço: e-mail para newsletter, dados de navegação via analytics e informações fornecidas voluntariamente via formulários de contato.</p>
          <h2 className="font-display text-xl text-foreground mt-6">Uso dos dados</h2>
          <p className="text-[15px] text-foreground leading-[1.8]">Os dados são utilizados exclusivamente para envio de newsletter, melhoria da experiência de navegação e comunicação editorial.</p>
          <h2 className="font-display text-xl text-foreground mt-6">Seus direitos</h2>
          <p className="text-[15px] text-foreground leading-[1.8]">Conforme a LGPD, você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento pelo e-mail privacidade@veredito.com.br.</p>
        </div>
      </div>
    </PageContainer>
  );
}

export function TermosPage() {
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto">
        <PageTitle title="Termos de Uso" />
        <div className="prose max-w-none space-y-4">
          <p className="text-[15px] text-foreground leading-[1.8]">Ao acessar o portal Veredito, você concorda com os termos descritos abaixo.</p>
          <h2 className="font-display text-xl text-foreground mt-6">Conteúdo editorial</h2>
          <p className="text-[15px] text-foreground leading-[1.8]">Todo o conteúdo publicado no Veredito é de propriedade intelectual do portal e de seus autores. A reprodução total ou parcial sem autorização expressa é proibida.</p>
          <h2 className="font-display text-xl text-foreground mt-6">Uso informativo</h2>
          <p className="text-[15px] text-foreground leading-[1.8]">O conteúdo do Veredito tem caráter informativo e educacional. Não constitui aconselhamento jurídico e não substitui a consulta a um advogado.</p>
          <h2 className="font-display text-xl text-foreground mt-6">Newsletter</h2>
          <p className="text-[15px] text-foreground leading-[1.8]">Ao se inscrever na newsletter, você autoriza o envio de conteúdo editorial por e-mail. Pode cancelar a inscrição a qualquer momento.</p>
        </div>
      </div>
    </PageContainer>
  );
}
