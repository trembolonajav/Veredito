import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Eye,
  Calendar,
  Send,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  canConteudoAppearInHomeHighlights,
  contentStatusLabels,
  getContentTypeLabel,
  useEditorialStore,
} from "./editorial-store";

const statusCardConfig = [
  { key: "draft", label: "Rascunhos", icon: FileText, dotClass: "status-draft" },
  { key: "review", label: "Em revisão", icon: Eye, dotClass: "status-review" },
  { key: "scheduled", label: "Agendados", icon: Calendar, dotClass: "status-scheduled" },
  { key: "published", label: "Publicados", icon: Send, dotClass: "status-published" },
] as const;

const quickActions = [
  { label: "Nova notícia", description: "Criar notícia em rascunho", href: "/admin/conteudos/novo?tipo=noticia" },
  { label: "Nova decisão", description: "Registrar decisão judicial", href: "/admin/conteudos/novo?tipo=decisao" },
  { label: "Novo artigo", description: "Escrever artigo editorial", href: "/admin/conteudos/novo?tipo=artigo" },
  { label: "Nova opinião", description: "Criar coluna de opinião", href: "/admin/conteudos/novo?tipo=opiniao" },
] as const;

export default function DashboardPage() {
  const navigate = useNavigate();
  const {
    autores,
    conteudos,
    editorias,
    fontes,
    homeHighlights,
    getAutorById,
  } = useEditorialStore();

  const statusCards = useMemo(() => {
    return statusCardConfig.map((card) => ({
      ...card,
      value: conteudos.filter((item) => item.status === card.key).length,
    }));
  }, [conteudos]);

  const recentActivity = useMemo(() => {
    return [...conteudos]
      .sort((a, b) => b.id - a.id)
      .slice(0, 5)
      .map((item) => ({
        id: item.id,
        title: item.title,
        type: getContentTypeLabel(item.typeKey),
        author: getAutorById(item.authorId)?.name || "Autor não encontrado",
        dateLabel: item.dateLabel,
        status: item.status,
      }));
  }, [conteudos, getAutorById]);

  const eligibleConteudos = useMemo(() => {
    return conteudos.filter((item) => canConteudoAppearInHomeHighlights(item, editorias, autores, fontes));
  }, [conteudos, editorias, autores, fontes]);

  const inactiveEditoriasLinked = useMemo(() => {
    return conteudos.filter((item) => {
      const editoria = editorias.find((entry) => entry.id === item.editoriaId);
      return !editoria || editoria.status !== "active";
    }).length;
  }, [conteudos, editorias]);

  const alerts = useMemo(() => {
    const items = [] as { icon: typeof AlertCircle; tone: string; title: string; description: string }[];

    const reviewCount = conteudos.filter((item) => item.status === "review").length;
    if (reviewCount > 0) {
      items.push({
        icon: AlertCircle,
        tone: "text-destructive",
        title: `${reviewCount} conteúdo(s) aguardam revisão editorial`,
        description: "O fluxo da 2.3 está ativo e depende de fechamento de revisão no editor principal.",
      });
    }

    items.push({
      icon: LayoutGrid,
      tone: "text-bronze",
      title: `${homeHighlights.length} destaque(s) ativos sobre ${eligibleConteudos.length} conteúdo(s) elegíveis`,
      description: "A curadoria da home está operando sobre a mesma base canônica local do admin.",
    });

    if (inactiveEditoriasLinked > 0) {
      items.push({
        icon: AlertCircle,
        tone: "text-amber-700",
        title: `${inactiveEditoriasLinked} vínculo(s) editoriais exigem revisão`,
        description: "Há conteúdos que perderam suporte canônico em editoria e precisam de saneamento interno.",
      });
    }

    return items.slice(0, 3);
  }, [conteudos, eligibleConteudos.length, homeHighlights.length, inactiveEditoriasLinked]);

  return (
    <div className="space-y-6">
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
        <div className="lg:col-span-2 rounded-lg bg-card shadow-editorial">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <h2 className="text-[13px] font-semibold text-foreground">Atividade recente</h2>
            <button
              onClick={() => navigate("/admin/conteudos")}
              className="flex items-center gap-1 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Ver tudo <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
            </button>
          </div>
          <div className="divide-y divide-border">
            {recentActivity.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(`/admin/conteudos/${item.id}/preview`)}
                className="flex w-full items-center gap-4 px-5 py-3 text-left transition-colors duration-150 hover:bg-muted/30"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-foreground">{item.title}</p>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{item.type}</span>
                    <span>·</span>
                    <span>{item.author}</span>
                    <span>·</span>
                    <span className="tabular-nums">{item.dateLabel}</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className={cn("status-dot", `status-${item.status}`)} />
                  <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {contentStatusLabels[item.status]}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg bg-card shadow-editorial">
            <div className="border-b border-border px-5 py-3.5">
              <h2 className="text-[13px] font-semibold text-foreground">Ações rápidas</h2>
            </div>
            <div className="space-y-1 p-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.href)}
                  className="group flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left transition-colors duration-150 hover:bg-muted/50"
                >
                  <div>
                    <p className="text-[13px] font-medium text-foreground">{action.label}</p>
                    <p className="text-[11px] text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/0 transition-all group-hover:text-muted-foreground" strokeWidth={1.5} />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-card shadow-editorial">
            <div className="border-b border-border px-5 py-3.5">
              <h2 className="text-[13px] font-semibold text-foreground">Alertas</h2>
            </div>
            <div className="space-y-3 p-4">
              {alerts.map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <item.icon className={cn("mt-0.5 h-4 w-4 shrink-0", item.tone)} strokeWidth={1.5} />
                  <div>
                    <p className="text-[13px] font-medium text-foreground">{item.title}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
