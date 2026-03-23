import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Save,
  Scale,
  Building2,
  Briefcase,
  BookOpen,
  GraduationCap,
  ChevronUp,
  ChevronDown,
  Link2,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  buildHomeHighlightContentOptions,
  ContentEntity,
  EditorialSectionEntity,
  AuthorEntity,
  SourceEntity,
  HomeHighlightEntity,
  canConteudoAppearInHomeHighlights,
  contentStatusLabels,
  contentStatusStyles,
  getContentTypeLabel,
  normalizeSlug,
  useEditorialStore,
} from "./editorial-store";

const editoriaIcons = [Scale, Building2, Briefcase, BookOpen, Users, GraduationCap];
const roleOptions = [
  { value: "Editora Sênior", label: "Editor(a) Sênior" },
  { value: "Repórter Jurídico", label: "Repórter Jurídico" },
  { value: "Colunista", label: "Colunista" },
  { value: "Colaborador", label: "Colaborador" },
  { value: "Editor Assistente", label: "Editor Assistente" },
];
const sourceTypeOptions = [
  { value: "Tribunal Superior", label: "Tribunal Superior" },
  { value: "Órgão Regulador", label: "Órgão Regulador" },
  { value: "Órgão Governamental", label: "Órgão Governamental" },
  { value: "Publicação Oficial", label: "Publicação Oficial" },
  { value: "Instituição Acadêmica", label: "Instituição Acadêmica" },
];
const reliabilityOptions = [
  { value: "alta", label: "Alta" },
  { value: "media", label: "Média" },
  { value: "baixa", label: "Baixa" },
];
const entityStatusOptions = [
  { value: "active", label: "Ativo" },
  { value: "inactive", label: "Inativo" },
];
const highlightTypeOptions = [
  { value: "Manchete", label: "Manchete" },
  { value: "Destaque", label: "Destaque" },
  { value: "Secundário", label: "Secundário" },
] as const;

function PageHeader({ title, subtitle, children }: { title: string; subtitle: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="font-display text-2xl text-foreground">{title}</h2>
        <p className="mt-0.5 text-[13px] text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function PrimaryBtn({ onClick, icon: Icon, children }: { onClick: () => void; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90">
      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      {children}
    </button>
  );
}

function SecondaryBtn({ onClick, icon: Icon, children }: { onClick: () => void; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="flex h-9 items-center gap-1.5 rounded-md border border-input bg-card px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-secondary">
      <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
      {children}
    </button>
  );
}

function FormField({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-foreground">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function FormInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px] text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
    />
  );
}

function FormTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="min-h-[80px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
    />
  );
}

function FormSelect({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px] text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
}

