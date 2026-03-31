import React, { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, Layers, Users, Link2, LayoutGrid, Mail, UserCog, Settings,
  Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Calendar, Clock,
  Send, Download, Globe, Shield, Palette, Database, Bell, X, Check,
  BookOpen, Scale, Building2, Briefcase, GraduationCap, ChevronUp, ChevronDown,
  Save, ArrowLeft, Home, Zap, ImageOff, AlertTriangle, ExternalLink,
  Star, Hash, Activity, Lock, Unlock,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   Shared authors list (used by Conteúdos + Autores)
   ═══════════════════════════════════════════════ */

export const initialAutoresShared = [
  { id: 1, name: "Ana Beatriz Duarte", role: "Editora Sênior", email: "ana@veredito.com", bio: "Jornalista especializada em Direito Tributário com 15 anos de experiência.", articles: 47, initials: "AB", specialty: "Direito Tributário", slug: "ana-beatriz-duarte", isColumnist: false },
  { id: 2, name: "Carlos Mendes", role: "Repórter Jurídico", email: "carlos@veredito.com", bio: "Repórter jurídico com passagens por grandes veículos.", articles: 32, initials: "CM", specialty: "Direito Empresarial", slug: "carlos-mendes", isColumnist: false },
  { id: 3, name: "Dra. Fernanda Lima", role: "Colunista", email: "fernanda@veredito.com", bio: "Professora de Direito Constitucional e colunista do Veredito.", articles: 28, initials: "FL", specialty: "Direito Constitucional", slug: "fernanda-lima", isColumnist: true },
  { id: 4, name: "Prof. Ricardo Alves", role: "Colaborador", email: "ricardo@veredito.com", bio: "Advogado e professor universitário.", articles: 15, initials: "RA", specialty: "Direito Sucessório", slug: "ricardo-alves", isColumnist: true },
  { id: 5, name: "Mariana Costa", role: "Repórter Jurídico", email: "mariana@veredito.com", bio: "Cobertura do STF e tribunais superiores.", articles: 24, initials: "MC", specialty: "Direito Imobiliário", slug: "mariana-costa", isColumnist: false },
  { id: 6, name: "João Pedro Silva", role: "Editor Assistente", email: "joao@veredito.com", bio: "Editor assistente com foco em compliance.", articles: 19, initials: "JP", specialty: "Direito Empresarial", slug: "joao-pedro-silva", isColumnist: false },
];
import { cn } from "@/lib/utils";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

/* ═══════════════════════════════════════════════
   Shared UI helpers
   ═══════════════════════════════════════════════ */

const statusLabels: Record<string, string> = { draft: "Rascunho", review: "Revisão", approved: "Aprovado", scheduled: "Agendado", published: "Publicado", archived: "Arquivado" };
const statusStyles: Record<string, string> = {
  draft: "bg-status-draft/10 text-status-draft",
  review: "bg-status-review/10 text-status-review",
  approved: "bg-status-approved/10 text-status-approved",
  scheduled: "bg-status-scheduled/10 text-status-scheduled",
  published: "bg-status-published/10 text-status-published",
  archived: "bg-status-archived/10 text-status-archived",
};

function PageHeader({ title, subtitle, children }: { title: string; subtitle: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="font-display text-2xl text-foreground">{title}</h2>
        <p className="text-[13px] text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function PrimaryBtn({ onClick, icon: Icon, children }: { onClick: () => void; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      {children}
    </button>
  );
}

function SecondaryBtn({ onClick, icon: Icon, children }: { onClick: () => void; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="flex h-9 items-center gap-1.5 rounded-md border border-input bg-card px-4 text-[13px] font-medium text-foreground hover:bg-secondary transition-colors">
      <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
      {children}
    </button>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}

function FormInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
    />
  );
}

function FormTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors resize-none"
    />
  );
}

function FormSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function ConfirmDialog({ open, onClose, onConfirm, title, description }: { open: boolean; onClose: () => void; onConfirm: () => void; title: string; description: string }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-ui text-[15px]">{title}</DialogTitle>
          <DialogDescription className="text-[13px]">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <button onClick={onClose} className="h-9 rounded-md border border-input bg-card px-4 text-[13px] font-medium text-foreground hover:bg-secondary transition-colors">Cancelar</button>
          <button onClick={onConfirm} className="h-9 rounded-md bg-destructive px-4 text-[13px] font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors">Excluir</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DropdownActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
        <MoreHorizontal className="h-4 w-4" strokeWidth={1.5} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1 w-36 rounded-md border border-border bg-popover py-1 shadow-editorial-lg">
            <button onClick={() => { setOpen(false); onEdit(); }} className="flex w-full items-center gap-2 px-3 py-1.5 text-[13px] text-foreground hover:bg-secondary transition-colors">
              <Edit className="h-3.5 w-3.5" strokeWidth={1.5} /> Editar
            </button>
            <button onClick={() => { setOpen(false); onDelete(); }} className="flex w-full items-center gap-2 px-3 py-1.5 text-[13px] text-destructive hover:bg-secondary transition-colors">
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} /> Excluir
            </button>
          </div>
        </>
      )}
    </div>
  );
}

let nextId = 100;
function uid() { return nextId++; }

/* ═══════════════════════════════════════════════
   CONTEÚDOS
   ═══════════════════════════════════════════════ */

type Conteudo = {
  id: number; title: string; type: string; editoria: string; author: string;
  status: string; date: string; views: number; body: string;
  hasImage: boolean; hasSeo: boolean; isUrgent: boolean; isHome: boolean;
};

const initialConteudos: Conteudo[] = [
  { id: 1, title: "STF suspende efeitos de lei estadual sobre ICMS", type: "Decisão", editoria: "Tributário", author: "Ana Beatriz Duarte", status: "review", date: "20 mar 2026", views: 342, body: "", hasImage: true, hasSeo: true, isUrgent: true, isHome: true },
  { id: 2, title: "Nova regulamentação do mercado imobiliário", type: "Notícia", editoria: "Imobiliário", author: "Carlos Mendes", status: "draft", date: "20 mar 2026", views: 0, body: "", hasImage: false, hasSeo: false, isUrgent: false, isHome: false },
  { id: 3, title: "Impacto da reforma tributária nos escritórios", type: "Artigo", editoria: "Tributário", author: "Dra. Fernanda Lima", status: "published", date: "19 mar 2026", views: 1284, body: "", hasImage: true, hasSeo: true, isUrgent: false, isHome: true },
  { id: 4, title: "O futuro do direito sucessório digital", type: "Opinião", editoria: "Sucessório", author: "Prof. Ricardo Alves", status: "published", date: "19 mar 2026", views: 876, body: "", hasImage: true, hasSeo: false, isUrgent: false, isHome: false },
  { id: 5, title: "TST define nova súmula sobre trabalho remoto", type: "Decisão", editoria: "Trabalhista", author: "Mariana Costa", status: "scheduled", date: "21 mar 2026", views: 0, body: "", hasImage: true, hasSeo: true, isUrgent: false, isHome: false },
  { id: 6, title: "Análise: compliance nas startups brasileiras", type: "Artigo", editoria: "Empresarial", author: "João Pedro Silva", status: "approved", date: "20 mar 2026", views: 0, body: "", hasImage: false, hasSeo: true, isUrgent: false, isHome: false },
  { id: 7, title: "Novo marco legal das garantias entra em vigor", type: "Notícia", editoria: "Empresarial", author: "Ana Beatriz Duarte", status: "published", date: "18 mar 2026", views: 2105, body: "", hasImage: true, hasSeo: true, isUrgent: false, isHome: true },
];

