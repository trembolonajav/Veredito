import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Archive, ArrowLeft, BookOpen, Check, CheckSquare, Clock, Eye, Globe, Home as HomeIcon, ImagePlus, MessageSquare, Newspaper, Save, Scale, Send, X, Zap } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { editorialImages } from "@/domain/editorial/mockData";
import { currentUserCan, getAvailableWorkflowTransitions, getEditorialAuthors, getEditorialEditorias, getEditorialSources, getWorkflowTransitionIssues } from "@/domain/editorial/selectors";
import { addWorkflowComment, getEditorialContentById, transitionWorkflowStatus, upsertEditorialContent, useEditorialSnapshot } from "@/domain/editorial/store";
import type { ContentStatus, ContentType, EditorialPriority } from "@/domain/editorial/types";

const tipoIcons: Record<string, React.ElementType> = { noticia: Newspaper, decisao: Scale, artigo: BookOpen, opiniao: MessageSquare };
const tipoLabels: Record<string, string> = { noticia: "Notícia", decisao: "Decisão", artigo: "Artigo", opiniao: "Opinião" };
const imageOptions = Object.keys(editorialImages).map((value) => ({ value, label: value }));
const priorityOptions: { value: EditorialPriority; label: string }[] = [{ value: "low", label: "Baixa" }, { value: "medium", label: "Média" }, { value: "high", label: "Alta" }, { value: "critical", label: "Crítica" }];
const tribunalOptions = ["STF", "STJ", "TST", "TRF-1", "TRF-3", "TJ-SP"].map((value) => ({ value, label: value }));
const tipoDecisaoOptions = ["Acórdão", "Decisão Monocrática", "Súmula", "Liminar", "Recurso Repetitivo"].map((value) => ({ value, label: value }));
const impactoOptions = [{ value: "low", label: "Baixo" }, { value: "medium", label: "Médio" }, { value: "high", label: "Alto" }];
const statusLabels: Record<string, string> = { draft: "Rascunho", in_review: "Revisão editorial", legal_review: "Revisão jurídica", approved: "Aprovado", scheduled: "Agendado", published: "Publicado", archived: "Arquivado" };
const statusColors: Record<string, string> = { draft: "bg-status-draft/10 text-status-draft", in_review: "bg-status-review/10 text-status-review", legal_review: "bg-status-review/10 text-status-review", approved: "bg-status-approved/10 text-status-approved", scheduled: "bg-status-scheduled/10 text-status-scheduled", published: "bg-status-published/10 text-status-published", archived: "bg-status-archived/10 text-status-archived" };

