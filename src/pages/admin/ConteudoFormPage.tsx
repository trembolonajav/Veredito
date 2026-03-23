import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Send,
  Check,
  Clock,
  Archive,
  X,
  ImagePlus,
  Newspaper,
  Scale,
  BookOpen,
  MessageSquare,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  buildAutorOptions,
  buildEditoriaOptions,
  buildFonteOptions,
  ContentStatus,
  ContentTypeKey,
  contentStatusLabels,
  contentStatusStyles,
  EditorialWorkflowActionKey,
  getAvailableWorkflowActions,
  getContentTypeLabel,
  getWorkflowStageLabel,
  getWorkflowTargetStatus,
  workflowActionLabels,
  useEditorialStore,
} from "./editorial-store";

const tribunalOptions = [
  { value: "STF", label: "STF" },
  { value: "STJ", label: "STJ" },
  { value: "TST", label: "TST" },
  { value: "TRF-1", label: "TRF-1" },
  { value: "TRF-3", label: "TRF-3" },
  { value: "TJSP", label: "TJSP" },
  { value: "TJRJ", label: "TJRJ" },
];

const tipoDecisaoOptions = [
  { value: "Acórdão", label: "Acórdão" },
  { value: "Decisão Monocrática", label: "Decisão Monocrática" },
  { value: "Súmula", label: "Súmula" },
  { value: "Liminar", label: "Liminar" },
];

const impactoOptions = [
  { value: "alto", label: "Alto" },
  { value: "medio", label: "Médio" },
  { value: "baixo", label: "Baixo" },
];

const posicaoOptions = [
  { value: "Favorável", label: "Favorável" },
  { value: "Contrário", label: "Contrário" },
  { value: "Neutro", label: "Neutro" },
  { value: "Análise", label: "Análise" },
];

const tipoIcons: Record<ContentTypeKey, React.ElementType> = {
  noticia: Newspaper,
  decisao: Scale,
  artigo: BookOpen,
  opiniao: MessageSquare,
};

function Field({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-foreground">
        {label}{required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px] text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
    />
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px] text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
    >
      {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  );
}

function normalizeType(value: string | null): ContentTypeKey {
  return value === "decisao" || value === "artigo" || value === "opiniao" ? value : "noticia";
}