const conteudoTypes = [
  { value: "", label: "Todos os tipos" },
  { value: "Notícia", label: "Notícia" },
  { value: "Decisão", label: "Decisão" },
  { value: "Artigo", label: "Artigo" },
  { value: "Opinião", label: "Opinião" },
];

const editoriaOptions = [
  { value: "", label: "Todas as editorias" },
  { value: "Tributário", label: "Tributário" },
  { value: "Empresarial", label: "Empresarial" },
  { value: "Imobiliário", label: "Imobiliário" },
  { value: "Sucessório", label: "Sucessório" },
  { value: "Trabalhista", label: "Trabalhista" },
  { value: "Constitucional", label: "Constitucional" },
];

const editoriaOptionsRequired = editoriaOptions.filter(o => o.value !== "");

const statusOptions = [
  { value: "", label: "Todos os status" },
  { value: "draft", label: "Rascunho" },
  { value: "review", label: "Revisão" },
  { value: "approved", label: "Aprovado" },
  { value: "scheduled", label: "Agendado" },
  { value: "published", label: "Publicado" },
  { value: "archived", label: "Arquivado" },
];

export function ConteudosPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState(initialConteudos);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [editoriaFilter, setEditoriaFilter] = useState("");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Conteudo | null>(null);

  const openCreate = () => navigate("/admin/conteudos/tipo");

  const handleDelete = () => {
    if (!deleteTarget) return;
    setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    toast.success("Conteúdo excluído");
    setDeleteTarget(null);
  };

  const filtered = items
    .filter((c) => !statusFilter || c.status === statusFilter)
    .filter((c) => !typeFilter || c.type === typeFilter)
    .filter((c) => !editoriaFilter || c.editoria === editoriaFilter)
    .filter((c) => !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.author.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <PageHeader title="Conteúdos" subtitle="Gerencie notícias, decisões, artigos e opiniões">
        <PrimaryBtn onClick={openCreate} icon={Plus}>Novo conteúdo</PrimaryBtn>
      </PageHeader>

      {/* Advanced Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por título ou autor..." className="h-9 w-full rounded-md border border-input bg-card pl-8 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 rounded-md border border-input bg-card px-3 text-[12px] text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors">
          {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="h-9 rounded-md border border-input bg-card px-3 text-[12px] text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors">
          {conteudoTypes.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={editoriaFilter} onChange={(e) => setEditoriaFilter(e.target.value)} className="h-9 rounded-md border border-input bg-card px-3 text-[12px] text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors">
          {editoriaOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-lg bg-card shadow-editorial overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Título</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Tipo</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Editoria</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Autor</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Flags</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Data</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Views</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-secondary/50 transition-colors">
                <td className="px-5 py-3"><p className="text-[13px] font-medium text-foreground truncate max-w-xs">{item.title}</p></td>
                <td className="px-4 py-3"><span className="text-[12px] text-muted-foreground">{item.type}</span></td>
                <td className="px-4 py-3 hidden lg:table-cell"><span className="text-[12px] text-bronze font-medium">{item.editoria}</span></td>
                <td className="px-4 py-3 hidden md:table-cell"><span className="text-[12px] text-muted-foreground">{item.author}</span></td>
                <td className="px-4 py-3">
                  <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium", statusStyles[item.status])}>
                    <span className={cn("status-dot mr-1.5", `status-${item.status}`)} />
                    {statusLabels[item.status]}
                  </span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex items-center justify-center gap-1.5">
                    {item.isUrgent && <Zap className="h-3 w-3 text-destructive" strokeWidth={2} />}
                    {item.isHome && <Home className="h-3 w-3 text-bronze" strokeWidth={2} />}
                    {!item.hasImage && <ImageOff className="h-3 w-3 text-muted-foreground/50" strokeWidth={1.5} />}
                    {!item.hasSeo && <AlertTriangle className="h-3 w-3 text-status-review/60" strokeWidth={1.5} />}
                  </div>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell"><span className="text-[12px] text-muted-foreground tabular-nums">{item.date}</span></td>
                <td className="px-4 py-3 text-right hidden md:table-cell"><span className="text-[12px] text-muted-foreground tabular-nums">{item.views > 0 ? item.views.toLocaleString() : "—"}</span></td>
                <td className="px-3 py-3">
                  <DropdownActions
                    onEdit={() => navigate(`/admin/conteudos/${item.id}/editar`)}
                    onDelete={() => setDeleteTarget(item)}
                  />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="px-5 py-12 text-center text-[13px] text-muted-foreground">Nenhum conteúdo encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-[12px] text-muted-foreground">
        <span>{filtered.length} conteúdo{filtered.length !== 1 ? "s" : ""} {(statusFilter || typeFilter || editoriaFilter) ? "(filtrado)" : ""}</span>
      </div>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Excluir conteúdo" description={`Tem certeza que deseja excluir "${deleteTarget?.title}"? Esta ação não pode ser desfeita.`} />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   EDITORIAS
   ═══════════════════════════════════════════════ */

type Editoria = { id: number; name: string; slug: string; description: string; descSeo: string; count: number; visible: boolean; homeDestaque: boolean; order: number; editor: string };

const initialEditorias: Editoria[] = [
  { id: 1, name: "Tributário", slug: "tributario", description: "Decisões e análises tributárias", descSeo: "Acompanhe as decisões tributárias mais relevantes do Brasil.", count: 42, visible: true, homeDestaque: true, order: 1, editor: "Ana Beatriz Duarte" },
  { id: 2, name: "Empresarial", slug: "empresarial", description: "Direito corporativo e societário", descSeo: "Análises de direito empresarial, M&A e compliance.", count: 35, visible: true, homeDestaque: true, order: 2, editor: "João Pedro Silva" },
  { id: 3, name: "Imobiliário", slug: "imobiliario", description: "Legislação e mercado imobiliário", descSeo: "Cobertura jurídica do mercado imobiliário brasileiro.", count: 28, visible: true, homeDestaque: true, order: 3, editor: "Mariana Costa" },
  { id: 4, name: "Sucessório", slug: "sucessorio", description: "Herança, inventário e planejamento", descSeo: "Análises de direito sucessório, herança e inventário.", count: 19, visible: true, homeDestaque: true, order: 4, editor: "Prof. Ricardo Alves" },
  { id: 5, name: "Trabalhista", slug: "trabalhista", description: "Relações de trabalho e jurisprudência", descSeo: "", count: 23, visible: false, homeDestaque: false, order: 5, editor: "" },
  { id: 6, name: "Constitucional", slug: "constitucional", description: "Direito constitucional e garantias", descSeo: "", count: 15, visible: false, homeDestaque: false, order: 6, editor: "" },
];

const editoriaIcons = [Scale, Building2, Briefcase, BookOpen, Users, GraduationCap];

export function EditoriasPage() {
  const [items, setItems] = useState(initialEditorias);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Editoria | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Editoria | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", descSeo: "", visible: true, homeDestaque: false, editor: "" });

  const openCreate = () => { setEditing(null); setForm({ name: "", slug: "", description: "", descSeo: "", visible: true, homeDestaque: false, editor: "" }); setDialogOpen(true); };
  const openEdit = (item: Editoria) => { setEditing(item); setForm({ name: item.name, slug: item.slug, description: item.description, descSeo: item.descSeo, visible: item.visible, homeDestaque: item.homeDestaque, editor: item.editor }); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("Nome é obrigatório"); return; }
    const slug = form.slug.trim() || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (editing) {
      setItems((p) => p.map((i) => i.id === editing.id ? { ...i, ...form, slug } : i));
      toast.success("Editoria atualizada");
    } else {
      setItems((p) => [...p, { id: uid(), ...form, slug, count: 0, order: p.length + 1 }]);
      toast.success("Editoria criada");
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setItems((p) => p.filter((i) => i.id !== deleteTarget.id));
    toast.success("Editoria excluída");
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Editorias" subtitle="Organize o conteúdo por editorias temáticas — controlam a navegação pública">
        <PrimaryBtn onClick={openCreate} icon={Plus}>Nova editoria</PrimaryBtn>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((ed, idx) => {
          const Icon = editoriaIcons[idx % editoriaIcons.length];
          return (
            <div key={ed.id} className={cn("rounded-lg bg-card p-5 shadow-editorial hover:shadow-editorial-lg transition-shadow group", !ed.visible && "opacity-60")}>
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div className="flex items-center gap-2">
                  {ed.visible ? (
                    <span className="text-[9px] font-bold text-status-published bg-status-published/10 px-1.5 py-0.5 rounded-full uppercase tracking-wider">Visível</span>
                  ) : (
                    <span className="text-[9px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full uppercase tracking-wider">Oculta</span>
                  )}
                  <DropdownActions onEdit={() => openEdit(ed)} onDelete={() => setDeleteTarget(ed)} />
                </div>
              </div>
              <h3 className="mt-3 text-[15px] font-semibold text-foreground font-ui">{ed.name}</h3>
              <p className="mt-0.5 text-[12px] text-muted-foreground">/{ed.slug}</p>
              {ed.description && <p className="mt-1 text-[12px] text-muted-foreground">{ed.description}</p>}
              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" strokeWidth={1.5} />
                  <span className="tabular-nums">{ed.count} conteúdos</span>
                </div>
                <div className="flex items-center gap-2">
                  {ed.homeDestaque && <Home className="h-3 w-3 text-bronze" strokeWidth={2} />}
                  {ed.editor && <span className="text-[10px] text-bronze truncate max-w-[80px]">{ed.editor.split(" ")[0]}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-ui text-[15px]">{editing ? "Editar editoria" : "Nova editoria"}</DialogTitle>
            <DialogDescription className="text-[13px]">{editing ? "Atualize os dados da editoria." : "Preencha os campos para criar uma editoria."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Nome público">
                <FormInput value={form.name} onChange={(e) => setForm({ ...form, name: (e.target as HTMLInputElement).value })} placeholder="Ex: Tributário" />
              </FormField>
              <FormField label="Slug">
                <FormInput value={form.slug} onChange={(e) => setForm({ ...form, slug: (e.target as HTMLInputElement).value })} placeholder="tributario" />
              </FormField>
            </div>
            <FormField label="Descrição">
              <FormTextarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Breve descrição da editoria" rows={2} />
            </FormField>
            <FormField label="Descrição SEO">
              <FormTextarea value={form.descSeo} onChange={(e) => setForm({ ...form, descSeo: e.target.value })} placeholder="Descrição para mecanismos de busca" rows={2} />
            </FormField>
            <FormField label="Editor responsável">
              <FormSelect value={form.editor} onChange={(v) => setForm({ ...form, editor: v })} options={[{ value: "", label: "Nenhum" }, ...initialAutoresShared.map(a => ({ value: a.name, label: a.name }))]} />
            </FormField>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} className="rounded border-input" />
                <span className="text-[12px] text-foreground">Visível no menu</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.homeDestaque} onChange={(e) => setForm({ ...form, homeDestaque: e.target.checked })} className="rounded border-input" />
                <span className="text-[12px] text-foreground">Destaque na home</span>
              </label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <button onClick={() => setDialogOpen(false)} className="h-9 rounded-md border border-input bg-card px-4 text-[13px] font-medium text-foreground hover:bg-secondary transition-colors">Cancelar</button>
            <button onClick={handleSave} className="h-9 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5">
              <Save className="h-3.5 w-3.5" strokeWidth={2} /> {editing ? "Salvar" : "Criar"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Excluir editoria" description={`Tem certeza que deseja excluir "${deleteTarget?.name}"?`} />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   AUTORES
   ═══════════════════════════════════════════════ */

type Autor = { id: number; name: string; role: string; email: string; bio: string; articles: number; initials: string; specialty: string; slug: string; isColumnist: boolean };

const initialAutores: Autor[] = [...initialAutoresShared];

const roleOptions = [
  { value: "Editora Sênior", label: "Editor(a) Sênior" },
  { value: "Editor Assistente", label: "Editor Assistente" },
  { value: "Repórter Jurídico", label: "Repórter Jurídico" },
  { value: "Colunista", label: "Colunista" },
  { value: "Colaborador", label: "Colaborador" },
];

const specialtyOptions = [
  { value: "", label: "Nenhuma" },
  { value: "Direito Tributário", label: "Direito Tributário" },
  { value: "Direito Empresarial", label: "Direito Empresarial" },
  { value: "Direito Imobiliário", label: "Direito Imobiliário" },
  { value: "Direito Sucessório", label: "Direito Sucessório" },
  { value: "Direito Constitucional", label: "Direito Constitucional" },
  { value: "Direito Trabalhista", label: "Direito Trabalhista" },
];

function getInitials(name: string) {
  return name.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export function AutoresPage() {
  const [items, setItems] = useState(initialAutores);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Autor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Autor | null>(null);
  const [form, setForm] = useState({ name: "", role: "Repórter Jurídico", email: "", bio: "", specialty: "", slug: "", isColumnist: false });

  const openCreate = () => { setEditing(null); setForm({ name: "", role: "Repórter Jurídico", email: "", bio: "", specialty: "", slug: "", isColumnist: false }); setDialogOpen(true); };
  const openEdit = (item: Autor) => { setEditing(item); setForm({ name: item.name, role: item.role, email: item.email, bio: item.bio, specialty: item.specialty, slug: item.slug, isColumnist: item.isColumnist }); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("Nome é obrigatório"); return; }
    if (!form.email.trim()) { toast.error("E-mail é obrigatório"); return; }
    const slug = form.slug || form.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-");
    if (editing) {
      setItems((p) => p.map((i) => i.id === editing.id ? { ...i, ...form, slug, initials: getInitials(form.name) } : i));
      toast.success("Autor atualizado");
    } else {
      setItems((p) => [...p, { id: uid(), ...form, slug, articles: 0, initials: getInitials(form.name) }]);
      toast.success("Autor criado");
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setItems((p) => p.filter((i) => i.id !== deleteTarget.id));
    toast.success("Autor excluído");
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Autores" subtitle="Cadastre e gerencie autores, colunistas e colaboradores">
        <PrimaryBtn onClick={openCreate} icon={Plus}>Novo autor</PrimaryBtn>
      </PageHeader>

      <div className="rounded-lg bg-card shadow-editorial overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Autor</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Papel</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Especialidade</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Slug</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Artigos</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((a) => (
              <tr key={a.id} className="hover:bg-secondary/50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">{a.initials}</div>
                    <div>
                      <span className="text-[13px] font-medium text-foreground flex items-center gap-1.5">
                        {a.name}
                        {a.isColumnist && <Star className="h-3 w-3 text-bronze" strokeWidth={2} />}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{a.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell"><span className="text-[12px] text-bronze font-medium">{a.role}</span></td>
                <td className="px-4 py-3 hidden lg:table-cell"><span className="text-[12px] text-muted-foreground">{a.specialty || "—"}</span></td>
                <td className="px-4 py-3 hidden lg:table-cell"><span className="text-[11px] text-muted-foreground">/{a.slug}</span></td>
                <td className="px-4 py-3 text-right"><span className="text-[13px] font-medium text-foreground tabular-nums">{a.articles}</span></td>
                <td className="px-3 py-3"><DropdownActions onEdit={() => openEdit(a)} onDelete={() => setDeleteTarget(a)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-ui text-[15px]">{editing ? "Editar autor" : "Novo autor"}</DialogTitle>
            <DialogDescription className="text-[13px]">{editing ? "Atualize os dados do autor." : "Preencha os campos para cadastrar um novo autor."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Nome completo">
                <FormInput value={form.name} onChange={(e) => setForm({ ...form, name: (e.target as HTMLInputElement).value })} placeholder="Nome do autor" />
              </FormField>
              <FormField label="E-mail">
                <FormInput type="email" value={form.email} onChange={(e) => setForm({ ...form, email: (e.target as HTMLInputElement).value })} placeholder="email@veredito.com" />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Papel">
                <FormSelect value={form.role} onChange={(v) => setForm({ ...form, role: v })} options={roleOptions} />
              </FormField>
              <FormField label="Especialidade">
                <FormSelect value={form.specialty} onChange={(v) => setForm({ ...form, specialty: v })} options={specialtyOptions} />
              </FormField>
            </div>
            <FormField label="Slug da página pública">
              <FormInput value={form.slug} onChange={(e) => setForm({ ...form, slug: (e.target as HTMLInputElement).value })} placeholder="ana-beatriz-duarte" />
            </FormField>
            <FormField label="Bio">
              <FormTextarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Breve biografia que aparece nas matérias e no perfil público" rows={3} />
            </FormField>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isColumnist} onChange={(e) => setForm({ ...form, isColumnist: e.target.checked })} className="rounded border-input" />
              <span className="text-[12px] text-foreground">Colunista (aparece na seção Opinião)</span>
            </label>
          </div>
          <DialogFooter className="gap-2">
            <button onClick={() => setDialogOpen(false)} className="h-9 rounded-md border border-input bg-card px-4 text-[13px] font-medium text-foreground hover:bg-secondary transition-colors">Cancelar</button>
            <button onClick={handleSave} className="h-9 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5">
              <Save className="h-3.5 w-3.5" strokeWidth={2} /> {editing ? "Salvar" : "Criar"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Excluir autor" description={`Tem certeza que deseja excluir "${deleteTarget?.name}"?`} />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   FONTES
   ═══════════════════════════════════════════════ */

type Fonte = { id: number; name: string; sigla: string; type: string; url: string; articles: number; editoriaPadrao: string; confiabilidade: string; monitorada: boolean };

const initialFontes: Fonte[] = [
  { id: 1, name: "Supremo Tribunal Federal", sigla: "STF", type: "Tribunal Superior", url: "stf.jus.br", articles: 58, editoriaPadrao: "Tributário", confiabilidade: "Alta", monitorada: true },
  { id: 2, name: "Superior Tribunal de Justiça", sigla: "STJ", type: "Tribunal Superior", url: "stj.jus.br", articles: 43, editoriaPadrao: "Empresarial", confiabilidade: "Alta", monitorada: true },
  { id: 3, name: "Tribunal Superior do Trabalho", sigla: "TST", type: "Tribunal Superior", url: "tst.jus.br", articles: 31, editoriaPadrao: "Trabalhista", confiabilidade: "Alta", monitorada: true },
  { id: 4, name: "Conselho Nacional de Justiça", sigla: "CNJ", type: "Órgão Regulador", url: "cnj.jus.br", articles: 22, editoriaPadrao: "", confiabilidade: "Alta", monitorada: false },
  { id: 5, name: "Receita Federal", sigla: "RFB", type: "Órgão Governamental", url: "gov.br/receitafederal", articles: 17, editoriaPadrao: "Tributário", confiabilidade: "Alta", monitorada: true },
  { id: 6, name: "Diário Oficial da União", sigla: "DOU", type: "Publicação Oficial", url: "dou.gov.br", articles: 39, editoriaPadrao: "", confiabilidade: "Alta", monitorada: false },
];

const fonteTypeOptions = [
  { value: "Tribunal Superior", label: "Tribunal Superior" },
  { value: "Órgão Regulador", label: "Órgão Regulador" },
  { value: "Órgão Governamental", label: "Órgão Governamental" },
  { value: "Publicação Oficial", label: "Publicação Oficial" },
  { value: "Instituição Acadêmica", label: "Instituição Acadêmica" },
];

const confiabilidadeOptions = [
  { value: "Alta", label: "Alta" },
  { value: "Média", label: "Média" },
  { value: "Baixa", label: "Baixa" },
];

export function FontesPage() {
  const [items, setItems] = useState(initialFontes);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Fonte | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Fonte | null>(null);
  const [form, setForm] = useState({ name: "", sigla: "", type: "Tribunal Superior", url: "", editoriaPadrao: "", confiabilidade: "Alta", monitorada: false });

  const openCreate = () => { setEditing(null); setForm({ name: "", sigla: "", type: "Tribunal Superior", url: "", editoriaPadrao: "", confiabilidade: "Alta", monitorada: false }); setDialogOpen(true); };
  const openEdit = (item: Fonte) => { setEditing(item); setForm({ name: item.name, sigla: item.sigla, type: item.type, url: item.url, editoriaPadrao: item.editoriaPadrao, confiabilidade: item.confiabilidade, monitorada: item.monitorada }); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("Nome é obrigatório"); return; }
    if (!form.sigla.trim()) { toast.error("Sigla é obrigatória"); return; }
    if (editing) {
      setItems((p) => p.map((i) => i.id === editing.id ? { ...i, ...form } : i));
      toast.success("Fonte atualizada");
    } else {
      setItems((p) => [...p, { id: uid(), ...form, articles: 0 }]);
      toast.success("Fonte criada");
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setItems((p) => p.filter((i) => i.id !== deleteTarget.id));
    toast.success("Fonte excluída");
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Fontes" subtitle="Registre fontes oficiais, tribunais e órgãos monitorados">
        <PrimaryBtn onClick={openCreate} icon={Plus}>Nova fonte</PrimaryBtn>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f) => (
          <div key={f.id} className="rounded-lg bg-card p-5 shadow-editorial hover:shadow-editorial-lg transition-shadow group">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Scale className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div className="flex items-center gap-2">
                {f.monitorada && <Activity className="h-3 w-3 text-status-published" strokeWidth={2} />}
                <span className="text-[11px] font-bold text-bronze tracking-wider">{f.sigla}</span>
                <DropdownActions onEdit={() => openEdit(f)} onDelete={() => setDeleteTarget(f)} />
              </div>
            </div>
            <h3 className="mt-3 text-[14px] font-semibold text-foreground font-ui leading-tight">{f.name}</h3>
            <p className="mt-1 text-[12px] text-muted-foreground">{f.type}</p>
            <div className="mt-3 flex items-center justify-between text-[12px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span>{f.url}</span>
              </div>
              <span className="tabular-nums">{f.articles} ref.</span>
            </div>
            {f.editoriaPadrao && (
              <p className="mt-2 text-[10px] text-bronze font-medium">Editoria: {f.editoriaPadrao}</p>
            )}
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-ui text-[15px]">{editing ? "Editar fonte" : "Nova fonte"}</DialogTitle>
            <DialogDescription className="text-[13px]">{editing ? "Atualize os dados da fonte." : "Cadastre uma nova fonte oficial."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <FormField label="Nome completo">
              <FormInput value={form.name} onChange={(e) => setForm({ ...form, name: (e.target as HTMLInputElement).value })} placeholder="Supremo Tribunal Federal" />
            </FormField>
            <div className="grid grid-cols-3 gap-3">
              <FormField label="Sigla">
                <FormInput value={form.sigla} onChange={(e) => setForm({ ...form, sigla: (e.target as HTMLInputElement).value.toUpperCase() })} placeholder="STF" maxLength={10} />
              </FormField>
              <FormField label="Tipo">
                <FormSelect value={form.type} onChange={(v) => setForm({ ...form, type: v })} options={fonteTypeOptions} />
              </FormField>
              <FormField label="Confiabilidade">
                <FormSelect value={form.confiabilidade} onChange={(v) => setForm({ ...form, confiabilidade: v })} options={confiabilidadeOptions} />
              </FormField>
            </div>
            <FormField label="URL">
              <FormInput value={form.url} onChange={(e) => setForm({ ...form, url: (e.target as HTMLInputElement).value })} placeholder="stf.jus.br" />
            </FormField>
            <FormField label="Editoria padrão">
              <FormSelect value={form.editoriaPadrao} onChange={(v) => setForm({ ...form, editoriaPadrao: v })} options={[{ value: "", label: "Nenhuma" }, ...editoriaOptionsRequired]} />
            </FormField>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.monitorada} onChange={(e) => setForm({ ...form, monitorada: e.target.checked })} className="rounded border-input" />
              <span className="text-[12px] text-foreground">Fonte monitorada (recebe alertas de novas publicações)</span>
            </label>
          </div>
          <DialogFooter className="gap-2">
            <button onClick={() => setDialogOpen(false)} className="h-9 rounded-md border border-input bg-card px-4 text-[13px] font-medium text-foreground hover:bg-secondary transition-colors">Cancelar</button>
            <button onClick={handleSave} className="h-9 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5">
              <Save className="h-3.5 w-3.5" strokeWidth={2} /> {editing ? "Salvar" : "Criar"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Excluir fonte" description={`Tem certeza que deseja excluir "${deleteTarget?.name}"?`} />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   HOME & DESTAQUES
   ═══════════════════════════════════════════════ */

type HomeZone = { id: string; name: string; mode: "manual" | "auto"; items: { id: number; title: string; editoria: string }[]; maxItems: number };

const initialZones: HomeZone[] = [
  { id: "manchete", name: "Manchete principal", mode: "manual", maxItems: 1, items: [{ id: 1, title: "STF suspende efeitos de lei estadual sobre ICMS", editoria: "Tributário" }] },
  { id: "secundarios", name: "Destaques secundários", mode: "manual", maxItems: 3, items: [
    { id: 2, title: "Nova lei de recuperação judicial", editoria: "Empresarial" },
    { id: 3, title: "STJ consolida entendimento sobre usucapião", editoria: "Imobiliário" },
    { id: 4, title: "TJ-SP reconhece direito de companheiro", editoria: "Sucessório" },
  ]},
  { id: "decisoes", name: "Decisões recentes", mode: "auto", maxItems: 4, items: [] },
  { id: "artigos", name: "Artigos & Análises", mode: "auto", maxItems: 3, items: [] },
  { id: "opiniao", name: "Opinião", mode: "auto", maxItems: 3, items: [] },
  { id: "editorias", name: "Editorias", mode: "auto", maxItems: 4, items: [] },
];

const urgentConfig = { active: true, title: "STF suspende efeitos de lei estadual sobre ICMS", link: "/decisao/stf-suspende-icms", expiresAt: "Hoje, 20:00" };

export function HomeDestaquesPage() {
  const [zones] = useState(initialZones);
  const [urgent, setUrgent] = useState(urgentConfig);

  return (
    <div className="space-y-5">
      <PageHeader title="Home & Destaques" subtitle="Controle as zonas editoriais da página inicial">
        <SecondaryBtn onClick={() => toast.info("Preview da home abrirá em nova aba.")} icon={Eye}>Pré-visualizar home</SecondaryBtn>
      </PageHeader>

      {/* Urgente */}
      <div className="rounded-lg bg-card shadow-editorial overflow-hidden">
        <div className="border-b border-border px-5 py-3.5 flex items-center justify-between">
          <h3 className="text-[13px] font-semibold text-foreground font-ui flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-destructive" strokeWidth={2} />
            Faixa de urgente
          </h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={urgent.active} onChange={(e) => setUrgent({ ...urgent, active: e.target.checked })} className="rounded border-input" />
            <span className="text-[11px] text-foreground font-medium">{urgent.active ? "Ativo" : "Inativo"}</span>
          </label>
        </div>
        {urgent.active && (
          <div className="px-5 py-4 space-y-3">
            <div className="flex items-center gap-3 text-[12px]">
              <span className="text-muted-foreground">Título:</span>
              <span className="text-foreground font-medium">{urgent.title}</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
              <span>Expira: <span className="text-bronze font-medium">{urgent.expiresAt}</span></span>
            </div>
          </div>
        )}
      </div>

      {/* Zones */}
      <div className="grid gap-4 lg:grid-cols-2">
        {zones.map((zone) => (
          <div key={zone.id} className="rounded-lg bg-card shadow-editorial overflow-hidden">
            <div className="border-b border-border px-5 py-3.5 flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-foreground font-ui">{zone.name}</h3>
              <div className="flex items-center gap-2">
                <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider", zone.mode === "auto" ? "bg-status-published/10 text-status-published" : "bg-bronze/10 text-bronze")}>
                  {zone.mode === "auto" ? "Automático" : "Manual"}
                </span>
                <span className="text-[10px] text-muted-foreground">max {zone.maxItems}</span>
              </div>
            </div>
            <div className="p-4">
              {zone.mode === "manual" && zone.items.length > 0 ? (
                <div className="space-y-2">
                  {zone.items.map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-3 text-[12px]">
                      <span className="w-5 h-5 rounded bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold tabular-nums">{idx + 1}</span>
                      <span className="text-foreground font-medium truncate flex-1">{item.title}</span>
                      <span className="text-[10px] text-bronze shrink-0">{item.editoria}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-muted-foreground">Preenchimento automático — exibe os conteúdos mais recentes.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   NEWSLETTER
   ═══════════════════════════════════════════════ */

type NewsletterSend = { id: number; subject: string; sent: string; opens: string; clicks: string; recipients: number; status: string };

const initialNewsletters: NewsletterSend[] = [
  { id: 1, subject: "Veredito Semanal #42 — Reforma tributária: o que muda", sent: "18 mar 2026", opens: "42.1%", clicks: "8.3%", recipients: 1102, status: "sent" },
  { id: 2, subject: "Veredito Semanal #41 — STF e as teses do século", sent: "11 mar 2026", opens: "39.8%", clicks: "7.1%", recipients: 1087, status: "sent" },
  { id: 3, subject: "Veredito Semanal #40 — Direito digital em debate", sent: "04 mar 2026", opens: "36.5%", clicks: "6.9%", recipients: 1054, status: "sent" },
];

const newsletterStats = [
  { label: "Inscritos", value: "1.284", icon: Users, change: "+47 esta semana" },
  { label: "Taxa abertura", value: "38.2%", icon: Eye, change: "+2.1% vs anterior" },
  { label: "Último envio", value: "18 mar", icon: Send, change: "1.102 destinatários" },
  { label: "Próximo envio", value: "21 mar", icon: Calendar, change: "Sexta, 08:00" },
];

export function NewsletterPage() {
  const [items, setItems] = useState(initialNewsletters);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<NewsletterSend | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NewsletterSend | null>(null);
  const [form, setForm] = useState({ subject: "", body: "" });

  const openCreate = () => { setEditing(null); setForm({ subject: "", body: "" }); setDialogOpen(true); };
  const openEdit = (item: NewsletterSend) => { setEditing(item); setForm({ subject: item.subject, body: "" }); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.subject.trim()) { toast.error("Assunto é obrigatório"); return; }
    if (editing) {
      setItems((p) => p.map((i) => i.id === editing.id ? { ...i, subject: form.subject } : i));
      toast.success("Newsletter atualizada");
    } else {
      const now = new Date();
      const dateStr = `${now.getDate()} ${now.toLocaleString("pt-BR", { month: "short" })} ${now.getFullYear()}`;
      setItems((p) => [{ id: uid(), subject: form.subject, sent: dateStr, opens: "—", clicks: "—", recipients: 1284, status: "draft" }, ...p]);
      toast.success("Newsletter criada");
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setItems((p) => p.filter((i) => i.id !== deleteTarget.id));
    toast.success("Newsletter excluída");
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Newsletter" subtitle="Gerencie leads, edições e métricas de envio">
        <div className="flex items-center gap-2">
          <SecondaryBtn onClick={() => toast.success("Exportação iniciada.")} icon={Download}>Exportar leads</SecondaryBtn>
          <PrimaryBtn onClick={openCreate} icon={Send}>Nova edição</PrimaryBtn>
        </div>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {newsletterStats.map((s) => (
          <div key={s.label} className="rounded-lg bg-card p-4 shadow-editorial">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-muted-foreground/50" strokeWidth={1.5} />
            </div>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">{s.value}</p>
            <p className="mt-0.5 text-[11px] text-bronze">{s.change}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg bg-card shadow-editorial overflow-hidden">
        <div className="border-b border-border px-5 py-3.5">
          <h3 className="text-[13px] font-semibold text-foreground font-ui">Edições</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Assunto</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Data</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Abertura</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Cliques</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((n) => (
              <tr key={n.id} className="hover:bg-secondary/50 transition-colors">
                <td className="px-5 py-3"><p className="text-[13px] font-medium text-foreground truncate max-w-md">{n.subject}</p></td>
                <td className="px-4 py-3">
                  <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider", n.status === "sent" ? "bg-status-published/10 text-status-published" : "bg-status-draft/10 text-status-draft")}>
                    {n.status === "sent" ? "Enviada" : "Rascunho"}
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell"><span className="text-[12px] text-muted-foreground tabular-nums">{n.sent}</span></td>
                <td className="px-4 py-3 text-right"><span className="text-[13px] font-medium text-foreground tabular-nums">{n.opens}</span></td>
                <td className="px-4 py-3 text-right hidden md:table-cell"><span className="text-[13px] text-muted-foreground tabular-nums">{n.clicks}</span></td>
                <td className="px-3 py-3"><DropdownActions onEdit={() => openEdit(n)} onDelete={() => setDeleteTarget(n)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-ui text-[15px]">{editing ? "Editar edição" : "Nova edição"}</DialogTitle>
            <DialogDescription className="text-[13px]">{editing ? "Atualize o assunto." : "Configure a próxima edição da newsletter."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <FormField label="Assunto">
              <FormInput value={form.subject} onChange={(e) => setForm({ ...form, subject: (e.target as HTMLInputElement).value })} placeholder="Veredito Semanal #43 — Tema da edição" />
            </FormField>
            <FormField label="Corpo da newsletter">
              <FormTextarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Conteúdo da newsletter..." rows={6} />
            </FormField>
          </div>
          <DialogFooter className="gap-2">
            <button onClick={() => setDialogOpen(false)} className="h-9 rounded-md border border-input bg-card px-4 text-[13px] font-medium text-foreground hover:bg-secondary transition-colors">Cancelar</button>
            <button onClick={handleSave} className="h-9 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5">
              <Send className="h-3.5 w-3.5" strokeWidth={2} /> {editing ? "Salvar" : "Criar edição"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Excluir edição" description={`Excluir "${deleteTarget?.subject}"?`} />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   USUÁRIOS
   ═══════════════════════════════════════════════ */

type Usuario = { id: number; name: string; email: string; role: string; status: string; lastLogin: string; initials: string; permissions: string[] };

const initialUsuarios: Usuario[] = [
  { id: 1, name: "Editor Chefe", email: "editor@veredito.com", role: "Admin", status: "active", lastLogin: "há 5 min", initials: "EC", permissions: ["publicar", "aprovar", "home", "urgente", "analytics", "usuarios"] },
  { id: 2, name: "Ana Beatriz", email: "ana@veredito.com", role: "Editor-chefe", status: "active", lastLogin: "há 2h", initials: "AB", permissions: ["publicar", "aprovar", "home"] },
  { id: 3, name: "Carlos Mendes", email: "carlos@veredito.com", role: "Editor", status: "active", lastLogin: "há 1 dia", initials: "CM", permissions: ["publicar"] },
  { id: 4, name: "Fernanda Lima", email: "fernanda@veredito.com", role: "Colunista", status: "inactive", lastLogin: "há 15 dias", initials: "FL", permissions: [] },
  { id: 5, name: "Ricardo Alves", email: "ricardo@veredito.com", role: "Autor", status: "active", lastLogin: "há 3 dias", initials: "RA", permissions: [] },
];

const userRoleOptions = [
  { value: "Admin", label: "Admin" },
  { value: "Editor-chefe", label: "Editor-chefe" },
  { value: "Editor", label: "Editor" },
  { value: "Revisor jurídico", label: "Revisor jurídico" },
  { value: "Autor", label: "Autor" },
  { value: "Colunista", label: "Colunista" },
  { value: "Operador newsletter", label: "Operador newsletter" },
];

const userStatusOptions = [
  { value: "active", label: "Ativo" },
  { value: "inactive", label: "Inativo" },
];

export function UsuariosPage() {
  const [items, setItems] = useState(initialUsuarios);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Usuario | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Usuario | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "Autor", status: "active" });

  const openCreate = () => { setEditing(null); setForm({ name: "", email: "", role: "Autor", status: "active" }); setDialogOpen(true); };
  const openEdit = (item: Usuario) => { setEditing(item); setForm({ name: item.name, email: item.email, role: item.role, status: item.status }); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("Nome é obrigatório"); return; }
    if (!form.email.trim()) { toast.error("E-mail é obrigatório"); return; }
    if (editing) {
      setItems((p) => p.map((i) => i.id === editing.id ? { ...i, ...form, initials: getInitials(form.name) } : i));
      toast.success("Usuário atualizado");
    } else {
      setItems((p) => [...p, { id: uid(), ...form, lastLogin: "nunca", initials: getInitials(form.name), permissions: [] }]);
      toast.success("Convite enviado");
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setItems((p) => p.filter((i) => i.id !== deleteTarget.id));
    toast.success("Usuário removido");
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Usuários" subtitle="Gerencie acessos e papéis editoriais">
        <PrimaryBtn onClick={openCreate} icon={Plus}>Convidar usuário</PrimaryBtn>
      </PageHeader>

      <div className="rounded-lg bg-card shadow-editorial overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Usuário</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Papel</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Permissões</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Último acesso</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((u) => (
              <tr key={u.id} className="hover:bg-secondary/50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">{u.initials}</div>
                    <div>
                      <p className="text-[13px] font-medium text-foreground">{u.name}</p>
                      <p className="text-[11px] text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium", u.role === "Admin" ? "bg-bronze/10 text-bronze" : "bg-secondary text-muted-foreground")}>
                    {u.role === "Admin" && <Shield className="h-3 w-3 mr-1" strokeWidth={1.5} />}
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {u.permissions.slice(0, 3).map((p) => (
                      <span key={p} className="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">{p}</span>
                    ))}
                    {u.permissions.length > 3 && <span className="text-[9px] text-muted-foreground">+{u.permissions.length - 3}</span>}
                    {u.permissions.length === 0 && <span className="text-[9px] text-muted-foreground">—</span>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("h-1.5 w-1.5 rounded-full", u.status === "active" ? "bg-status-published" : "bg-muted-foreground/30")} />
                    <span className="text-[12px] text-muted-foreground">{u.status === "active" ? "Ativo" : "Inativo"}</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell"><span className="text-[12px] text-muted-foreground">{u.lastLogin}</span></td>
                <td className="px-3 py-3"><DropdownActions onEdit={() => openEdit(u)} onDelete={() => setDeleteTarget(u)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-ui text-[15px]">{editing ? "Editar usuário" : "Convidar usuário"}</DialogTitle>
            <DialogDescription className="text-[13px]">{editing ? "Atualize os dados do usuário." : "Envie um convite para acesso ao painel."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <FormField label="Nome">
              <FormInput value={form.name} onChange={(e) => setForm({ ...form, name: (e.target as HTMLInputElement).value })} placeholder="Nome completo" />
            </FormField>
            <FormField label="E-mail">
              <FormInput type="email" value={form.email} onChange={(e) => setForm({ ...form, email: (e.target as HTMLInputElement).value })} placeholder="email@veredito.com" />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Papel">
                <FormSelect value={form.role} onChange={(v) => setForm({ ...form, role: v })} options={userRoleOptions} />
              </FormField>
              <FormField label="Status">
                <FormSelect value={form.status} onChange={(v) => setForm({ ...form, status: v })} options={userStatusOptions} />
              </FormField>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <button onClick={() => setDialogOpen(false)} className="h-9 rounded-md border border-input bg-card px-4 text-[13px] font-medium text-foreground hover:bg-secondary transition-colors">Cancelar</button>
            <button onClick={handleSave} className="h-9 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5">
              <Save className="h-3.5 w-3.5" strokeWidth={2} /> {editing ? "Salvar" : "Enviar convite"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Remover usuário" description={`Remover "${deleteTarget?.name}" do painel?`} />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CONFIGURAÇÕES
   ═══════════════════════════════════════════════ */

type ConfigSection = { id: string; title: string; description: string; icon: React.ElementType; fields: { key: string; label: string; type: "text" | "textarea" | "toggle"; defaultValue: string }[] };

const configSections: ConfigSection[] = [
  {
    id: "geral", title: "Geral", description: "Nome do portal, descrição e URL base", icon: Settings,
    fields: [
      { key: "portal_name", label: "Nome do portal", type: "text", defaultValue: "Veredito" },
      { key: "portal_url", label: "URL do portal", type: "text", defaultValue: "https://veredito.com.br" },
      { key: "portal_desc", label: "Descrição", type: "textarea", defaultValue: "Jornalismo jurídico com profundidade e rigor editorial." },
    ],
  },
  {
    id: "navegacao", title: "Navegação pública", description: "Menus, ordem das editorias e links visíveis", icon: LayoutGrid,
    fields: [
      { key: "menu_formatos", label: "Formatos no menu principal", type: "text", defaultValue: "Notícias, Decisões, Artigos, Opinião" },
      { key: "menu_editorias", label: "Editorias visíveis", type: "text", defaultValue: "Tributário, Empresarial, Imobiliário, Sucessório" },
    ],
  },
  {
    id: "seo", title: "SEO global", description: "Meta tags padrão, Open Graph e robots", icon: Globe,
    fields: [
      { key: "meta_title", label: "Meta título padrão", type: "text", defaultValue: "Veredito — Jornalismo Jurídico" },
      { key: "meta_desc", label: "Meta descrição padrão", type: "textarea", defaultValue: "Análises, decisões e opiniões sobre o universo jurídico brasileiro." },
      { key: "og_image", label: "URL da imagem Open Graph", type: "text", defaultValue: "https://veredito.com.br/og-image.jpg" },
    ],
  },
  {
    id: "notificacoes", title: "Alertas editoriais", description: "Prazos de revisão, alertas de SLA e notificações", icon: Bell,
    fields: [
      { key: "email_alerts", label: "E-mail para alertas", type: "text", defaultValue: "redacao@veredito.com" },
      { key: "review_deadline", label: "Prazo de revisão (horas)", type: "text", defaultValue: "24" },
      { key: "seo_alert", label: "Alertar conteúdo sem SEO", type: "text", defaultValue: "Sim" },
    ],
  },
  {
    id: "integracoes", title: "Analytics e pixels", description: "Google Analytics, pixels de conversão e webhooks", icon: Database,
    fields: [
      { key: "analytics_id", label: "Google Analytics ID", type: "text", defaultValue: "" },
      { key: "webhook_url", label: "Webhook URL", type: "text", defaultValue: "" },
    ],
  },
  {
    id: "seguranca", title: "Segurança", description: "Políticas de acesso, sessões e auditoria", icon: Shield,
    fields: [
      { key: "force_2fa", label: "Forçar 2FA para admins", type: "text", defaultValue: "Sim" },
      { key: "session_timeout", label: "Timeout da sessão (min)", type: "text", defaultValue: "60" },
    ],
  },
];

export function ConfiguracoesPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const openSection = (section: ConfigSection) => {
    const data: Record<string, string> = {};
    section.fields.forEach((f) => { data[f.key] = f.defaultValue; });
    setFormData(data);
    setActiveSection(section.id);
  };

  const handleSave = () => {
    toast.success("Configurações salvas");
    setActiveSection(null);
  };

  const section = configSections.find((s) => s.id === activeSection);

  if (section) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveSection(null)} className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <div>
            <h2 className="font-display text-2xl text-foreground">{section.title}</h2>
            <p className="text-[13px] text-muted-foreground mt-0.5">{section.description}</p>
          </div>
        </div>

        <div className="rounded-lg bg-card p-6 shadow-editorial space-y-5 max-w-2xl">
          {section.fields.map((f) => (
            <FormField key={f.key} label={f.label}>
              {f.type === "textarea" ? (
                <FormTextarea value={formData[f.key] || ""} onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })} rows={3} />
              ) : (
                <FormInput value={formData[f.key] || ""} onChange={(e) => setFormData({ ...formData, [f.key]: (e.target as HTMLInputElement).value })} />
              )}
            </FormField>
          ))}
          <div className="flex items-center gap-2 pt-2">
            <button onClick={() => setActiveSection(null)} className="h-9 rounded-md border border-input bg-card px-4 text-[13px] font-medium text-foreground hover:bg-secondary transition-colors">Cancelar</button>
            <button onClick={handleSave} className="h-9 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5">
              <Save className="h-3.5 w-3.5" strokeWidth={2} /> Salvar configurações
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Configurações" subtitle="Configurações gerais, SEO, navegação e integrações" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {configSections.map((s) => (
          <button key={s.id} onClick={() => openSection(s)} className="rounded-lg bg-card p-5 shadow-editorial hover:shadow-editorial-lg transition-shadow text-left group">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <s.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground font-ui">{s.title}</h3>
                <p className="mt-0.5 text-[12px] text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