function Field({ label, children, hint, required }: { label: string; children: React.ReactNode; hint?: string; required?: boolean }) {
  return <div><label className="mb-1.5 block text-[12px] font-medium text-foreground">{label}{required && <span className="text-destructive ml-0.5">*</span>}</label>{children}{hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}</div>;
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) { return <input {...props} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors" />; }
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea {...props} className="w-full rounded-md border border-input bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors resize-none" />; }
function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) { return <select value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors">{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>; }
function generateSlug(title: string) { return title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function mapRouteTypeToDomain(tipo: string): ContentType { return tipo === "noticia" ? "news" : tipo === "decisao" ? "decision" : tipo === "artigo" ? "article" : "opinion"; }
function mapDomainTypeToRoute(type: ContentType) { return type === "news" ? "noticia" : type === "decision" ? "decisao" : type === "article" ? "artigo" : "opiniao"; }

export default function ConteudoFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const snapshot = useEditorialSnapshot();
  const existing = id ? getEditorialContentById(id) : null;
  const routeTipo = existing?.content ? mapDomainTypeToRoute(existing.content.type) : (searchParams.get("tipo") || "noticia");
  const TipoIcon = tipoIcons[routeTipo] || Newspaper;
  const canEditContent = currentUserCan("edit_content", snapshot) || currentUserCan("edit_own_content", snapshot);
  const canSubmitReview = currentUserCan("submit_review", snapshot);
  const canLegalReview = currentUserCan("legal_review", snapshot);
  const canApprove = currentUserCan("approve", snapshot);
  const canPublish = currentUserCan("publish", snapshot);
  const canEditHome = currentUserCan("edit_home", snapshot);
  const editorias = getEditorialEditorias(snapshot).map((item) => ({ value: item.name, label: item.name }));
  const autores = [{ value: "", label: "Selecionar autor..." }, ...getEditorialAuthors(snapshot).map((item) => ({ value: item.name, label: `${item.name} (${item.role})` }))];
  const fontes = [{ value: "", label: "Nenhuma" }, ...getEditorialSources(snapshot).map((item) => ({ value: item.shortName, label: item.shortName }))];
  const [tab, setTab] = useState("conteudo");
  const [title, setTitle] = useState(""); const [subtitle, setSubtitle] = useState(""); const [lead, setLead] = useState(""); const [summary, setSummary] = useState(""); const [slug, setSlug] = useState(""); const [body, setBody] = useState("");
  const [editoria, setEditoria] = useState(editorias[0]?.value || ""); const [autor, setAutor] = useState(""); const [fonte, setFonte] = useState(""); const [priority, setPriority] = useState<EditorialPriority>("medium"); const [tags, setTags] = useState(""); const [status, setStatus] = useState("draft");
  const [metaTitle, setMetaTitle] = useState(""); const [metaDesc, setMetaDesc] = useState(""); const [ogTitle, setOgTitle] = useState(""); const [ogDesc, setOgDesc] = useState(""); const [canonical, setCanonical] = useState(""); const [noindex, setNoindex] = useState(false);
  const [coverImage, setCoverImage] = useState(imageOptions[0]?.value || ""); const [socialImage, setSocialImage] = useState(imageOptions[0]?.value || ""); const [coverCaption, setCoverCaption] = useState(""); const [coverAlt, setCoverAlt] = useState(""); const [coverCredit, setCoverCredit] = useState("");
  const [relatedIds, setRelatedIds] = useState(""); const [homeSlotType, setHomeSlotType] = useState("list"); const [exposureEndsAt, setExposureEndsAt] = useState("");
  const [isUrgent, setIsUrgent] = useState(false); const [urgentTitle, setUrgentTitle] = useState(""); const [urgentExpiresAt, setUrgentExpiresAt] = useState(""); const [isHome, setIsHome] = useState(false); const [isNewsletter, setIsNewsletter] = useState(false); const [scheduledDate, setScheduledDate] = useState("");
  const [tribunal, setTribunal] = useState("STF"); const [tipoDecisao, setTipoDecisao] = useState("Acórdão"); const [relator, setRelator] = useState(""); const [processoNumero, setProcessoNumero] = useState(""); const [dataJulgamento, setDataJulgamento] = useState(""); const [teseFixada, setTeseFixada] = useState(""); const [ementa, setEmenta] = useState(""); const [impacto, setImpacto] = useState("medium"); const [linkFonte, setLinkFonte] = useState(""); const [temaAfetado, setTemaAfetado] = useState(""); const [workflowComment, setWorkflowComment] = useState("");

  useEffect(() => {
    if (!existing?.content) return;
    const ed = snapshot.editorias.find((item) => item.id === existing.content?.editoriaId);
    const au = snapshot.authors.find((item) => item.id === existing.content?.authorId);
    const so = snapshot.sources.find((item) => item.id === existing.content?.sourceId);
    setTitle(existing.content.title); setSubtitle(existing.content.subtitle || ""); setLead(existing.content.lead || ""); setSummary(existing.content.summaryCard || ""); setSlug(existing.content.slug); setBody(existing.content.body);
    setEditoria(ed?.name || ""); setAutor(au?.name || ""); setFonte(so?.shortName || ""); setPriority(existing.content.editorialPriority); setTags(existing.content.tags.join(", ")); setStatus(existing.content.status);
    setMetaTitle(existing.seo?.seoTitle || ""); setMetaDesc(existing.seo?.seoDescription || ""); setOgTitle(existing.seo?.ogTitle || ""); setOgDesc(existing.seo?.ogDescription || ""); setCanonical(existing.seo?.canonicalUrl || ""); setNoindex(existing.seo?.noindex || false);
    setCoverImage(existing.media?.coverImageId || ""); setSocialImage(existing.media?.socialImageId || ""); setCoverCaption(existing.media?.caption || ""); setCoverAlt(existing.media?.altText || ""); setCoverCredit(existing.media?.credit || "");
    setRelatedIds(existing.content.relatedContentIds.join(", ")); setHomeSlotType(existing.exposure?.homeSlotType || "list"); setExposureEndsAt(existing.exposure?.exposureEndsAt ? existing.exposure.exposureEndsAt.slice(0, 16) : "");
    setIsUrgent(existing.exposure?.isUrgent || false); setUrgentTitle(existing.exposure?.urgentTitle || ""); setUrgentExpiresAt(existing.exposure?.urgentExpiresAt ? existing.exposure.urgentExpiresAt.slice(0, 16) : ""); setIsHome(existing.exposure?.homeVisibility || false); setIsNewsletter(existing.exposure?.isNewsletterFeatured || false); setScheduledDate(existing.content.scheduledAt ? existing.content.scheduledAt.slice(0, 16) : "");
    if (existing.decisionMeta) { setTribunal(existing.decisionMeta.court); setTipoDecisao(existing.decisionMeta.decisionType); setRelator(existing.decisionMeta.rapporteur); setProcessoNumero(existing.decisionMeta.caseNumber); setDataJulgamento(existing.decisionMeta.judgmentDate); setTeseFixada(existing.decisionMeta.thesis || ""); setEmenta(existing.decisionMeta.syllabus || ""); setImpacto(existing.decisionMeta.practicalImpact || "medium"); setLinkFonte(existing.decisionMeta.officialUrl || ""); setTemaAfetado(existing.decisionMeta.affectedTheme || ""); }
  }, [existing, snapshot]);

  const wordCount = useMemo(() => body.split(/\s+/).filter(Boolean).length, [body]);
  const readTime = useMemo(() => Math.max(1, Math.ceil(wordCount / 200)), [wordCount]);
  const seoScore = useMemo(() => (metaTitle || title ? 25 : 0) + (metaDesc || lead ? 25 : 0) + (slug ? 25 : 0) + (coverAlt ? 25 : 0), [coverAlt, lead, metaDesc, metaTitle, slug, title]);
  const contentId = existing?.content?.id || slug || "draft-preview";
  const checklist = useMemo(() => ([
    { key: "title", label: "Título preenchido", checked: Boolean(title.trim()), required: true },
    { key: "slug", label: "Slug preenchido", checked: Boolean((slug || generateSlug(title)).trim()), required: true },
    { key: "coverImage", label: "Imagem de capa", checked: Boolean(coverImage), required: true },
    { key: "altText", label: "Alt text", checked: Boolean(coverAlt.trim()), required: true },
    { key: "imageCredit", label: "Crédito de imagem", checked: Boolean(coverCredit.trim()), required: true },
    { key: "seo", label: "SEO mínimo", checked: Boolean((metaTitle || title).trim() && (metaDesc || lead).trim()), required: true },
    { key: "editoria", label: "Editoria", checked: Boolean(editoria), required: true },
    { key: "author", label: "Autor", checked: Boolean(autor), required: true },
    { key: "review", label: "Passou por revisão", checked: ["approved", "scheduled", "published"].includes(status), required: true },
    { key: "source", label: "Fonte preenchida quando aplicável", checked: routeTipo === "opiniao" || Boolean(fonte), required: false },
  ]), [autor, coverAlt, coverCredit, coverImage, editoria, fonte, lead, metaDesc, metaTitle, routeTipo, slug, status, title]);
  const checklistDone = checklist.filter((item) => item.checked).length;
  const workflowTransitions = existing?.content ? getAvailableWorkflowTransitions(existing.content.id, snapshot) : ["in_review", "legal_review", "approved", "scheduled", "published", "archived"];
  const legalReviewRequired = routeTipo === "decisao" && !["legal_review", "approved", "scheduled", "published"].includes(status);

  function getLocalTransitionIssues(nextStatus: ContentStatus) {
    const issues: string[] = [];
    const requiredPending = checklist.filter((item) => item.required && !item.checked);

    if (["approved", "scheduled", "published"].includes(nextStatus) && requiredPending.length > 0) {
      issues.push(`Checklist incompleto: ${requiredPending.map((item) => item.label).join(", ")}.`);
    }
    if (nextStatus === "scheduled" && !scheduledDate) {
      issues.push("Defina uma data de agendamento antes de agendar.");
    }
    if ((nextStatus === "scheduled" || nextStatus === "published") && routeTipo === "decisao") {
      if (!tribunal || !tipoDecisao || !processoNumero || !dataJulgamento) {
        issues.push("Decisão exige tribunal, tipo de decisão, processo e data do julgamento.");
      }
      if (!["legal_review", "approved", "scheduled", "published"].includes(status)) {
        issues.push("Decisões precisam passar por revisão jurídica ou aprovação antes de seguir para agenda/publicação.");
      }
    }
    return issues;
  }

  function handleSave(nextStatus?: string) {
    if (!canEditContent) return toast.error("O papel atual nao pode editar este conteudo.");
    if (!title.trim()) return toast.error("Título é obrigatório");
    if (!autor) return toast.error("Autor é obrigatório");
    if (nextStatus) {
      const issues = existing?.content
        ? getWorkflowTransitionIssues(existing.content.id, nextStatus as ContentStatus, snapshot)
        : getLocalTransitionIssues(nextStatus as ContentStatus);
      if (issues.length > 0) return toast.error(issues[0]);
    }
    const domainType = mapRouteTypeToDomain(routeTipo);
    const previousStatus = existing?.content?.status || status;
    const resolvedStatus = nextStatus || status;
    const resolvedSlug = slug || generateSlug(title);
    const resolvedId = existing?.content?.id || resolvedSlug;
    const ed = snapshot.editorias.find((item) => item.name === editoria) || snapshot.editorias[0];
    const au = snapshot.authors.find((item) => item.name === autor) || snapshot.authors[0];
    const so = snapshot.sources.find((item) => item.shortName === fonte);
    upsertEditorialContent({
      originalId: existing?.content?.id,
      content: { id: resolvedId, type: domainType, title, subtitle, lead, summaryCard: summary, body, slug: resolvedSlug, status: resolvedStatus as never, editorialPriority: priority, editoriaId: ed.id, authorId: au.id, sourceId: so?.id, featuredImageId: coverImage || undefined, publishedAt: resolvedStatus === "published" ? existing?.content?.publishedAt || new Date().toISOString() : existing?.content?.publishedAt, scheduledAt: scheduledDate ? new Date(scheduledDate).toISOString() : undefined, updatedAt: new Date().toISOString(), archivedAt: resolvedStatus === "archived" ? new Date().toISOString() : undefined, readingTime: readTime, tags: tags.split(",").map((item) => item.trim()).filter(Boolean), relatedContentIds: relatedIds.split(",").map((item) => item.trim()).filter(Boolean) },
      exposure: { contentId: resolvedId, isPublished: resolvedStatus === "published", isHomeFeatured: isHome, homeVisibility: isHome, homeSlotType: isHome ? homeSlotType as never : "none", homeZone: isHome ? (homeSlotType === "headline" ? "headline" : homeSlotType === "secondary" ? "secondary_highlights" : homeSlotType === "decision" ? "recent_decisions" : homeSlotType === "article" ? "articles_analysis" : homeSlotType === "opinion" ? "opinion" : "latest_news") : undefined, exposureEndsAt: exposureEndsAt ? new Date(exposureEndsAt).toISOString() : undefined, isUrgent, urgentTitle: isUrgent ? urgentTitle || title : undefined, urgentStartsAt: isUrgent ? new Date().toISOString() : undefined, urgentExpiresAt: isUrgent && urgentExpiresAt ? new Date(urgentExpiresAt).toISOString() : undefined, urgentPriority: isUrgent ? 1 : undefined, isNewsletterFeatured: isNewsletter, isArchivedPublicly: resolvedStatus === "archived" },
      seo: { contentId: resolvedId, seoTitle: metaTitle || title, seoDescription: metaDesc || lead, ogTitle: ogTitle || metaTitle || title, ogDescription: ogDesc || metaDesc || lead, canonicalUrl: canonical || `https://veredito.com.br/${routeTipo === "noticia" ? "noticias" : routeTipo === "decisao" ? "decisoes" : routeTipo === "artigo" ? "artigos" : "opiniao"}/${resolvedSlug}`, noindex },
      media: { contentId: resolvedId, coverImageId: coverImage || undefined, socialImageId: socialImage || coverImage || undefined, caption: coverCaption, credit: coverCredit, altText: coverAlt, focalPointX: 50, focalPointY: 45 },
      decisionMeta: domainType === "decision" ? { contentId: resolvedId, court: tribunal, decisionType: tipoDecisao, rapporteur: relator, caseNumber: processoNumero, judgmentDate: dataJulgamento, thesis: teseFixada, syllabus: ementa, practicalImpact: impacto as "low" | "medium" | "high", officialUrl: linkFonte, affectedTheme: temaAfetado } : null,
    });
    if (nextStatus && nextStatus !== previousStatus) transitionWorkflowStatus(resolvedId, nextStatus as ContentStatus, autor || "RedaÃ§Ã£o Veredito", undefined, previousStatus as ContentStatus);
    setStatus(resolvedStatus);
    toast.success(statusLabels[resolvedStatus] ? `${statusLabels[resolvedStatus]} salvo` : "Conteúdo salvo");
  }

  function handleAddComment() {
    if (!existing?.content?.id) return toast.error("Salve o conteÃºdo antes de comentar.");
    if (!workflowComment.trim()) return toast.error("Escreva um comentÃ¡rio interno.");
    addWorkflowComment(existing.content.id, workflowComment.trim(), autor || "Redação Veredito");
    setWorkflowComment("");
    toast.success("ComentÃ¡rio interno adicionado.");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/admin/conteudos")} className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"><ArrowLeft className="h-4 w-4" strokeWidth={1.5} /></button>
          <div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary"><TipoIcon className="h-4 w-4" strokeWidth={1.5} /></div><h2 className="font-display text-xl text-foreground">{id ? "Editar" : "Nova"} {tipoLabels[routeTipo]}</h2></div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(`/admin/conteudos/${id || slug || "preview"}/preview`)} className="h-9 rounded-md border border-input bg-card px-4 text-[13px] font-medium text-foreground hover:bg-secondary transition-colors flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" strokeWidth={1.5} /> Preview</button>
          <button disabled={!canEditContent} onClick={() => handleSave()} className="h-9 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5 disabled:opacity-50"><Save className="h-3.5 w-3.5" strokeWidth={2} /> Salvar</button>
        </div>
      </div>

      {!canEditContent && <div className="rounded-lg border border-border bg-card p-4 text-[12px] text-muted-foreground">Leitura em modo protegido. O papel atual nao pode editar nem publicar este conteudo.</div>}

      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0">
          <div className="flex border-b border-border mb-5 overflow-x-auto">{[["conteudo", "Conteúdo"], ["metadados", "Metadados"], ["midia", "Mídia"], ["seo", "SEO"], ["publicacao", "Publicação"], ["workflow", "Workflow"]].map(([item, label]) => <button key={item} onClick={() => setTab(item)} className={cn("px-4 py-2.5 text-[12px] font-medium transition-colors relative whitespace-nowrap", tab === item ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-bronze" : "text-muted-foreground hover:text-foreground")}>{label}</button>)}</div>
          {tab === "conteudo" && <div className="space-y-5">
            <div className="rounded-lg bg-card p-6 shadow-editorial space-y-4">
              <Field label="Título" required><Input value={title} onChange={(e) => { setTitle(e.target.value); if (!slug) setSlug(generateSlug(e.target.value)); }} /></Field>
              <Field label="Subtítulo"><Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} /></Field>
              <Field label="Lead"><Textarea value={lead} onChange={(e) => setLead(e.target.value)} rows={2} /></Field>
              <Field label="Resumo para card"><Textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} /></Field>
              <Field label="Slug"><Input value={slug} onChange={(e) => setSlug(e.target.value)} /></Field>
              <Field label="Corpo do texto"><Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={16} style={{ minHeight: "320px" }} /></Field>
            </div>
            {routeTipo === "decisao" && <div className="rounded-lg bg-card p-6 shadow-editorial space-y-4">
              <h3 className="text-[13px] font-semibold text-foreground font-ui flex items-center gap-2"><Scale className="h-4 w-4 text-bronze" strokeWidth={1.5} /> Dados da decisão</h3>
              <div className="grid grid-cols-2 gap-3"><Field label="Tribunal"><Select value={tribunal} onChange={setTribunal} options={tribunalOptions} /></Field><Field label="Tipo de decisão"><Select value={tipoDecisao} onChange={setTipoDecisao} options={tipoDecisaoOptions} /></Field></div>
              <div className="grid grid-cols-2 gap-3"><Field label="Relator"><Input value={relator} onChange={(e) => setRelator(e.target.value)} /></Field><Field label="Processo"><Input value={processoNumero} onChange={(e) => setProcessoNumero(e.target.value)} /></Field></div>
              <div className="grid grid-cols-2 gap-3"><Field label="Data do julgamento"><Input type="date" value={dataJulgamento} onChange={(e) => setDataJulgamento(e.target.value)} /></Field><Field label="Impacto"><Select value={impacto} onChange={setImpacto} options={impactoOptions} /></Field></div>
              <Field label="Tese firmada"><Textarea value={teseFixada} onChange={(e) => setTeseFixada(e.target.value)} rows={3} /></Field>
              <Field label="Ementa"><Textarea value={ementa} onChange={(e) => setEmenta(e.target.value)} rows={3} /></Field>
              <Field label="Link oficial"><Input value={linkFonte} onChange={(e) => setLinkFonte(e.target.value)} /></Field>
              <Field label="Tema afetado"><Input value={temaAfetado} onChange={(e) => setTemaAfetado(e.target.value)} /></Field>
            </div>}
          </div>}
          {tab === "metadados" && <div className="space-y-5"><div className="rounded-lg bg-card p-6 shadow-editorial space-y-4"><Field label="Editoria"><Select value={editoria} onChange={setEditoria} options={editorias} /></Field><Field label="Autor"><Select value={autor} onChange={setAutor} options={autores} /></Field><Field label="Fonte"><Select value={fonte} onChange={setFonte} options={fontes} /></Field><Field label="Prioridade editorial"><Select value={priority} onChange={(v) => setPriority(v as EditorialPriority)} options={priorityOptions} /></Field><Field label="Tags"><Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="separadas por vírgula" /></Field><Field label="Relacionados" hint="Ids/slugs separados por vírgula"><Input value={relatedIds} onChange={(e) => setRelatedIds(e.target.value)} placeholder="stf-icms-transferencia, reforma-tributaria-contratos" /></Field></div></div>}
          {tab === "midia" && <div className="space-y-5"><div className="rounded-lg bg-card p-6 shadow-editorial space-y-4"><div className="grid grid-cols-2 gap-3"><Field label="Imagem de capa"><Select value={coverImage} onChange={setCoverImage} options={imageOptions} /></Field><Field label="Imagem social"><Select value={socialImage} onChange={setSocialImage} options={imageOptions} /></Field></div><Field label="Legenda"><Input value={coverCaption} onChange={(e) => setCoverCaption(e.target.value)} /></Field><div className="grid grid-cols-2 gap-3"><Field label="Alt text"><Input value={coverAlt} onChange={(e) => setCoverAlt(e.target.value)} /></Field><Field label="Crédito"><Input value={coverCredit} onChange={(e) => setCoverCredit(e.target.value)} /></Field></div><div className="rounded-md border border-dashed border-border p-4 flex items-center gap-3 text-[12px] text-muted-foreground"><ImagePlus className="h-4 w-4" strokeWidth={1.5} /> Persistência local nesta fase: imagem selecionada por chave editorial compartilhada.</div></div></div>}
          {tab === "seo" && <div className="space-y-5">
            <div className="rounded-lg bg-card p-6 shadow-editorial space-y-4">
              <div className="flex items-center justify-between"><h3 className="text-[13px] font-semibold text-foreground font-ui flex items-center gap-2"><Globe className="h-4 w-4 text-bronze" strokeWidth={1.5} /> SEO e Open Graph</h3><span className={cn("text-[11px] font-bold tabular-nums", seoScore >= 75 ? "text-status-published" : seoScore >= 50 ? "text-status-review" : "text-destructive")}>{seoScore}%</span></div>
              <Field label="SEO title"><Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} /></Field>
              <Field label="Meta description"><Textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} rows={2} /></Field>
              <Field label="OG title"><Input value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} /></Field>
              <Field label="OG description"><Textarea value={ogDesc} onChange={(e) => setOgDesc(e.target.value)} rows={2} /></Field>
              <Field label="Canonical"><Input value={canonical} onChange={(e) => setCanonical(e.target.value)} /></Field>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={noindex} onChange={(e) => setNoindex(e.target.checked)} className="rounded border-input" /><span className="text-[12px] text-foreground">Não indexar</span></label>
            </div>
          </div>}
          {tab === "publicacao" && <div className="space-y-5"><div className="rounded-lg bg-card p-6 shadow-editorial space-y-4"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} className="rounded border-input" /><span className="text-[12px] text-foreground">Ativar urgente</span></label>{isUrgent && <div className="grid grid-cols-2 gap-3"><Field label="Título curto"><Input value={urgentTitle} onChange={(e) => setUrgentTitle(e.target.value)} /></Field><Field label="Expiração"><Input type="datetime-local" value={urgentExpiresAt} onChange={(e) => setUrgentExpiresAt(e.target.value)} /></Field></div>}<label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={isHome} onChange={(e) => setIsHome(e.target.checked)} className="rounded border-input" /><span className="text-[12px] text-foreground">Exibir na home</span></label>{isHome && <div className="grid grid-cols-2 gap-3"><Field label="Home slot"><Select value={homeSlotType} onChange={setHomeSlotType} options={[{ value: "headline", label: "Headline" }, { value: "secondary", label: "Secundário" }, { value: "list", label: "Lista" }, { value: "decision", label: "Decisão" }, { value: "article", label: "Artigo" }, { value: "opinion", label: "Opinião" }]} /></Field><Field label="Validade da exposição"><Input type="datetime-local" value={exposureEndsAt} onChange={(e) => setExposureEndsAt(e.target.value)} /></Field></div>}<label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={isNewsletter} onChange={(e) => setIsNewsletter(e.target.checked)} className="rounded border-input" /><span className="text-[12px] text-foreground">Destacar na newsletter</span></label><Field label="Agendamento"><Input type="datetime-local" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} /></Field></div></div>}
          {tab === "workflow" && <div className="rounded-lg bg-card p-6 shadow-editorial space-y-4"><h3 className="text-[13px] font-semibold text-foreground font-ui">Workflow</h3><p className="text-[12px] text-muted-foreground">Fluxo editorial com bloqueios de publicação/agendamento, checklist mínimo e revisão jurídica explícita para decisões.</p><div className="grid grid-cols-2 gap-3 text-[12px]"><div className="rounded-md border border-border p-3">Status atual: <span className="font-medium text-foreground">{statusLabels[status]}</span></div><div className="rounded-md border border-border p-3">Checklist: <span className="font-medium text-foreground">{checklistDone}/{checklist.length}</span></div></div>{legalReviewRequired && <div className="rounded-md border border-status-review/20 bg-status-review/5 p-3 text-[12px] text-status-review">Decisão ainda depende de revisão jurídica antes de seguir para agendamento ou publicação.</div>}</div>}
        </div>

        <div className="w-80 shrink-0 space-y-4 sticky top-20">
          <div className="rounded-lg bg-card p-5 shadow-editorial space-y-4">
            <div className="flex items-center justify-between"><h3 className="text-[13px] font-semibold text-foreground font-ui">Workflow</h3><span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium", statusColors[status])}>{statusLabels[status]}</span></div>
            <div className="space-y-2">
              <button onClick={() => handleSave("draft")} className="flex w-full h-9 items-center justify-center gap-1.5 rounded-md border border-input bg-card text-[13px] font-medium text-foreground hover:bg-secondary transition-colors"><Save className="h-3.5 w-3.5" strokeWidth={1.5} /> Salvar rascunho</button>
              {workflowTransitions.map((transition) => {
                const blockedByPermission =
                  (transition === "in_review" && !canSubmitReview) ||
                  (transition === "legal_review" && !canLegalReview) ||
                  (transition === "approved" && !canApprove) ||
                  ((transition === "scheduled" || transition === "published" || transition === "archived") && !canPublish);
                return (
                <button key={transition} disabled={blockedByPermission} onClick={() => handleSave(transition)} className={cn("flex w-full h-9 items-center justify-center gap-1.5 rounded-md border border-input bg-card text-[13px] font-medium hover:bg-secondary transition-colors disabled:opacity-50", transition === "archived" ? "text-destructive hover:bg-destructive/10" : "text-foreground")}>
                  {transition === "approved" || transition === "published" ? <Check className="h-3.5 w-3.5" strokeWidth={2} /> : transition === "scheduled" ? <Clock className="h-3.5 w-3.5" strokeWidth={1.5} /> : transition === "archived" ? <Archive className="h-3.5 w-3.5" strokeWidth={1.5} /> : transition === "draft" ? <X className="h-3.5 w-3.5" strokeWidth={1.5} /> : <Send className="h-3.5 w-3.5" strokeWidth={1.5} />}
                  {statusLabels[transition]}
                </button>
              )})}
            </div>
            <div className="rounded-md border border-border p-3 space-y-2 text-[11px]">
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Checklist</span><span className="font-medium text-foreground">{checklistDone}/{checklist.length}</span></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Comentários</span><span className="font-medium text-foreground">{existing?.workflowComments?.length || 0}</span></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Histórico</span><span className="font-medium text-foreground">{existing?.workflowEvents?.length || 0}</span></div>
            </div>
            <div className="rounded-md border border-border p-3 space-y-2">
              <Textarea value={workflowComment} onChange={(e) => setWorkflowComment(e.target.value)} rows={3} placeholder="Comentário interno rápido..." />
              <button onClick={handleAddComment} className="flex w-full h-9 items-center justify-center gap-1.5 rounded-md border border-input bg-card text-[12px] font-medium text-foreground hover:bg-secondary transition-colors"><MessageSquare className="h-3.5 w-3.5" strokeWidth={1.5} /> Adicionar comentário</button>
            </div>
            <div className="pt-3 border-t border-border space-y-2 text-[11px]">{isUrgent && <div className="flex items-center gap-2 text-destructive font-medium"><Zap className="h-3 w-3" strokeWidth={2} /> Urgente ativo</div>}{isHome && <div className="flex items-center gap-2 text-bronze font-medium"><HomeIcon className="h-3 w-3" strokeWidth={2} /> Na home</div>}<div className="flex items-center gap-2 text-muted-foreground"><Globe className="h-3 w-3" strokeWidth={1.5} /> SEO: <span className={cn("font-bold", seoScore >= 75 ? "text-status-published" : seoScore >= 50 ? "text-status-review" : "text-destructive")}>{seoScore}%</span></div></div>
          </div>
          <div className="rounded-lg bg-card p-5 shadow-editorial"><h3 className="text-[13px] font-semibold text-foreground font-ui mb-3">Informações</h3><div className="space-y-2 text-[11px] text-muted-foreground"><div className="flex justify-between"><span>Palavras</span><span className="tabular-nums font-medium text-foreground">{wordCount}</span></div><div className="flex justify-between"><span>Leitura estimada</span><span className="tabular-nums font-medium text-foreground">{readTime} min</span></div><div className="flex justify-between"><span>Tipo</span><span className="font-medium text-foreground">{tipoLabels[routeTipo]}</span></div></div></div>
        </div>
      </div>
    </div>
  );
}
