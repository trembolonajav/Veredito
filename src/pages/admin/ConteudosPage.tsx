import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, CheckSquare, FileImage, Home, Plus, Search, Tag, Zap } from "lucide-react";
import { toast } from "sonner";
import { currentUserCan, getAdminContentRows, getEditorialAuthors, getEditorialEditorias, getEditorialSources } from "@/domain/editorial/selectors";
import { cn } from "@/lib/utils";
import { applyBulkEditorialAction, useEditorialSnapshot } from "@/domain/editorial/store";

const statusStyles: Record<string, string> = {
  draft: "bg-status-draft/10 text-status-draft",
  in_review: "bg-status-review/10 text-status-review",
  legal_review: "bg-status-review/10 text-status-review",
  approved: "bg-status-approved/10 text-status-approved",
  scheduled: "bg-status-scheduled/10 text-status-scheduled",
  published: "bg-status-published/10 text-status-published",
  archived: "bg-status-archived/10 text-status-archived",
};

const statusLabels: Record<string, string> = {
  draft: "Rascunho",
  in_review: "Revisao",
  legal_review: "Rev. juridica",
  approved: "Aprovado",
  scheduled: "Agendado",
  published: "Publicado",
  archived: "Arquivado",
};

function formatDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function ConteudosPage() {
  const navigate = useNavigate();
  const snapshot = useEditorialSnapshot();
  const rows = getAdminContentRows(snapshot);
  const editorias = getEditorialEditorias(snapshot);
  const authors = getEditorialAuthors(snapshot);
  const sources = getEditorialSources(snapshot);
  const canEditContent = currentUserCan("edit_content", snapshot);
  const canApprove = currentUserCan("approve", snapshot);
  const canPublish = currentUserCan("publish", snapshot);
  const canEditHome = currentUserCan("edit_home", snapshot);

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkEditoria, setBulkEditoria] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    editoria: "",
    author: "",
    source: "",
    status: "",
    urgent: "",
    home: "",
    newsletter: "",
    hasSeo: "",
    hasImage: "",
  });

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      if (filters.type && row.type !== filters.type) return false;
      if (filters.editoria && row.editoria !== filters.editoria) return false;
      if (filters.author && row.author !== filters.author) return false;
      if (filters.source && row.source !== filters.source) return false;
      if (filters.status && row.statusKey !== filters.status) return false;
      if (filters.urgent && String(row.isUrgent) !== filters.urgent) return false;
      if (filters.home && String(row.isHome) !== filters.home) return false;
      if (filters.newsletter && String(row.isNewsletter) !== filters.newsletter) return false;
      if (filters.hasSeo && String(row.hasSeo) !== filters.hasSeo) return false;
      if (filters.hasImage && String(row.hasImage) !== filters.hasImage) return false;
      if (query && !`${row.title} ${row.author} ${row.editoria}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [filters, query, rows]);

  function toggleSelection(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function runBulkAction(action: "approve" | "publish" | "archive" | "toggle_home" | "toggle_urgent" | "change_editoria") {
    if (selected.length === 0) {
      toast.error("Selecione ao menos um conteudo.");
      return;
    }
    if (action === "change_editoria" && !bulkEditoria) {
      toast.error("Selecione uma editoria para aplicar.");
      return;
    }
    applyBulkEditorialAction(selected, action, bulkEditoria || undefined);
    toast.success(`${selected.length} conteudo(s) atualizados.`);
    setSelected([]);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-foreground">Conteudos</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">Operacao editorial com filtros, governanca e acoes em massa.</p>
        </div>
        <button disabled={!canEditContent} onClick={() => navigate("/admin/conteudos/tipo")} className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          Novo conteudo
        </button>
      </div>

      <div className="rounded-lg bg-card p-4 shadow-editorial space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por titulo, autor ou editoria..." className="h-9 w-full rounded-md border border-input bg-card pl-8 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors" />
          </div>
          <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} className="h-9 rounded-md border border-input bg-card px-3 text-[12px]">
            <option value="">Todos os formatos</option>
            <option value="Notícia">Noticia</option>
            <option value="Decisão">Decisao</option>
            <option value="Artigo">Artigo</option>
            <option value="Opinião">Opiniao</option>
          </select>
          <select value={filters.editoria} onChange={(e) => setFilters({ ...filters, editoria: e.target.value })} className="h-9 rounded-md border border-input bg-card px-3 text-[12px]">
            <option value="">Todas as editorias</option>
            {editorias.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
          </select>
          <select value={filters.author} onChange={(e) => setFilters({ ...filters, author: e.target.value })} className="h-9 rounded-md border border-input bg-card px-3 text-[12px]">
            <option value="">Todos os autores</option>
            {authors.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
          </select>
          <select value={filters.source} onChange={(e) => setFilters({ ...filters, source: e.target.value })} className="h-9 rounded-md border border-input bg-card px-3 text-[12px]">
            <option value="">Todas as fontes</option>
            {sources.map((item) => <option key={item.id} value={item.shortName}>{item.shortName}</option>)}
          </select>
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="h-9 rounded-md border border-input bg-card px-3 text-[12px]">
            <option value="">Todos os status</option>
            {Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: "urgent", label: "Urgente" },
            { key: "home", label: "Home" },
            { key: "newsletter", label: "Newsletter" },
            { key: "hasSeo", label: "SEO" },
            { key: "hasImage", label: "Imagem" },
          ].map((item) => (
            <select key={item.key} value={(filters as Record<string, string>)[item.key]} onChange={(e) => setFilters({ ...filters, [item.key]: e.target.value })} className="h-8 rounded-md border border-input bg-card px-2.5 text-[11px]">
              <option value="">{item.label}: todos</option>
              <option value="true">{item.label}: sim</option>
              <option value="false">{item.label}: nao</option>
            </select>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-card shadow-editorial overflow-hidden">
        <div className="border-b border-border px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-bronze" strokeWidth={1.5} />
            <span className="text-[13px] font-semibold text-foreground">Acoes em massa</span>
            <span className="text-[11px] text-muted-foreground">{selected.length} selecionado(s)</span>
          </div>
          <div className="flex items-center gap-2">
            <button disabled={!canApprove} onClick={() => runBulkAction("approve")} className="h-8 rounded-md border border-input px-3 text-[12px] hover:bg-secondary transition-colors disabled:opacity-50">Aprovar</button>
            <button disabled={!canPublish} onClick={() => runBulkAction("publish")} className="h-8 rounded-md border border-input px-3 text-[12px] hover:bg-secondary transition-colors disabled:opacity-50">Publicar</button>
            <button disabled={!canPublish} onClick={() => runBulkAction("archive")} className="h-8 rounded-md border border-input px-3 text-[12px] hover:bg-secondary transition-colors disabled:opacity-50">Arquivar</button>
            <button disabled={!canEditHome} onClick={() => runBulkAction("toggle_home")} className="h-8 rounded-md border border-input px-3 text-[12px] hover:bg-secondary transition-colors disabled:opacity-50">Home</button>
            <button disabled={!canEditHome} onClick={() => runBulkAction("toggle_urgent")} className="h-8 rounded-md border border-input px-3 text-[12px] hover:bg-secondary transition-colors disabled:opacity-50">Urgente</button>
            <select disabled={!canEditContent} value={bulkEditoria} onChange={(e) => setBulkEditoria(e.target.value)} className="h-8 rounded-md border border-input px-2 text-[12px] bg-card disabled:opacity-50">
              <option value="">Alterar editoria</option>
              {editorias.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
            </select>
            <button disabled={!canEditContent} onClick={() => runBulkAction("change_editoria")} className="h-8 rounded-md border border-input px-3 text-[12px] hover:bg-secondary transition-colors disabled:opacity-50">Aplicar</button>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 w-10"></th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Titulo</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Formato</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Editoria</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden xl:table-cell">Autor</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Flags</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden xl:table-cell">Fonte</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden xl:table-cell">Agendado para</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden xl:table-cell">Atualizado em</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((row) => (
              <tr key={row.id} className={`hover:bg-secondary/50 transition-colors ${canEditContent ? "cursor-pointer" : ""}`} onClick={() => canEditContent && navigate(`/admin/conteudos/${row.id}/editar`)}>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" checked={selected.includes(row.id)} onChange={() => toggleSelection(row.id)} className="rounded border-input" />
                </td>
                <td className="px-5 py-3">
                  <div>
                    <p className="text-[13px] font-medium text-foreground line-clamp-2">{row.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Editor responsavel: {row.author}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-[12px] text-muted-foreground">{row.type}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-[12px] text-bronze font-medium">{row.editoria}</td>
                <td className="px-4 py-3 hidden xl:table-cell text-[12px] text-muted-foreground">{row.author}</td>
                <td className="px-4 py-3">
                  <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium", statusStyles[row.statusKey])}>
                    {statusLabels[row.statusKey]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1.5">
                    {row.isHome && <Home className="h-3.5 w-3.5 text-bronze" strokeWidth={2} />}
                    {row.isUrgent && <Zap className="h-3.5 w-3.5 text-destructive" strokeWidth={2} />}
                    {row.isNewsletter && <Tag className="h-3.5 w-3.5 text-status-scheduled" strokeWidth={1.5} />}
                    {row.hasWorkflowComments && <CheckSquare className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />}
                    {!row.hasSeo && <AlertTriangle className="h-3.5 w-3.5 text-status-review" strokeWidth={1.5} />}
                    {!row.hasImage && <FileImage className="h-3.5 w-3.5 text-muted-foreground/50" strokeWidth={1.5} />}
                  </div>
                  <p className="mt-1 text-center text-[10px] text-muted-foreground">{row.checklistProgress}</p>
                </td>
                <td className="px-4 py-3 hidden xl:table-cell text-[12px] text-muted-foreground">{row.source}</td>
                <td className="px-4 py-3 hidden xl:table-cell text-[12px] text-muted-foreground">{formatDate(row.scheduledAt)}</td>
                <td className="px-4 py-3 hidden xl:table-cell text-[12px] text-muted-foreground">{formatDate(row.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-border px-5 py-3 text-[12px] text-muted-foreground">
          {filtered.length} conteudo(s) na listagem operacional
        </div>
      </div>
    </div>
  );
}