function ConfirmDialog({ open, onClose, onConfirm, title, description }: { open: boolean; onClose: () => void; onConfirm: () => void; title: string; description: string }) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-ui text-[15px]">{title}</DialogTitle>
          <DialogDescription className="text-[13px]">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <button onClick={onClose} className="h-9 rounded-md border border-input bg-card px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-secondary">Cancelar</button>
          <button onClick={onConfirm} className="h-9 rounded-md bg-destructive px-4 text-[13px] font-medium text-destructive-foreground transition-colors hover:bg-destructive/90">Excluir</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DropdownActions({ onPreview, onEdit, onDelete }: { onPreview?: () => void; onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen((prev) => !prev)} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
        <MoreHorizontal className="h-4 w-4" strokeWidth={1.5} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1 w-36 rounded-md border border-border bg-popover py-1 shadow-editorial-lg">
            {onPreview && (
              <button onClick={() => { setOpen(false); onPreview(); }} className="flex w-full items-center gap-2 px-3 py-1.5 text-[13px] text-foreground transition-colors hover:bg-secondary">
                <Eye className="h-3.5 w-3.5" strokeWidth={1.5} /> Preview
              </button>
            )}
            <button onClick={() => { setOpen(false); onEdit(); }} className="flex w-full items-center gap-2 px-3 py-1.5 text-[13px] text-foreground transition-colors hover:bg-secondary">
              <Edit className="h-3.5 w-3.5" strokeWidth={1.5} /> Editar
            </button>
            <button onClick={() => { setOpen(false); onDelete(); }} className="flex w-full items-center gap-2 px-3 py-1.5 text-[13px] text-destructive transition-colors hover:bg-secondary">
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} /> Excluir
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function formatCountLabel(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function getArticleCount(conteudos: ContentEntity[], predicate: (item: ContentEntity) => boolean) {
  return conteudos.filter(predicate).length;
}

function getEmptyOption(label: string) {
  return { value: "", label };
}

export function AutoresPage() {
  const { autores, conteudos, createAutor, updateAutor, removeAutor } = useEditorialStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AuthorEntity | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AuthorEntity | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", role: "Repórter Jurídico", email: "", bio: "", status: "active" as "active" | "inactive" });

  const items = useMemo(() => autores.map((item) => ({ ...item, articles: getArticleCount(conteudos, (content) => content.authorId === item.id) })), [autores, conteudos]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", slug: "", role: "Repórter Jurídico", email: "", bio: "", status: "active" });
    setDialogOpen(true);
  };

  const openEdit = (item: AuthorEntity) => {
    setEditing(item);
    setForm({ name: item.name, slug: item.slug, role: item.role, email: item.email, bio: item.bio, status: item.status });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }
    if (!form.email.trim()) {
      toast.error("E-mail é obrigatório");
      return;
    }

    const payload = {
      name: form.name.trim(),
      slug: normalizeSlug(form.slug.trim() || form.name.trim()),
      role: form.role,
      email: form.email.trim(),
      bio: form.bio.trim(),
      status: form.status,
    };

    const duplicateSlug = autores.find((item) => item.slug === payload.slug && item.id !== editing?.id);
    if (duplicateSlug) {
      toast.error("Já existe um autor com este slug.");
      return;
    }

    const linkedCount = editing ? conteudos.filter((content) => content.authorId === editing.id).length : 0;
    if (editing && linkedCount > 0 && payload.status === "inactive") {
      toast.error("Não é possível inativar um autor que já sustenta conteúdos canônicos.");
      return;
    }

    if (editing) {
      updateAutor(editing.id, payload);
      toast.success("Autor atualizado");
    } else {
      createAutor(payload);
      toast.success("Autor criado");
    }

    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const removed = removeAutor(deleteTarget.id);
    if (!removed) {
      toast.error("Este autor ainda está vinculado a conteúdos.");
      return;
    }
    toast.success("Autor excluído");
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Autores" subtitle="Mantenha a autoria editorial como entidade canônica do admin">
        <PrimaryBtn onClick={openCreate} icon={Plus}>Novo autor</PrimaryBtn>
      </PageHeader>

      <div className="overflow-hidden rounded-lg bg-card shadow-editorial">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Autor</th>
              <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Papel</th>
              <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">E-mail</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Conteúdos</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-secondary/50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">{item.initials}</div>
                    <div>
                      <span className="text-[13px] font-medium text-foreground">{item.name}</span>
                      <p className="text-[11px] text-muted-foreground">/{item.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 md:table-cell"><span className="text-[12px] font-medium text-bronze">{item.role}</span></td>
                <td className="hidden px-4 py-3 lg:table-cell"><span className="text-[12px] text-muted-foreground">{item.email}</span></td>
                <td className="px-4 py-3 text-right"><span className="text-[13px] font-medium text-foreground tabular-nums">{item.articles}</span></td>
                <td className="px-3 py-3"><DropdownActions onEdit={() => openEdit(item)} onDelete={() => setDeleteTarget(item)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-ui text-[15px]">{editing ? "Editar autor" : "Novo autor"}</DialogTitle>
            <DialogDescription className="text-[13px]">Cadastre a autoria que passa a alimentar Conteúdos e a futura página pública de autor.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <FormField label="Nome completo">
              <FormInput value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Nome do autor" />
            </FormField>
            <FormField label="Slug">
              <FormInput value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} placeholder="nome-do-autor" />
            </FormField>
            <FormField label="E-mail">
              <FormInput type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="email@veredito.com" />
            </FormField>
            <FormField label="Cargo / função editorial">
              <FormSelect value={form.role} onChange={(value) => setForm({ ...form, role: value })} options={roleOptions} />
            </FormField>
            <FormField label="Bio curta">
              <FormTextarea value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} placeholder="Breve biografia" rows={2} />
            </FormField>
            <FormField label="Status">
              <FormSelect value={form.status} onChange={(value) => setForm({ ...form, status: value as "active" | "inactive" })} options={entityStatusOptions} />
            </FormField>
          </div>
          <DialogFooter className="gap-2">
            <button onClick={() => setDialogOpen(false)} className="h-9 rounded-md border border-input bg-card px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-secondary">Cancelar</button>
            <button onClick={handleSave} className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              <Save className="h-3.5 w-3.5" strokeWidth={2} /> {editing ? "Salvar" : "Criar"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Excluir autor" description={`Tem certeza que deseja excluir "${deleteTarget?.name}"?`} />
    </div>
  );
}
export function ConteudosPage() {
  const navigate = useNavigate();
  const { conteudos, removeConteudo, getEditoriaById, getAutorById } = useEditorialStore();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ContentEntity | null>(null);

  const items = useMemo(() => [...conteudos].sort((a, b) => b.id - a.id), [conteudos]);

  const openCreate = () => {
    navigate("/admin/conteudos/tipo");
  };

  const openEdit = (item: ContentEntity) => {
    navigate(`/admin/conteudos/${item.id}/editar`);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    removeConteudo(deleteTarget.id);
    toast.success("Conteúdo excluído");
    setDeleteTarget(null);
  };

  const filtered = items
    .filter((item) => filter === "all" || item.status === filter)
    .filter((item) => {
      const authorName = getAutorById(item.authorId)?.name || "";
      return !search || item.title.toLowerCase().includes(search.toLowerCase()) || authorName.toLowerCase().includes(search.toLowerCase());
    });

  return (
    <div className="space-y-5">
      <PageHeader title="Conteúdos" subtitle="Gerencie notícias, decisões, artigos e opiniões">
        <PrimaryBtn onClick={openCreate} icon={Plus}>Novo conteúdo</PrimaryBtn>
      </PageHeader>

      <div className="flex items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar conteúdos..." className="h-9 w-full rounded-md border border-input bg-card pl-8 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>
        <div className="flex items-center gap-1.5">
          {["all", "draft", "review", "adjustments", "approved", "published"].map((value) => (
            <button key={value} onClick={() => setFilter(value)} className={cn("h-8 rounded-md px-3 text-[12px] font-medium transition-colors", filter === value ? "bg-primary text-primary-foreground" : "border border-input bg-card text-muted-foreground hover:text-foreground")}>
              {value === "all" ? "Todos" : contentStatusLabels[value as keyof typeof contentStatusLabels]}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-card shadow-editorial">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Título</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Tipo</th>
              <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">Editoria</th>
              <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Autor</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">Data</th>
              <th className="hidden px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Views</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-secondary/50">
                <td className="px-5 py-3">
                  <button onClick={() => navigate(`/admin/conteudos/${item.id}/preview`)} className="max-w-xs truncate text-left text-[13px] font-medium text-foreground transition-colors hover:text-bronze">
                    {item.title}
                  </button>
                </td>
                <td className="px-4 py-3"><span className="text-[12px] text-muted-foreground">{getContentTypeLabel(item.typeKey)}</span></td>
                <td className="hidden px-4 py-3 lg:table-cell"><span className="text-[12px] font-medium text-bronze">{getEditoriaById(item.editoriaId)?.name || "—"}</span></td>
                <td className="hidden px-4 py-3 md:table-cell"><span className="text-[12px] text-muted-foreground">{getAutorById(item.authorId)?.name || "—"}</span></td>
                <td className="px-4 py-3">
                  <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium", contentStatusStyles[item.status])}>
                    <span className={cn("status-dot mr-1.5", `status-${item.status}`)} />
                    {contentStatusLabels[item.status]}
                  </span>
                </td>
                <td className="hidden px-4 py-3 lg:table-cell"><span className="text-[12px] text-muted-foreground tabular-nums">{item.dateLabel}</span></td>
                <td className="hidden px-4 py-3 text-right md:table-cell"><span className="text-[12px] text-muted-foreground tabular-nums">{item.views > 0 ? item.views.toLocaleString("pt-BR") : "—"}</span></td>
                <td className="px-3 py-3"><DropdownActions onPreview={() => navigate(`/admin/conteudos/${item.id}/preview`)} onEdit={() => openEdit(item)} onDelete={() => setDeleteTarget(item)} /></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-5 py-12 text-center text-[13px] text-muted-foreground">Nenhum conteúdo encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-[12px] text-muted-foreground">
        <span>{formatCountLabel(filtered.length, "conteúdo")}</span>
      </div>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Excluir conteúdo" description={`Tem certeza que deseja excluir "${deleteTarget?.title}"? Esta ação também remove o conteúdo da curadoria da home.`} />
    </div>
  );
}

export function EditoriasPage() {
  const { editorias, conteudos, createEditoria, updateEditoria, removeEditoria } = useEditorialStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<EditorialSectionEntity | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EditorialSectionEntity | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", status: "active" as "active" | "inactive" });

  const items = useMemo(() => editorias.map((item) => ({ ...item, count: getArticleCount(conteudos, (content) => content.editoriaId === item.id) })), [editorias, conteudos]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", slug: "", description: "", status: "active" });
    setDialogOpen(true);
  };

  const openEdit = (item: EditorialSectionEntity) => {
    setEditing(item);
    setForm({ name: item.name, slug: item.slug, description: item.description, status: item.status });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    const payload = {
      name: form.name.trim(),
      slug: normalizeSlug(form.slug.trim() || form.name.trim()),
      description: form.description.trim(),
      status: form.status,
    };

    const duplicateSlug = editorias.find((item) => item.slug === payload.slug && item.id !== editing?.id);
    if (duplicateSlug) {
      toast.error("Já existe uma editoria com este slug.");
      return;
    }

    const linkedCount = editing ? conteudos.filter((content) => content.editoriaId === editing.id).length : 0;
    if (editing && linkedCount > 0 && payload.status === "inactive") {
      toast.error("Não é possível inativar uma editoria que já sustenta conteúdos canônicos.");
      return;
    }

    if (editing) {
      updateEditoria(editing.id, payload);
      toast.success("Editoria atualizada");
    } else {
      createEditoria(payload);
      toast.success("Editoria criada");
    }

    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const removed = removeEditoria(deleteTarget.id);
    if (!removed) {
      toast.error("Esta editoria ainda está vinculada a conteúdos.");
      return;
    }
    toast.success("Editoria excluída");
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Editorias" subtitle="Organize a classificação editorial que alimenta o núcleo de conteúdos">
        <PrimaryBtn onClick={openCreate} icon={Plus}>Nova editoria</PrimaryBtn>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const Icon = editoriaIcons[index % editoriaIcons.length];
          return (
            <div key={item.id} className="group rounded-lg bg-card p-5 shadow-editorial transition-shadow hover:shadow-editorial-lg">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <DropdownActions onEdit={() => openEdit(item)} onDelete={() => setDeleteTarget(item)} />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <h3 className="text-[15px] font-semibold text-foreground font-ui">{item.name}</h3>
                <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider", item.status === "active" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground")}>
                  {item.status === "active" ? "Ativa" : "Inativa"}
                </span>
              </div>
              <p className="mt-0.5 text-[12px] text-muted-foreground">/{item.slug}</p>
              {item.description && <p className="mt-1 text-[12px] text-muted-foreground">{item.description}</p>}
              <div className="mt-3 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <FileText className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span className="tabular-nums">{formatCountLabel(item.count, "conteúdo")}</span>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-ui text-[15px]">{editing ? "Editar editoria" : "Nova editoria"}</DialogTitle>
            <DialogDescription className="text-[13px]">Configure a entidade canônica usada por Conteúdos e pela futura distribuição pública.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <FormField label="Nome">
              <FormInput value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ex: Tributário" />
            </FormField>
            <FormField label="Slug">
              <FormInput value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} placeholder="tributario" />
            </FormField>
            <FormField label="Descrição curta">
              <FormTextarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Breve descrição da editoria" rows={2} />
            </FormField>
            <FormField label="Status">
              <FormSelect value={form.status} onChange={(value) => setForm({ ...form, status: value as "active" | "inactive" })} options={entityStatusOptions} />
            </FormField>
          </div>
          <DialogFooter className="gap-2">
            <button onClick={() => setDialogOpen(false)} className="h-9 rounded-md border border-input bg-card px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-secondary">Cancelar</button>
            <button onClick={handleSave} className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              <Save className="h-3.5 w-3.5" strokeWidth={2} /> {editing ? "Salvar" : "Criar"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Excluir editoria" description={`Tem certeza que deseja excluir "${deleteTarget?.name}"?`} />
    </div>
  );
}

export function FontesPage() {
  const { fontes, conteudos, createFonte, updateFonte, removeFonte } = useEditorialStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SourceEntity | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SourceEntity | null>(null);
  const [form, setForm] = useState({ name: "", sigla: "", type: "Tribunal Superior", url: "", reliability: "alta" as "alta" | "media" | "baixa", status: "active" as "active" | "inactive" });

  const items = useMemo(() => fontes.map((item) => ({ ...item, articles: getArticleCount(conteudos, (content) => content.fonteId === item.id) })), [fontes, conteudos]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", sigla: "", type: "Tribunal Superior", url: "", reliability: "alta", status: "active" });
    setDialogOpen(true);
  };

  const openEdit = (item: SourceEntity) => {
    setEditing(item);
    setForm({ name: item.name, sigla: item.sigla, type: item.type, url: item.url, reliability: item.reliability, status: item.status });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }
    if (!form.sigla.trim()) {
      toast.error("Sigla é obrigatória");
      return;
    }

    const payload = {
      name: form.name.trim(),
      sigla: form.sigla.trim().toUpperCase(),
      type: form.type,
      url: form.url.trim(),
      reliability: form.reliability,
      status: form.status,
    };

    const duplicateSigla = fontes.find((item) => item.sigla === payload.sigla && item.id !== editing?.id);
    if (duplicateSigla) {
      toast.error("Já existe uma fonte com esta sigla.");
      return;
    }

    const linkedCount = editing ? conteudos.filter((content) => content.fonteId === editing.id).length : 0;
    if (editing && linkedCount > 0 && payload.status === "inactive") {
      toast.error("Não é possível inativar uma fonte já usada por notícia ou decisão.");
      return;
    }

    if (editing) {
      updateFonte(editing.id, payload);
      toast.success("Fonte atualizada");
    } else {
      createFonte(payload);
      toast.success("Fonte criada");
    }

    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const removed = removeFonte(deleteTarget.id);
    if (!removed) {
      toast.error("Esta fonte ainda está vinculada a notícias ou decisões.");
      return;
    }
    toast.success("Fonte excluída");
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Fontes" subtitle="Consolide a base canônica de referências para notícia e decisão">
        <PrimaryBtn onClick={openCreate} icon={Plus}>Nova fonte</PrimaryBtn>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="group rounded-lg bg-card p-5 shadow-editorial transition-shadow hover:shadow-editorial-lg">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Scale className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <DropdownActions onEdit={() => openEdit(item)} onDelete={() => setDeleteTarget(item)} />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <h3 className="text-[15px] font-semibold text-foreground font-ui">{item.sigla}</h3>
              <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider", item.status === "active" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground")}>
                {item.status === "active" ? "Ativa" : "Inativa"}
              </span>
            </div>
            <p className="mt-0.5 text-[13px] text-foreground">{item.name}</p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">{item.type}</p>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
              <Shield className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>Confiabilidade {item.reliability}</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
              <Link2 className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span className="truncate">{item.url || "URL mockada não informada"}</span>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <FileText className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span className="tabular-nums">{formatCountLabel(item.articles, "uso")}</span>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-ui text-[15px]">{editing ? "Editar fonte" : "Nova fonte"}</DialogTitle>
            <DialogDescription className="text-[13px]">Cadastre a fonte editorial local que será consumida por notícia e decisão.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <FormField label="Nome da fonte">
              <FormInput value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Supremo Tribunal Federal" />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Sigla">
                <FormInput value={form.sigla} onChange={(event) => setForm({ ...form, sigla: event.target.value })} placeholder="STF" />
              </FormField>
              <FormField label="Tipo">
                <FormSelect value={form.type} onChange={(value) => setForm({ ...form, type: value })} options={sourceTypeOptions} />
              </FormField>
            </div>
            <FormField label="URL mockada">
              <FormInput value={form.url} onChange={(event) => setForm({ ...form, url: event.target.value })} placeholder="https://stf.jus.br" />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Confiabilidade">
                <FormSelect value={form.reliability} onChange={(value) => setForm({ ...form, reliability: value as "alta" | "media" | "baixa" })} options={reliabilityOptions} />
              </FormField>
              <FormField label="Status">
                <FormSelect value={form.status} onChange={(value) => setForm({ ...form, status: value as "active" | "inactive" })} options={entityStatusOptions} />
              </FormField>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <button onClick={() => setDialogOpen(false)} className="h-9 rounded-md border border-input bg-card px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-secondary">Cancelar</button>
            <button onClick={handleSave} className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              <Save className="h-3.5 w-3.5" strokeWidth={2} /> {editing ? "Salvar" : "Criar"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Excluir fonte" description={`Tem certeza que deseja excluir "${deleteTarget?.name}"?`} />
    </div>
  );
}

export function HomeDestaquesPage() {
  const { homeHighlights, conteudos, editorias, autores, fontes, upsertHomeHighlight, removeHomeHighlight, getConteudoById, getEditoriaById } = useEditorialStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<HomeHighlightEntity | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HomeHighlightEntity | null>(null);
  const [form, setForm] = useState({ contentId: "", slotType: "Destaque" as HomeHighlightEntity["slotType"] });

  const contentOptions = useMemo(
    () => [getEmptyOption("Selecionar conteúdo elegível..."), ...buildHomeHighlightContentOptions(conteudos, editorias, autores, fontes)],
    [conteudos, editorias, autores, fontes],
  );
  const items = useMemo(() => [...homeHighlights].sort((a, b) => a.position - b.position), [homeHighlights]);
  const eligibleConteudos = useMemo(
    () => conteudos.filter((item) => canConteudoAppearInHomeHighlights(item, editorias, autores, fontes)),
    [conteudos, editorias, autores, fontes],
  );
  const integrityIssues = useMemo(
    () => items.filter((item) => {
      const content = getConteudoById(item.contentId);
      return !content || !canConteudoAppearInHomeHighlights(content, editorias, autores, fontes);
    }),
    [items, getConteudoById, editorias, autores, fontes],
  );

  const slotSummary = useMemo(() => {
    return highlightTypeOptions.map((item) => ({
      label: item.label,
      count: items.filter((highlight) => highlight.slotType === item.value).length,
    }));
  }, [items]);

  const editoriaPresence = useMemo(() => {
    const names = new Set<string>();
    items.forEach((item) => {
      const content = getConteudoById(item.contentId);
      const editoria = content ? getEditoriaById(content.editoriaId)?.name : null;
      if (editoria) names.add(editoria);
    });
    return names.size;
  }, [items, getConteudoById, getEditoriaById]);

  const openCreate = () => {
    setEditing(null);
    setForm({ contentId: "", slotType: "Destaque" });
    setDialogOpen(true);
  };

  const openEdit = (item: HomeHighlightEntity) => {
    setEditing(item);
    setForm({ contentId: String(item.contentId), slotType: item.slotType });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.contentId) {
      toast.error("Conteúdo é obrigatório");
      return;
    }

    const selectedContent = getConteudoById(Number(form.contentId));
    if (!selectedContent || !canConteudoAppearInHomeHighlights(selectedContent, editorias, autores, fontes)) {
      toast.error("A home só aceita conteúdos canônicos em status aprovado, agendado ou publicado.");
      return;
    }

    const duplicate = items.find((item) => item.contentId === Number(form.contentId) && item.id !== editing?.id);
    if (duplicate) {
      toast.error("Este conteúdo já está presente na curadoria da home.");
      return;
    }

    const position = editing ? editing.position : items.length + 1;
    upsertHomeHighlight({ position, contentId: Number(form.contentId), slotType: form.slotType }, editing?.id);
    toast.success(editing ? "Destaque atualizado" : "Destaque adicionado");
    setDialogOpen(false);
  };
  const handleDelete = () => {
    if (!deleteTarget) return;
    removeHomeHighlight(deleteTarget.id);
    toast.success("Destaque removido");
    setDeleteTarget(null);
  };

  const moveItem = (id: number, direction: "up" | "down") => {
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const reordered = [...items];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    reordered.forEach((item, orderIndex) => {
      upsertHomeHighlight({ position: orderIndex + 1, contentId: item.contentId, slotType: item.slotType }, item.id);
    });
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Home & Destaques" subtitle="Monte a curadoria local da home a partir da base real de conteúdos">
        <div className="flex gap-2">
          <SecondaryBtn
            onClick={() => toast.info(
              integrityIssues.length === 0
                ? `Curadoria coerente: ${items.length} destaque(s) ativo(s) sobre ${eligibleConteudos.length} conteúdo(s) elegível(is).`
                : `Há ${integrityIssues.length} destaque(s) que precisam ser revisados para manter a home canônica.`,
            )}
            icon={Eye}
          >
            Ver coerência editorial
          </SecondaryBtn>
          <PrimaryBtn onClick={openCreate} icon={Plus}>Novo destaque</PrimaryBtn>
        </div>
      </PageHeader>

      <div className="grid gap-3 md:grid-cols-4">
        {slotSummary.map((item) => (
          <div key={item.label} className="rounded-lg bg-card p-4 shadow-editorial">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-xl font-display text-foreground">{item.count}</p>
          </div>
        ))}
        <div className="rounded-lg bg-card p-4 shadow-editorial">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Editorias presentes</p>
          <p className="mt-1 text-xl font-display text-foreground">{editoriaPresence}</p>
        </div>
        <div className="rounded-lg bg-card p-4 shadow-editorial">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Conteúdos elegíveis</p>
          <p className="mt-1 text-xl font-display text-foreground">{eligibleConteudos.length}</p>
        </div>
        <div className="rounded-lg bg-card p-4 shadow-editorial">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Alertas canônicos</p>
          <p className="mt-1 text-xl font-display text-foreground">{integrityIssues.length}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-card shadow-editorial">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h3 className="text-[13px] font-semibold text-foreground font-ui">Destaques atuais</h3>
          <span className="text-[11px] text-muted-foreground">{items.length} posições ativas</span>
        </div>
        <div className="divide-y divide-border">
          {items.map((item, index) => {
            const content = getConteudoById(item.contentId);
            const editoria = content ? getEditoriaById(content.editoriaId)?.name : "—";
            const isEligible = content ? canConteudoAppearInHomeHighlights(content, editorias, autores, fontes) : false;
            return (
              <div key={item.id} className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-secondary/50">
                <div className="flex flex-col gap-0.5">
                  <button disabled={index === 0} onClick={() => moveItem(item.id, "up")} className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-20">
                    <ChevronUp className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </button>
                  <button disabled={index === items.length - 1} onClick={() => moveItem(item.id, "down")} className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-20">
                    <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </button>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-[13px] font-bold tabular-nums text-primary">{item.position}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-foreground">{content?.title || "Conteúdo não encontrado"}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-[11px] font-medium text-bronze">{editoria}</span>
                    <span className="text-[11px] text-muted-foreground">· {item.slotType}</span>
                    <span className="text-[11px] text-muted-foreground">· {content ? getContentTypeLabel(content.typeKey) : "—"}</span>
                    {content && (
                      <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium", contentStatusStyles[content.status])}>
                        {contentStatusLabels[content.status]}
                      </span>
                    )}
                    {!isEligible && (
                      <span className="text-[10px] font-medium uppercase tracking-wider text-destructive">revisar</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(item)} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                    <Edit className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </button>
                  <button onClick={() => setDeleteTarget(item)} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            );
          })}
          {items.length === 0 && (
            <div className="px-5 py-12 text-center text-[13px] text-muted-foreground">Nenhum destaque configurado.</div>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-ui text-[15px]">{editing ? "Editar destaque" : "Novo destaque"}</DialogTitle>
            <DialogDescription className="text-[13px]">Selecione apenas conteúdos canônicos em status aprovado, agendado ou publicado.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <FormField label="Conteúdo canônico">
              <FormSelect value={form.contentId} onChange={(value) => setForm({ ...form, contentId: value })} options={contentOptions} />
            </FormField>
            <FormField label="Tipo de destaque">
              <FormSelect value={form.slotType} onChange={(value) => setForm({ ...form, slotType: value as HomeHighlightEntity["slotType"] })} options={highlightTypeOptions.map((item) => ({ value: item.value, label: item.label }))} />
            </FormField>
          </div>
          <DialogFooter className="gap-2">
            <button onClick={() => setDialogOpen(false)} className="h-9 rounded-md border border-input bg-card px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-secondary">Cancelar</button>
            <button onClick={handleSave} className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              <Save className="h-3.5 w-3.5" strokeWidth={2} /> {editing ? "Salvar" : "Adicionar"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Remover destaque" description={`Remover "${getConteudoById(deleteTarget?.contentId || 0)?.title || "este conteúdo"}" dos destaques?`} />
    </div>
  );
}


