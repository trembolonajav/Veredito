import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Archive,
  ArrowLeft,
  Check,
  Clock,
  Edit,
  Eye,
  MessageSquareQuote,
  Save,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  contentStatusLabels,
  contentStatusStyles,
  EditorialWorkflowActionKey,
  getAvailableWorkflowActions,
  getContentTypeLabel,
  getWorkflowStageLabel,
  getWorkflowTargetStatus,
  useEditorialStore,
  workflowActionLabels,
} from "./editorial-store";

function getReadTime(body: string) {
  const words = body.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min de leitura`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getActionIcon(actionKey: EditorialWorkflowActionKey) {
  if (actionKey === "save_draft") return Save;
  if (actionKey === "send_review") return Send;
  if (actionKey === "schedule") return Clock;
  if (actionKey === "archive") return Archive;
  if (actionKey === "request_adjustments" || actionKey === "restore_draft" || actionKey === "back_to_approved") return ArrowLeft;
  return Check;
}

export default function ConteudoPreviewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [noteDraft, setNoteDraft] = useState("");
  const {
    addEditorialNote,
    getAutorById,
    getConteudoById,
    getEditoriaById,
    getFonteById,
    getHistoryForConteudo,
    getNotesForConteudo,
    updateConteudo,
  } = useEditorialStore();

  const content = id ? getConteudoById(Number(id)) : undefined;
  const editoria = content ? getEditoriaById(content.editoriaId) : undefined;
  const author = content ? getAutorById(content.authorId) : undefined;
  const fonte = content ? getFonteById(content.fonteId) : undefined;
  const readTime = useMemo(() => getReadTime(content?.body || ""), [content?.body]);
  const historyEntries = useMemo(() => (content ? getHistoryForConteudo(content.id) : []), [content, getHistoryForConteudo]);
  const noteEntries = useMemo(() => (content ? getNotesForConteudo(content.id) : []), [content, getNotesForConteudo]);
  const availableActions = useMemo(() => (content ? getAvailableWorkflowActions(content.status) : []), [content]);

  if (!content || !author || !editoria) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border border-input bg-card px-5 py-4 shadow-editorial">
          <div>
            <h2 className="font-display text-xl text-foreground">Pré-visualização indisponível</h2>
            <p className="text-[13px] text-muted-foreground">O conteúdo não foi encontrado na base editorial local.</p>
          </div>
          <button onClick={() => navigate("/admin/conteudos")} className="flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-[12px] font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> Voltar à lista
          </button>
        </div>
      </div>
    );
  }

  const isDecision = content.typeKey === "decisao";

  const handleWorkflowAction = (actionKey: EditorialWorkflowActionKey) => {
    updateConteudo(
      content.id,
      { status: getWorkflowTargetStatus(actionKey) },
      { workflowAction: actionKey },
    );
    toast.success(workflowActionLabels[actionKey]);
  };

  const handleNoteSubmit = () => {
    if (!noteDraft.trim()) {
      toast.error("Digite uma observação para registrar a nota editorial.");
      return;
    }

    addEditorialNote(content.id, noteDraft);
    setNoteDraft("");
    toast.success("Nota editorial registrada");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border border-bronze/20 bg-bronze/10 px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="font-ui text-[13px] font-semibold text-bronze">Pré-visualização</span>
          <span className="text-[12px] text-muted-foreground">Conferência editorial e operação mockada do conteúdo</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(`/admin/conteudos/${content.id}/editar`)} className="flex h-8 items-center gap-1.5 rounded-md border border-input bg-card px-3 text-[12px] font-medium text-foreground transition-colors hover:bg-secondary">
            <Edit className="h-3.5 w-3.5" strokeWidth={1.5} /> Voltar ao editor
          </button>
          <button onClick={() => navigate("/admin/conteudos")} className="flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-[12px] font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> Voltar à lista
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <span>Veredito</span>
              <span>/</span>
              <span className="font-medium text-bronze">{editoria.name}</span>
              <span>/</span>
              <span>{getContentTypeLabel(content.typeKey)}</span>
            </div>

            <div className="mb-3 flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-bronze">{editoria.name}</span>
              <span className="text-muted-foreground/30">·</span>
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{getContentTypeLabel(content.typeKey)}</span>
            </div>

            <h1 className="mb-3 font-display text-4xl leading-tight text-foreground">{content.title}</h1>
            {content.subtitle && <p className="mb-6 text-lg leading-relaxed text-muted-foreground">{content.subtitle}</p>}

            <div className="mb-8 flex items-center gap-4 border-b border-border pb-6">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">{author.initials || getInitials(author.name)}</div>
                <div>
                  <p className="text-[13px] font-medium text-foreground">{author.name}</p>
                  <p className="text-[11px] text-muted-foreground">{author.role}</p>
                </div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-[12px] text-muted-foreground">
                <p>{content.dateLabel}</p>
                <p>{readTime}</p>
                {fonte && <p>Fonte: {fonte.sigla}</p>}
              </div>
            </div>

            {isDecision && (
              <div className="mb-8 space-y-3 rounded-lg border border-primary/10 bg-primary/5 p-6">
                <h3 className="font-ui text-[13px] font-semibold text-foreground">Dados da decisão</h3>
                <div className="grid grid-cols-2 gap-4 text-[13px]">
                  <div><span className="text-muted-foreground">Tribunal: </span><span className="font-medium text-foreground">{content.tribunal}</span></div>
                  <div><span className="text-muted-foreground">Processo: </span><span className="font-medium text-foreground">{content.processoNumero || "—"}</span></div>
                  <div><span className="text-muted-foreground">Relator: </span><span className="font-medium text-foreground">{content.relator || "—"}</span></div>
                  <div><span className="text-muted-foreground">Impacto: </span><span className="font-medium text-destructive">{content.impacto || "—"}</span></div>
                </div>
                {content.teseFixada && (
                  <div className="mt-3 border-t border-primary/10 pt-3">
                    <span className="mb-1 block text-[12px] font-semibold text-foreground">Tese fixada</span>
                    <p className="text-[13px] italic leading-relaxed text-foreground">"{content.teseFixada}"</p>
                  </div>
                )}
              </div>
            )}

            {content.lead && <p className="mb-6 text-[15px] font-medium leading-relaxed text-foreground">{content.lead}</p>}

            <div className="prose prose-sm max-w-none space-y-4 leading-relaxed text-foreground">
              {content.body.split("\n\n").map((paragraph, index) => (
                <p key={index} className="text-[15px] leading-[1.8]">{paragraph}</p>
              ))}
            </div>

            {content.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-6">
                {content.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-[11px] font-medium text-muted-foreground">{tag}</span>
                ))}
              </div>
            )}

            <div className="mt-8 flex items-start gap-4 rounded-lg bg-card p-6 shadow-editorial">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{author.initials || getInitials(author.name)}</div>
              <div>
                <p className="text-[15px] font-semibold text-foreground">{author.name}</p>
                <p className="text-[12px] font-medium text-bronze">{author.role}</p>
                {author.bio && <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{author.bio}</p>}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
          <div className="space-y-4 rounded-lg bg-card p-5 shadow-editorial">
            <div className="flex items-center justify-between">
              <h3 className="font-ui text-[13px] font-semibold text-foreground">Operação editorial</h3>
              <Eye className="h-4 w-4 text-bronze" strokeWidth={1.5} />
            </div>
            <div className="space-y-3 rounded-md border border-bronze/20 bg-bronze/5 p-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-bronze">Status atual</p>
                <span className={cn("mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium", contentStatusStyles[content.status])}>
                  {contentStatusLabels[content.status]}
                </span>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-bronze">Etapa</p>
                <p className="mt-1 text-[13px] font-medium text-foreground">{getWorkflowStageLabel(content.status)}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-bronze">Checklist mínimo</p>
                <ul className="mt-2 space-y-1 text-[12px] text-muted-foreground">
                  <li>Título, editoria e autoria revisados</li>
                  <li>Lead e corpo conferidos</li>
                  <li>Status coerente com a etapa atual</li>
                </ul>
              </div>
            </div>
            <div className="space-y-2">
              {availableActions.map((actionKey) => {
                const Icon = getActionIcon(actionKey);
                const isPrimary = actionKey === "send_review" || actionKey === "approve" || actionKey === "publish_now" || actionKey === "restore_draft";
                const isDestructive = actionKey === "archive";
                return (
                  <button
                    key={actionKey}
                    onClick={() => handleWorkflowAction(actionKey)}
                    className={cn(
                      "flex h-9 w-full items-center justify-center gap-1.5 rounded-md text-[13px] font-medium transition-colors",
                      isPrimary
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : isDestructive
                          ? "border border-input bg-card text-destructive hover:bg-destructive/10"
                          : "border border-input bg-card text-foreground hover:bg-secondary",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.5} /> {workflowActionLabels[actionKey]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg bg-card p-5 shadow-editorial">
            <div className="flex items-center gap-2">
              <MessageSquareQuote className="h-4 w-4 text-bronze" strokeWidth={1.5} />
              <h3 className="font-ui text-[13px] font-semibold text-foreground">Notas editoriais</h3>
            </div>
            <div className="mt-4 space-y-3">
              <textarea
                value={noteDraft}
                onChange={(event) => setNoteDraft(event.target.value)}
                rows={3}
                placeholder="Registrar observação editorial mockada..."
                className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button onClick={handleNoteSubmit} className="flex h-9 w-full items-center justify-center gap-1.5 rounded-md border border-input bg-card text-[13px] font-medium text-foreground transition-colors hover:bg-secondary">
                <Save className="h-3.5 w-3.5" strokeWidth={1.5} /> Adicionar nota
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {noteEntries.length === 0 && <p className="text-[12px] text-muted-foreground">Nenhuma nota editorial registrada.</p>}
              {noteEntries.map((entry) => (
                <div key={entry.id} className="rounded-md border border-border bg-background px-3 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-medium text-foreground">{entry.author}</span>
                    <span className="text-[11px] text-muted-foreground">{entry.dateTimeLabel}</span>
                  </div>
                  <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{entry.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-card p-5 shadow-editorial">
            <h3 className="font-ui text-[13px] font-semibold text-foreground">Histórico editorial</h3>
            <div className="mt-4 space-y-3">
              {historyEntries.map((entry) => (
                <div key={entry.id} className="rounded-md border border-border bg-background px-3 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-medium text-foreground">{entry.actionLabel}</span>
                    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium", contentStatusStyles[entry.status])}>
                      {contentStatusLabels[entry.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">{entry.actor} • {entry.dateTimeLabel}</p>
                  {entry.note && <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{entry.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
