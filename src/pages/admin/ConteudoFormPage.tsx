import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import {
  ArrowLeft, Save, Send, Check, Eye, Clock, Archive,
  X, ChevronRight, ImagePlus, Newspaper, Scale, BookOpen, MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { initialAutoresShared } from "./PlaceholderPages";

/* ── helpers ─────────────────────────────────── */

const editoriaOptions = [
  { value: "Tributário", label: "Tributário" },
  { value: "Empresarial", label: "Empresarial" },
  { value: "Imobiliário", label: "Imobiliário" },
  { value: "Sucessório", label: "Sucessório" },
  { value: "Trabalhista", label: "Trabalhista" },
  { value: "Constitucional", label: "Constitucional" },
];

const fonteOptions = [
  { value: "", label: "Nenhuma" },
  { value: "STF", label: "STF" },
  { value: "STJ", label: "STJ" },
  { value: "TST", label: "TST" },
  { value: "CNJ", label: "CNJ" },
  { value: "RFB", label: "Receita Federal" },
  { value: "DOU", label: "Diário Oficial" },
];

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

const statusLabels: Record<string, string> = {
  draft: "Rascunho", review: "Revisão", approved: "Aprovado",
  scheduled: "Agendado", published: "Publicado", archived: "Arquivado",
};

const statusColors: Record<string, string> = {
  draft: "bg-status-draft/10 text-status-draft",
  review: "bg-status-review/10 text-status-review",
  approved: "bg-status-approved/10 text-status-approved",
  scheduled: "bg-status-scheduled/10 text-status-scheduled",
  published: "bg-status-published/10 text-status-published",
  archived: "bg-status-archived/10 text-status-archived",
};

const tipoIcons: Record<string, React.ElementType> = {
  noticia: Newspaper, decisao: Scale, artigo: BookOpen, opiniao: MessageSquare,
};

const tipoLabels: Record<string, string> = {
  noticia: "Notícia", decisao: "Decisão", artigo: "Artigo", opiniao: "Opinião",
};

/* ── field components ─────────────────────────── */

function Field({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-foreground">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
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
      className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full rounded-md border border-input bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors resize-none"
    />
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

/* ── main page ─────────────────────────────────── */

export default function ConteudoFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id } = useParams();

  const tipo = searchParams.get("tipo") || "noticia";
  const isEditing = !!id;
  const TipoIcon = tipoIcons[tipo] || Newspaper;

  // Common fields
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [editoria, setEditoria] = useState("Tributário");
  const [autor, setAutor] = useState("");
  const [fonte, setFonte] = useState("");
  const [lead, setLead] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [coverCaption, setCoverCaption] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [status, setStatus] = useState("draft");

  // Decisão fields
  const [tribunal, setTribunal] = useState("STF");
  const [processoNumero, setProcessoNumero] = useState("");
  const [relator, setRelator] = useState("");
  const [dataJulgamento, setDataJulgamento] = useState("");
  const [tipoDecisao, setTipoDecisao] = useState("Acórdão");
  const [teseFixada, setTeseFixada] = useState("");
  const [impacto, setImpacto] = useState("medio");

  // Artigo fields
  const [temaCentral, setTemaCentral] = useState("");
  const [referencias, setReferencias] = useState("");

  // Opinião fields
  const [posicao, setPosicao] = useState("Análise");
  const [disclaimer, setDisclaimer] = useState("As opiniões expressas neste texto são de responsabilidade do autor e não refletem necessariamente a posição editorial do Veredito.");

  const wordCount = useMemo(() => body.split(/\s+/).filter(Boolean).length, [body]);
  const readTime = useMemo(() => Math.max(1, Math.ceil(wordCount / 200)), [wordCount]);

  const handleSave = (newStatus?: string) => {
    if (!title.trim()) { toast.error("Título é obrigatório"); return; }
    if (!autor) { toast.error("Autor é obrigatório"); return; }

    const s = newStatus || status;
    setStatus(s);
    toast.success(
      s === "review" ? "Enviado para revisão" :
      s === "approved" ? "Conteúdo aprovado" :
      s === "published" ? "Conteúdo publicado" :
      s === "scheduled" ? "Publicação agendada" :
      s === "archived" ? "Conteúdo arquivado" :
      "Rascunho salvo"
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/conteudos")}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <TipoIcon className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-display text-xl text-foreground">
                {isEditing ? "Editar" : "Nova"} {tipoLabels[tipo]}
              </h2>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/admin/conteudos")}
            className="h-9 rounded-md border border-input bg-card px-4 text-[13px] font-medium text-foreground hover:bg-secondary transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => handleSave()}
            className="h-9 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5"
          >
            <Save className="h-3.5 w-3.5" strokeWidth={2} />
            Salvar
          </button>
        </div>
      </div>

      {/* Split layout */}
      <div className="flex gap-6 items-start">
        {/* Main content - 2/3 */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Core fields card */}
          <div className="rounded-lg bg-card p-6 shadow-editorial space-y-4">
            <Field label="Título" required>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={`Título da ${tipoLabels[tipo].toLowerCase()}`} />
            </Field>
            <Field label="Subtítulo">
              <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Subtítulo ou linha de apoio" />
            </Field>
            <Field label="Lead / Chamada" hint={`${lead.length}/280 caracteres`}>
              <Textarea value={lead} onChange={(e) => setLead(e.target.value.slice(0, 280))} placeholder="Resumo curto para listagens e redes sociais" rows={2} />
            </Field>
          </div>

          {/* Type-specific fields */}
          {tipo === "decisao" && (
            <div className="rounded-lg bg-card p-6 shadow-editorial space-y-4">
              <h3 className="text-[13px] font-semibold text-foreground font-ui flex items-center gap-2">
                <Scale className="h-4 w-4 text-bronze" strokeWidth={1.5} />
                Dados da decisão
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Tribunal" required>
                  <Select value={tribunal} onChange={setTribunal} options={tribunalOptions} />
                </Field>
                <Field label="Tipo de decisão">
                  <Select value={tipoDecisao} onChange={setTipoDecisao} options={tipoDecisaoOptions} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Número do processo">
                  <Input value={processoNumero} onChange={(e) => setProcessoNumero(e.target.value)} placeholder="0000000-00.0000.0.00.0000" />
                </Field>
                <Field label="Relator">
                  <Input value={relator} onChange={(e) => setRelator(e.target.value)} placeholder="Min. Nome do Relator" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Data do julgamento">
                  <Input type="date" value={dataJulgamento} onChange={(e) => setDataJulgamento(e.target.value)} />
                </Field>
                <Field label="Impacto">
                  <Select value={impacto} onChange={setImpacto} options={impactoOptions} />
                </Field>
              </div>
              <Field label="Tese fixada">
                <Textarea value={teseFixada} onChange={(e) => setTeseFixada(e.target.value)} placeholder="Tese fixada pelo tribunal..." rows={3} />
              </Field>
            </div>
          )}

          {tipo === "artigo" && (
            <div className="rounded-lg bg-card p-6 shadow-editorial space-y-4">
              <h3 className="text-[13px] font-semibold text-foreground font-ui flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-bronze" strokeWidth={1.5} />
                Dados do artigo
              </h3>
              <Field label="Tema central">
                <Input value={temaCentral} onChange={(e) => setTemaCentral(e.target.value)} placeholder="Tema principal do artigo" />
              </Field>
              <Field label="Referências bibliográficas">
                <Textarea value={referencias} onChange={(e) => setReferencias(e.target.value)} placeholder="Uma referência por linha..." rows={4} />
              </Field>
            </div>
          )}

          {tipo === "opiniao" && (
            <div className="rounded-lg bg-card p-6 shadow-editorial space-y-4">
              <h3 className="text-[13px] font-semibold text-foreground font-ui flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-bronze" strokeWidth={1.5} />
                Dados da opinião
              </h3>
              <Field label="Posição editorial">
                <Select value={posicao} onChange={setPosicao} options={posicaoOptions} />
              </Field>
              <Field label="Disclaimer">
                <Textarea value={disclaimer} onChange={(e) => setDisclaimer(e.target.value)} rows={2} />
              </Field>
            </div>
          )}

          {/* Body */}
          <div className="rounded-lg bg-card p-6 shadow-editorial space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-foreground font-ui">Corpo do texto</h3>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="tabular-nums">{wordCount} palavras</span>
                <span>·</span>
                <span className="tabular-nums">{readTime} min de leitura</span>
              </div>
            </div>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Escreva o conteúdo aqui..."
              rows={16}
              style={{ minHeight: "320px" }}
            />
          </div>

          {/* SEO */}
          <div className="rounded-lg bg-card p-6 shadow-editorial space-y-4">
            <h3 className="text-[13px] font-semibold text-foreground font-ui">SEO</h3>
            <Field label="Meta título" hint="Recomendado: até 60 caracteres">
              <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder={title || "Título para mecanismos de busca"} />
            </Field>
            <Field label="Meta descrição" hint="Recomendado: até 160 caracteres">
              <Textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} placeholder={lead || "Descrição para mecanismos de busca"} rows={2} />
            </Field>
          </div>
        </div>

        {/* Sidebar - 1/3 */}
        <div className="w-80 shrink-0 space-y-4 sticky top-20">
          {/* Status & Actions */}
          <div className="rounded-lg bg-card p-5 shadow-editorial space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-foreground font-ui">Status</h3>
              <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium", statusColors[status])}>
                {statusLabels[status]}
              </span>
            </div>

            {/* Action buttons based on status */}
            <div className="space-y-2">
              {status === "draft" && (
                <>
                  <button onClick={() => handleSave("draft")} className="flex w-full h-9 items-center justify-center gap-1.5 rounded-md border border-input bg-card text-[13px] font-medium text-foreground hover:bg-secondary transition-colors">
                    <Save className="h-3.5 w-3.5" strokeWidth={1.5} /> Salvar rascunho
                  </button>
                  <button onClick={() => handleSave("review")} className="flex w-full h-9 items-center justify-center gap-1.5 rounded-md bg-primary text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                    <Send className="h-3.5 w-3.5" strokeWidth={1.5} /> Enviar para revisão
                  </button>
                </>
              )}
              {status === "review" && (
                <>
                  <button onClick={() => handleSave("approved")} className="flex w-full h-9 items-center justify-center gap-1.5 rounded-md bg-primary text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                    <Check className="h-3.5 w-3.5" strokeWidth={2} /> Aprovar
                  </button>
                  <button onClick={() => handleSave("draft")} className="flex w-full h-9 items-center justify-center gap-1.5 rounded-md border border-input bg-card text-[13px] font-medium text-foreground hover:bg-secondary transition-colors">
                    <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> Devolver ao autor
                  </button>
                </>
              )}
              {status === "approved" && (
                <>
                  <button onClick={() => handleSave("published")} className="flex w-full h-9 items-center justify-center gap-1.5 rounded-md bg-primary text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                    <Check className="h-3.5 w-3.5" strokeWidth={2} /> Publicar agora
                  </button>
                  <button onClick={() => handleSave("scheduled")} className="flex w-full h-9 items-center justify-center gap-1.5 rounded-md border border-input bg-card text-[13px] font-medium text-foreground hover:bg-secondary transition-colors">
                    <Clock className="h-3.5 w-3.5" strokeWidth={1.5} /> Agendar publicação
                  </button>
                </>
              )}
              {status === "scheduled" && (
                <>
                  <button onClick={() => handleSave("published")} className="flex w-full h-9 items-center justify-center gap-1.5 rounded-md bg-primary text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                    <Check className="h-3.5 w-3.5" strokeWidth={2} /> Publicar agora
                  </button>
                  <button onClick={() => handleSave("approved")} className="flex w-full h-9 items-center justify-center gap-1.5 rounded-md border border-input bg-card text-[13px] font-medium text-foreground hover:bg-secondary transition-colors">
                    <X className="h-3.5 w-3.5" strokeWidth={1.5} /> Cancelar agendamento
                  </button>
                </>
              )}
              {status === "published" && (
                <>
                  <button onClick={() => handleSave("draft")} className="flex w-full h-9 items-center justify-center gap-1.5 rounded-md border border-input bg-card text-[13px] font-medium text-foreground hover:bg-secondary transition-colors">
                    <X className="h-3.5 w-3.5" strokeWidth={1.5} /> Despublicar
                  </button>
                  <button onClick={() => handleSave("archived")} className="flex w-full h-9 items-center justify-center gap-1.5 rounded-md border border-input bg-card text-[13px] font-medium text-destructive hover:bg-destructive/10 transition-colors">
                    <Archive className="h-3.5 w-3.5" strokeWidth={1.5} /> Arquivar
                  </button>
                </>
              )}
              {status === "archived" && (
                <button onClick={() => handleSave("draft")} className="flex w-full h-9 items-center justify-center gap-1.5 rounded-md bg-primary text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> Restaurar como rascunho
                </button>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="rounded-lg bg-card p-5 shadow-editorial space-y-4">
            <h3 className="text-[13px] font-semibold text-foreground font-ui">Metadados</h3>
            <Field label="Editoria" required>
              <Select value={editoria} onChange={setEditoria} options={editoriaOptions} />
            </Field>
            <Field label="Autor" required>
              <Select
                value={autor}
                onChange={setAutor}
                options={[
                  { value: "", label: "Selecionar autor..." },
                  ...initialAutoresShared.map((a) => ({ value: a.name, label: a.name })),
                ]}
              />
            </Field>
            <Field label="Fonte">
              <Select value={fonte} onChange={setFonte} options={fonteOptions} />
            </Field>
            <Field label="Tags" hint="Separadas por vírgula">
              <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="reforma, tributário, STF" />
            </Field>
          </div>

          {/* Cover image */}
          <div className="rounded-lg bg-card p-5 shadow-editorial space-y-4">
            <h3 className="text-[13px] font-semibold text-foreground font-ui">Imagem de capa</h3>
            <button className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-8 text-muted-foreground hover:border-ring hover:text-foreground transition-colors">
              <ImagePlus className="h-8 w-8 mb-2" strokeWidth={1} />
              <span className="text-[12px] font-medium">Clique para adicionar</span>
              <span className="text-[11px] text-muted-foreground mt-0.5">JPG, PNG até 5MB</span>
            </button>
            <Field label="Legenda">
              <Input value={coverCaption} onChange={(e) => setCoverCaption(e.target.value)} placeholder="Legenda da imagem" />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}