export default function ConteudoFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const {
    editorias,
    autores,
    fontes,
    getConteudoById,
    createConteudo,
    updateConteudo,
  } = useEditorialStore();

  const existing = id ? getConteudoById(Number(id)) : undefined;
  const tipo = existing?.typeKey || normalizeType(searchParams.get("tipo"));
  const isEditing = Boolean(existing);
  const TipoIcon = tipoIcons[tipo];

  const editoriaOptions = useMemo(() => buildEditoriaOptions(editorias), [editorias]);
  const autorOptions = useMemo(() => [{ value: "", label: "Selecionar autor..." }, ...buildAutorOptions(autores)], [autores]);
  const fonteOptions = useMemo(() => buildFonteOptions(fontes), [fontes]);
  const defaultEditoria = editoriaOptions[0]?.value || "";
  const defaultAutor = autorOptions[1]?.value || "";
  const isSourceType = tipo === "noticia" || tipo === "decisao";

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [editoria, setEditoria] = useState("");
  const [autor, setAutor] = useState("");
  const [fonte, setFonte] = useState("");
  const [lead, setLead] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [coverCaption, setCoverCaption] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [status, setStatus] = useState<ContentStatus>("draft");
  const [tribunal, setTribunal] = useState("STF");
  const [processoNumero, setProcessoNumero] = useState("");
  const [relator, setRelator] = useState("");
  const [dataJulgamento, setDataJulgamento] = useState("");
  const [tipoDecisao, setTipoDecisao] = useState("Acórdão");
  const [teseFixada, setTeseFixada] = useState("");
  const [impacto, setImpacto] = useState("medio");
  const [temaCentral, setTemaCentral] = useState("");
  const [referencias, setReferencias] = useState("");
  const [posicao, setPosicao] = useState("Análise");
  const [disclaimer, setDisclaimer] = useState("As opiniões expressas neste texto são de responsabilidade do autor e não refletem necessariamente a posição editorial do Veredito.");

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setSubtitle(existing.subtitle);
      setEditoria(String(existing.editoriaId));
      setAutor(String(existing.authorId));
      setFonte(existing.fonteId ? String(existing.fonteId) : "");
      setLead(existing.lead);
      setBody(existing.body);
      setTags(existing.tags.join(", "));
      setCoverCaption(existing.coverCaption);
      setMetaTitle(existing.metaTitle);
      setMetaDesc(existing.metaDesc);
      setStatus(existing.status);
      setTribunal(existing.tribunal || "STF");
      setProcessoNumero(existing.processoNumero);
      setRelator(existing.relator);
      setDataJulgamento(existing.dataJulgamento);
      setTipoDecisao(existing.tipoDecisao || "Acórdão");
      setTeseFixada(existing.teseFixada);
      setImpacto(existing.impacto || "medio");
      setTemaCentral(existing.temaCentral);
      setReferencias(existing.referencias);
      setPosicao(existing.posicao || "Análise");
      setDisclaimer(existing.disclaimer || "As opiniões expressas neste texto são de responsabilidade do autor e não refletem necessariamente a posição editorial do Veredito.");
      return;
    }

    setTitle("");
    setSubtitle("");
    setEditoria(defaultEditoria);
    setAutor(defaultAutor);
    setFonte("");
    setLead("");
    setBody("");
    setTags("");
    setCoverCaption("");
    setMetaTitle("");
    setMetaDesc("");
    setStatus("draft");
    setTribunal("STF");
    setProcessoNumero("");
    setRelator("");
    setDataJulgamento("");
    setTipoDecisao("Acórdão");
    setTeseFixada("");
    setImpacto("medio");
    setTemaCentral("");
    setReferencias("");
    setPosicao("Análise");
    setDisclaimer("As opiniões expressas neste texto são de responsabilidade do autor e não refletem necessariamente a posição editorial do Veredito.");
  }, [existing, defaultEditoria, defaultAutor]);

  const wordCount = useMemo(() => body.split(/\s+/).filter(Boolean).length, [body]);
  const readTime = useMemo(() => Math.max(1, Math.ceil(wordCount / 200)), [wordCount]);
  const availableActions = useMemo(() => getAvailableWorkflowActions(status), [status]);

  const handleSave = (workflowAction?: EditorialWorkflowActionKey) => {
    if (!title.trim()) {
      toast.error("Título é obrigatório");
      return;
    }
    if (!editoria) {
      toast.error("Editoria é obrigatória");
      return;
    }
    if (!autor) {
      toast.error("Autor é obrigatório");
      return;
    }

    const finalStatus = workflowAction ? getWorkflowTargetStatus(workflowAction) : status;
    const payload = {
      title: title.trim(),
      typeKey: tipo,
      editoriaId: Number(editoria),
      authorId: Number(autor),
      status: finalStatus,
      subtitle: subtitle.trim(),
      lead: lead.trim(),
      body,
      tags: tags.split(",").map((item) => item.trim()).filter(Boolean),
      coverCaption: coverCaption.trim(),
      metaTitle: metaTitle.trim() || title.trim(),
      metaDesc: metaDesc.trim() || lead.trim(),
      fonteId: isSourceType && fonte ? Number(fonte) : null,
      tribunal: tipo === "decisao" ? tribunal : "",
      processoNumero: tipo === "decisao" ? processoNumero.trim() : "",
      relator: tipo === "decisao" ? relator.trim() : "",
      dataJulgamento: tipo === "decisao" ? dataJulgamento : "",
      tipoDecisao: tipo === "decisao" ? tipoDecisao : "",
      teseFixada: tipo === "decisao" ? teseFixada.trim() : "",
      impacto: tipo === "decisao" ? impacto : "",
      temaCentral: tipo === "artigo" ? temaCentral.trim() : "",
      referencias: tipo === "artigo" ? referencias.trim() : "",
      posicao: tipo === "opiniao" ? posicao : "",
      disclaimer: tipo === "opiniao" ? disclaimer.trim() : "",
    };

    let targetId = existing?.id;
    if (existing) {
      updateConteudo(existing.id, payload, workflowAction ? { workflowAction } : undefined);
    } else {
      targetId = createConteudo(payload, workflowAction ? { workflowAction } : undefined);
    }

    setStatus(finalStatus);
    toast.success(
      workflowAction
        ? workflowActionLabels[workflowAction]
        : "Rascunho salvo"
    );

    if (!existing && targetId) {
      navigate(`/admin/conteudos/${targetId}/editar`, { replace: true });
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/admin/conteudos")} className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <TipoIcon className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-display text-xl text-foreground">{isEditing ? "Editar" : "Nova"} {getContentTypeLabel(tipo)}</h2>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && (
            <button onClick={() => navigate(`/admin/conteudos/${existing.id}/preview`)} className="flex h-9 items-center gap-1.5 rounded-md border border-input bg-card px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-secondary">
              <Eye className="h-3.5 w-3.5" strokeWidth={1.5} /> Ver preview
            </button>
          )}
          <button onClick={() => navigate("/admin/conteudos")} className="h-9 rounded-md border border-input bg-card px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-secondary">Cancelar</button>
          <button onClick={() => handleSave()} className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <Save className="h-3.5 w-3.5" strokeWidth={2} /> Salvar
          </button>
        </div>
      </div>

      <div className="flex items-start gap-6">
        <div className="min-w-0 flex-1 space-y-5">
          <div className="space-y-4 rounded-lg bg-card p-6 shadow-editorial">
            <Field label="Título" required>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={`Título da ${getContentTypeLabel(tipo).toLowerCase()}`} />
            </Field>
            <Field label="Subtítulo">
              <Input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} placeholder="Subtítulo ou linha de apoio" />
            </Field>
            <Field label="Lead / Chamada" hint={`${lead.length}/280 caracteres`}>
              <Textarea value={lead} onChange={(event) => setLead(event.target.value.slice(0, 280))} placeholder="Resumo curto para listagens e redes sociais" rows={2} />
            </Field>
          </div>

          {tipo === "decisao" && (
            <div className="space-y-4 rounded-lg bg-card p-6 shadow-editorial">
              <h3 className="flex items-center gap-2 font-ui text-[13px] font-semibold text-foreground"><Scale className="h-4 w-4 text-bronze" strokeWidth={1.5} /> Dados da decisão</h3>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Tribunal" required><Select value={tribunal} onChange={setTribunal} options={tribunalOptions} /></Field>
                <Field label="Tipo de decisão"><Select value={tipoDecisao} onChange={setTipoDecisao} options={tipoDecisaoOptions} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Número do processo"><Input value={processoNumero} onChange={(event) => setProcessoNumero(event.target.value)} placeholder="0000000-00.0000.0.00.0000" /></Field>
                <Field label="Relator"><Input value={relator} onChange={(event) => setRelator(event.target.value)} placeholder="Min. Nome do Relator" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Data do julgamento"><Input type="date" value={dataJulgamento} onChange={(event) => setDataJulgamento(event.target.value)} /></Field>
                <Field label="Impacto"><Select value={impacto} onChange={setImpacto} options={impactoOptions} /></Field>
              </div>
              <Field label="Tese fixada"><Textarea value={teseFixada} onChange={(event) => setTeseFixada(event.target.value)} placeholder="Tese fixada pelo tribunal..." rows={3} /></Field>
            </div>
          )}

          {tipo === "artigo" && (
            <div className="space-y-4 rounded-lg bg-card p-6 shadow-editorial">
              <h3 className="flex items-center gap-2 font-ui text-[13px] font-semibold text-foreground"><BookOpen className="h-4 w-4 text-bronze" strokeWidth={1.5} /> Dados do artigo</h3>
              <Field label="Tema central"><Input value={temaCentral} onChange={(event) => setTemaCentral(event.target.value)} placeholder="Tema principal do artigo" /></Field>
              <Field label="Referências bibliográficas"><Textarea value={referencias} onChange={(event) => setReferencias(event.target.value)} placeholder="Uma referência por linha..." rows={4} /></Field>
            </div>
          )}

          {tipo === "opiniao" && (
            <div className="space-y-4 rounded-lg bg-card p-6 shadow-editorial">
              <h3 className="flex items-center gap-2 font-ui text-[13px] font-semibold text-foreground"><MessageSquare className="h-4 w-4 text-bronze" strokeWidth={1.5} /> Dados da opinião</h3>
              <Field label="Posição editorial"><Select value={posicao} onChange={setPosicao} options={posicaoOptions} /></Field>
              <Field label="Disclaimer"><Textarea value={disclaimer} onChange={(event) => setDisclaimer(event.target.value)} rows={2} /></Field>
            </div>
          )}

          <div className="space-y-4 rounded-lg bg-card p-6 shadow-editorial">
            <div className="flex items-center justify-between">
              <h3 className="font-ui text-[13px] font-semibold text-foreground">Corpo do texto</h3>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="tabular-nums">{wordCount} palavras</span>
                <span>·</span>
                <span className="tabular-nums">{readTime} min de leitura</span>
              </div>
            </div>
            <Textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="Escreva o conteúdo aqui..." rows={16} style={{ minHeight: "320px" }} />
          </div>

          <div className="space-y-4 rounded-lg bg-card p-6 shadow-editorial">
            <h3 className="font-ui text-[13px] font-semibold text-foreground">SEO</h3>
            <Field label="Meta título" hint="Recomendado: até 60 caracteres"><Input value={metaTitle} onChange={(event) => setMetaTitle(event.target.value)} placeholder={title || "Título para mecanismos de busca"} /></Field>
            <Field label="Meta descrição" hint="Recomendado: até 160 caracteres"><Textarea value={metaDesc} onChange={(event) => setMetaDesc(event.target.value)} placeholder={lead || "Descrição para mecanismos de busca"} rows={2} /></Field>
          </div>
        </div>

        <div className="sticky top-20 w-80 shrink-0 space-y-4">
          <div className="space-y-4 rounded-lg bg-card p-5 shadow-editorial">
            <div className="flex items-center justify-between">
              <h3 className="font-ui text-[13px] font-semibold text-foreground">Status</h3>
              <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium", contentStatusStyles[status])}>{contentStatusLabels[status]}</span>
            </div>
            <div className="rounded-md border border-bronze/20 bg-bronze/5 px-3 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-bronze">Etapa editorial</p>
              <p className="mt-1 text-[13px] font-medium text-foreground">{getWorkflowStageLabel(status)}</p>
            </div>
            <div className="space-y-2">
              {availableActions.map((actionKey) => {
                const isPrimary = actionKey === "send_review" || actionKey === "approve" || actionKey === "publish_now" || actionKey === "restore_draft";
                const isDestructive = actionKey === "archive";
                const Icon =
                  actionKey === "schedule" ? Clock :
                  actionKey === "archive" ? Archive :
                  actionKey === "request_adjustments" || actionKey === "restore_draft" || actionKey === "back_to_approved" ? ArrowLeft :
                  actionKey === "save_draft" ? Save :
                  actionKey === "send_review" ? Send :
                  Check;

                return (
                  <button
                    key={actionKey}
                    onClick={() => handleSave(actionKey)}
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

          <div className="space-y-4 rounded-lg bg-card p-5 shadow-editorial">
            <h3 className="font-ui text-[13px] font-semibold text-foreground">Metadados</h3>
            <Field label="Editoria" required><Select value={editoria} onChange={setEditoria} options={editoriaOptions} /></Field>
            <Field label="Autor" required><Select value={autor} onChange={setAutor} options={autorOptions} /></Field>
            {isSourceType && <Field label="Fonte"><Select value={fonte} onChange={setFonte} options={fonteOptions} /></Field>}
            <Field label="Tags" hint="Separadas por vírgula"><Input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="reforma, tributário, STF" /></Field>
          </div>

          <div className="space-y-4 rounded-lg bg-card p-5 shadow-editorial">
            <h3 className="font-ui text-[13px] font-semibold text-foreground">Imagem de capa</h3>
            <button className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-8 text-muted-foreground transition-colors hover:border-ring hover:text-foreground">
              <ImagePlus className="mb-2 h-8 w-8" strokeWidth={1} />
              <span className="text-[12px] font-medium">Clique para adicionar</span>
              <span className="mt-0.5 text-[11px] text-muted-foreground">JPG, PNG até 5MB</span>
            </button>
            <Field label="Legenda"><Input value={coverCaption} onChange={(event) => setCoverCaption(event.target.value)} placeholder="Legenda da imagem" /></Field>
          </div>
        </div>
      </div>
    </div>
  );
}
