import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, Eye, Clock, CheckCircle, Calendar, Send, ArrowRight, TrendingUp,
  AlertCircle, AlertTriangle, ImageOff, Search as SearchIcon, Zap, Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getAnalyticsOverview, getDashboardUrgentSummary, getHomeZonePerformance } from "@/domain/editorial/selectors";
import { useEditorialSnapshot } from "@/domain/editorial/store";

const statusCards = [
  { label: "Rascunhos", value: 12, icon: FileText, dotClass: "status-draft" },
  { label: "Em revisão", value: 5, icon: Eye, dotClass: "status-review" },
  { label: "Agendados", value: 3, icon: Calendar, dotClass: "status-scheduled" },
  { label: "Publicados hoje", value: 8, icon: Send, dotClass: "status-published" },
];

const recentActivity = [
  { title: "STF suspende efeitos de lei estadual sobre ICMS", type: "Decisão", author: "Ana Beatriz", time: "há 12 min", status: "review" as const },
  { title: "Nova regulamentação do mercado imobiliário entra em vigor", type: "Notícia", author: "Carlos Mendes", time: "há 45 min", status: "draft" as const },
  { title: "Análise: impacto da reforma tributária nos escritórios", type: "Artigo", author: "Dra. Fernanda Lima", time: "há 1h", status: "approved" as const },
  { title: "Opinião: o futuro do direito sucessório digital", type: "Opinião", author: "Prof. Ricardo Alves", time: "há 2h", status: "published" as const },
  { title: "TST define nova súmula sobre trabalho remoto", type: "Decisão", author: "Mariana Costa", time: "há 3h", status: "scheduled" as const },
];

const statusLabels: Record<string, string> = {
  draft: "Rascunho", review: "Revisão", approved: "Aprovado",
  scheduled: "Agendado", published: "Publicado",
};

const operationalAlerts = [
  { icon: AlertTriangle, color: "text-destructive", title: "3 conteúdos aguardam revisão jurídica", desc: "Decisões pendentes há mais de 24h", urgent: true },
  { icon: ImageOff, color: "text-status-review", title: "2 conteúdos sem imagem de capa", desc: "Publicados sem imagem — impacta SEO e redes sociais", urgent: false },
  { icon: Zap, color: "text-bronze", title: "1 urgente ativo expira em 4h", desc: "STF suspende ICMS — verificar atualização", urgent: true },
  { icon: Home, color: "text-status-scheduled", title: "Home com 1 slot vazio", desc: "Posição 5 de destaque sem conteúdo atribuído", urgent: false },
  { icon: SearchIcon, color: "text-muted-foreground", title: "5 conteúdos sem meta descrição", desc: "SEO incompleto — visibilidade reduzida", urgent: false },
];

