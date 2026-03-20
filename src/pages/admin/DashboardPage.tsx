import React from "react";
import {
  FileText,
  Eye,
  Clock,
  CheckCircle,
  Calendar,
  Send,
  ArrowRight,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusCards = [
  { label: "Rascunhos", value: 12, icon: FileText, dotClass: "status-draft" },
  { label: "Em revisão", value: 5, icon: Eye, dotClass: "status-review" },
  { label: "Agendados", value: 3, icon: Calendar, dotClass: "status-scheduled" },
  { label: "Publicados hoje", value: 8, icon: Send, dotClass: "status-published" },
];

const recentActivity = [
  {
    title: "STF suspende efeitos de lei estadual sobre ICMS",
    type: "Decisão",
    author: "Ana Beatriz",
    time: "há 12 min",
    status: "review" as const,
  },
  {
    title: "Nova regulamentação do mercado imobiliário entra em vigor",
    type: "Notícia",
    author: "Carlos Mendes",
    time: "há 45 min",
    status: "draft" as const,
  },
  {
    title: "Análise: impacto da reforma tributária nos escritórios",
    type: "Artigo",
    author: "Dra. Fernanda Lima",
    time: "há 1h",
    status: "approved" as const,
  },
  {
    title: "Opinião: o futuro do direito sucessório digital",
    type: "Opinião",
    author: "Prof. Ricardo Alves",
    time: "há 2h",
    status: "published" as const,
  },
  {
    title: "TST define nova súmula sobre trabalho remoto",
    type: "Decisão",
    author: "Mariana Costa",
    time: "há 3h",
    status: "scheduled" as const,
  },
];

const statusLabels: Record<string, string> = {
  draft: "Rascunho",
  review: "Revisão",
  approved: "Aprovado",
  scheduled: "Agendado",
  published: "Publicado",
};

const quickActions = [
  { label: "Nova notícia", description: "Criar notícia em rascunho" },
  { label: "Nova decisão", description: "Registrar decisão judicial" },
  { label: "Novo artigo", description: "Escrever artigo editorial" },
  { label: "Nova opinião", description: "Criar coluna de opinião" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Status cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statusCards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg bg-card p-4 shadow-editorial transition-shadow hover:shadow-editorial-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn("status-dot", card.dotClass)} />
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {card.label}
                </span>
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
            <button className="flex items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors">
              Ver tudo <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
            </button>
          </div>
          <div className="divide-y divide-border">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors duration-150 cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground truncate">
                    {item.title}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{item.type}</span>
                    <span>·</span>
                    <span>{item.author}</span>
                    <span>·</span>
                    <span className="tabular-nums">{item.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={cn("status-dot", `status-${item.status}`)} />
                  <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {statusLabels[item.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Quick actions */}
          <div className="rounded-lg bg-card shadow-editorial">
            <div className="border-b border-border px-5 py-3.5">
              <h2 className="text-[13px] font-semibold text-foreground">Ações rápidas</h2>
            </div>
            <div className="p-3 space-y-1">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left hover:bg-muted/50 transition-colors duration-150 group"
                >
                  <div>
                    <p className="text-[13px] font-medium text-foreground">{action.label}</p>
                    <p className="text-[11px] text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/0 group-hover:text-muted-foreground transition-all" strokeWidth={1.5} />
                </button>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="rounded-lg bg-card shadow-editorial">
            <div className="border-b border-border px-5 py-3.5">
              <h2 className="text-[13px] font-semibold text-foreground">Alertas</h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-[13px] font-medium text-foreground">3 conteúdos aguardam revisão jurídica</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Decisões pendentes há mais de 24h</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="h-4 w-4 text-status-published shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-[13px] font-medium text-foreground">Newsletter: +47 inscritos esta semana</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Total: 1.284 leads ativos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