const nextScheduled = [
  { title: "Nova lei de recuperação judicial entra em vigor", time: "Hoje, 18:00", type: "Notícia" },
  { title: "TST define nova súmula sobre trabalho remoto", time: "Amanhã, 08:00", type: "Decisão" },
  { title: "Análise: compliance nas startups brasileiras", time: "23 mar, 10:00", type: "Artigo" },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const snapshot = useEditorialSnapshot();
  const urgentSummary = getDashboardUrgentSummary("2026-03-24T16:00:00Z", snapshot);
  const analytics = getAnalyticsOverview(snapshot);
  const zonePerformance = getHomeZonePerformance(snapshot);

  return (
    <div className="space-y-6">
      {/* Status cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statusCards.map((card) => (
          <div key={card.label} className="rounded-lg bg-card p-4 shadow-editorial transition-shadow hover:shadow-editorial-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn("status-dot", card.dotClass)} />
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{card.label}</span>
              </div>
              <card.icon className="h-4 w-4 text-muted-foreground/50" strokeWidth={1.5} />
            </div>
            <p className="mt-3 text-2xl font-semibold tabular-nums text-foreground">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent activity */}
        <div className="lg:col-span-2 rounded-lg bg-card shadow-editorial">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <h2 className="text-[13px] font-semibold text-foreground">Atividade recente</h2>
            <button onClick={() => navigate("/admin/conteudos")} className="flex items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors">
              Ver tudo <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
            </button>
          </div>
          <div className="divide-y divide-border">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors duration-150 cursor-pointer">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground truncate">{item.title}</p>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{item.type}</span><span>·</span><span>{item.author}</span><span>·</span><span className="tabular-nums">{item.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={cn("status-dot", `status-${item.status}`)} />
                  <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{statusLabels[item.status]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Operational Alerts */}
          <div className="rounded-lg bg-card shadow-editorial">
            <div className="border-b border-border px-5 py-3.5 flex items-center justify-between">
              <h2 className="text-[13px] font-semibold text-foreground">Alertas operacionais</h2>
              <span className="text-[10px] font-bold bg-destructive/10 text-destructive px-1.5 py-0.5 rounded-full tabular-nums">
                {operationalAlerts.filter(a => a.urgent).length}
              </span>
            </div>
            <div className="p-4 space-y-3">
              {operationalAlerts.map((alert, i) => (
                <div key={i} className={cn("flex items-start gap-3 p-2 rounded-md transition-colors cursor-pointer hover:bg-muted/50", alert.urgent && "bg-destructive/5")}>
                  <alert.icon className={cn("h-4 w-4 shrink-0 mt-0.5", alert.color)} strokeWidth={1.5} />
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-foreground leading-tight">{alert.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{alert.desc}</p>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-border/60 text-[11px] text-muted-foreground space-y-1">
                <div className="flex items-center justify-between"><span>Urgentes ativos</span><span className="tabular-nums text-foreground">{urgentSummary.active}</span></div>
                <div className="flex items-center justify-between"><span>Vencendo hoje</span><span className="tabular-nums text-foreground">{urgentSummary.expiringToday}</span></div>
                <div className="flex items-center justify-between"><span>Expirados</span><span className="tabular-nums text-foreground">{urgentSummary.expired}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Next scheduled */}
        <div className="rounded-lg bg-card shadow-editorial">
          <div className="border-b border-border px-5 py-3.5">
            <h2 className="text-[13px] font-semibold text-foreground">Próximos agendamentos</h2>
          </div>
          <div className="divide-y divide-border">
            {nextScheduled.map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-status-scheduled/10">
                  <Calendar className="h-3.5 w-3.5 text-status-scheduled" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground truncate">{item.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{item.type}</p>
                </div>
                <span className="text-[11px] text-bronze font-medium tabular-nums shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top content 24h */}
        <div className="rounded-lg bg-card shadow-editorial">
          <div className="border-b border-border px-5 py-3.5 flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-foreground">Mais lidos (24h)</h2>
            <TrendingUp className="h-3.5 w-3.5 text-bronze" strokeWidth={1.5} />
          </div>
          <div className="divide-y divide-border">
            {analytics.topContents.map((item, index) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors cursor-pointer">
                <span className="font-display text-[20px] text-bronze/30 w-6 text-right tabular-nums">{index + 1}</span>
                <p className="text-[13px] font-medium text-foreground truncate flex-1">{item.title}</p>
                <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">{item.views24h.toLocaleString()} views</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg bg-card shadow-editorial">
          <div className="border-b border-border px-5 py-3.5">
            <h2 className="text-[13px] font-semibold text-foreground">Por editoria (7d)</h2>
          </div>
          <div className="divide-y divide-border">
            {analytics.byEditoria.slice(0, 4).map((item) => (
              <div key={item.label} className="flex items-center justify-between px-5 py-3 text-[12px]">
                <span className="text-foreground">{item.label}</span>
                <span className="text-muted-foreground tabular-nums">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg bg-card shadow-editorial">
          <div className="border-b border-border px-5 py-3.5">
            <h2 className="text-[13px] font-semibold text-foreground">Por formato (7d)</h2>
          </div>
          <div className="divide-y divide-border">
            {analytics.byType.map((item) => (
              <div key={item.label} className="flex items-center justify-between px-5 py-3 text-[12px]">
                <span className="text-foreground">{item.label}</span>
                <span className="text-muted-foreground tabular-nums">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg bg-card shadow-editorial">
          <div className="border-b border-border px-5 py-3.5">
            <h2 className="text-[13px] font-semibold text-foreground">Home + newsletter</h2>
          </div>
          <div className="space-y-0">
            <div className="flex items-center justify-between px-5 py-3 text-[12px] border-b border-border">
              <span className="text-foreground">CTR da home</span>
              <span className="text-muted-foreground tabular-nums">{analytics.homeCtr}%</span>
            </div>
            <div className="flex items-center justify-between px-5 py-3 text-[12px] border-b border-border">
              <span className="text-foreground">Cliques da newsletter</span>
              <span className="text-muted-foreground tabular-nums">{analytics.newsletterClicks}</span>
            </div>
            <div className="flex items-center justify-between px-5 py-3 text-[12px]">
              <span className="text-foreground">Urgentes ativos</span>
              <span className="text-muted-foreground tabular-nums">{analytics.urgentActive}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-card shadow-editorial">
          <div className="border-b border-border px-5 py-3.5">
            <h2 className="text-[13px] font-semibold text-foreground">Performance por zona</h2>
          </div>
          <div className="divide-y divide-border">
            {zonePerformance.map((item) => (
              <div key={item.key} className="grid items-center gap-2 px-5 py-3 text-[12px] md:grid-cols-[minmax(0,1fr)_90px_80px]">
                <span className="text-foreground">{item.key}</span>
                <span className="text-muted-foreground tabular-nums">{item.views24h} views</span>
                <span className="text-muted-foreground tabular-nums">{item.homeCtr}% CTR</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-card shadow-editorial">
          <div className="border-b border-border px-5 py-3.5">
            <h2 className="text-[13px] font-semibold text-foreground">Autores em alta (7d)</h2>
          </div>
          <div className="divide-y divide-border">
            {analytics.byAuthor.slice(0, 5).map((item) => (
              <div key={item.label} className="flex items-center justify-between px-5 py-3 text-[12px]">
                <span className="text-foreground">{item.label}</span>
                <span className="text-muted-foreground tabular-nums">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Nova notícia", desc: "Criar em rascunho", onClick: () => navigate("/admin/conteudos/novo?tipo=noticia") },
          { label: "Nova decisão", desc: "Registrar decisão", onClick: () => navigate("/admin/conteudos/novo?tipo=decisao") },
          { label: "Novo artigo", desc: "Escrever análise", onClick: () => navigate("/admin/conteudos/novo?tipo=artigo") },
          { label: "Nova opinião", desc: "Criar coluna", onClick: () => navigate("/admin/conteudos/novo?tipo=opiniao") },
        ].map((action) => (
          <button key={action.label} onClick={action.onClick} className="rounded-lg bg-card p-4 shadow-editorial hover:shadow-editorial-lg transition-all text-left group border border-transparent hover:border-bronze/20">
            <p className="text-[13px] font-medium text-foreground group-hover:text-bronze transition-colors">{action.label}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{action.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
