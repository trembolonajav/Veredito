import React, { useMemo, useState } from "react";
import { ExternalLink, Plus, Save, Star, User } from "lucide-react";
import { Link } from "react-router-dom";
import { currentUserCan } from "@/domain/editorial/selectors";
import { upsertAuthor, useEditorialSnapshot } from "@/domain/editorial/store";
import type { AuthorRecord } from "@/domain/editorial/types";

type AuthorFormState = {
  id: string;
  name: string;
  publicName: string;
  role: string;
  email: string;
  shortBio: string;
  longBio: string;
  slug: string;
  specialty: string;
  jobTitle: string;
  avatarImageId: string;
  socialLinkedin: string;
  socialX: string;
  type: AuthorRecord["type"];
  isPublicPageEnabled: boolean;
};

function toFormState(item?: AuthorRecord): AuthorFormState {
  return {
    id: item?.id ?? "",
    name: item?.name ?? "",
    publicName: item?.publicName ?? "",
    role: item?.role ?? "",
    email: item?.email ?? "",
    shortBio: item?.shortBio ?? "",
    longBio: item?.longBio ?? "",
    slug: item?.slug ?? "",
    specialty: item?.specialty ?? "",
    jobTitle: item?.jobTitle ?? "",
    avatarImageId: item?.avatarImageId ?? "",
    socialLinkedin: item?.socialLinkedin ?? "",
    socialX: item?.socialX ?? "",
    type: item?.type ?? "internal",
    isPublicPageEnabled: item?.isPublicPageEnabled ?? true,
  };
}

function getSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AutoresPage() {
  const snapshot = useEditorialSnapshot();
  const canManageAuthors = currentUserCan("manage_authors", snapshot);
  const items = useMemo(() => [...snapshot.authors].sort((a, b) => a.publicName.localeCompare(b.publicName)), [snapshot.authors]);
  const [selectedId, setSelectedId] = useState<string>(items[0]?.id ?? "");
  const selected = items.find((item) => item.id === selectedId) ?? items[0];
  const [form, setForm] = useState<AuthorFormState>(() => toFormState(selected));

  React.useEffect(() => {
    setForm(toFormState(selected));
    if (selected) setSelectedId(selected.id);
  }, [selected]);

  const handleChange = <K extends keyof AuthorFormState>(key: K, value: AuthorFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSave = () => {
    const nextName = form.name.trim();
    const nextPublicName = form.publicName.trim() || nextName;
    if (!nextName) return;

    upsertAuthor({
      id: form.id || `author-${Date.now()}`,
      name: nextName,
      publicName: nextPublicName,
      role: form.role.trim() || "Autor",
      email: form.email.trim(),
      shortBio: form.shortBio.trim(),
      longBio: form.longBio.trim() || undefined,
      slug: form.slug.trim() || getSlug(nextPublicName),
      specialty: form.specialty.trim() || undefined,
      jobTitle: form.jobTitle.trim() || undefined,
      avatarImageId: form.avatarImageId.trim() || undefined,
      socialLinkedin: form.socialLinkedin.trim() || undefined,
      socialX: form.socialX.trim() || undefined,
      type: form.type,
      isPublicPageEnabled: form.isPublicPageEnabled,
    });
  };

  const handleNew = () => {
    setSelectedId("");
    setForm(toFormState({
      id: `author-${Date.now()}`,
      name: "",
      publicName: "",
      role: "Autor",
      email: "",
      shortBio: "",
      slug: "",
      type: "internal",
      isPublicPageEnabled: true,
    } as AuthorRecord));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-foreground">Autores</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Autores e colunistas com pagina publica real para artigos e opiniao.
          </p>
        </div>
        <button type="button" disabled={!canManageAuthors} onClick={handleNew} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          Novo autor
        </button>
      </div>

      {!canManageAuthors && <div className="rounded-lg border border-border bg-card p-4 text-[12px] text-muted-foreground">Leitura em modo protegido. O papel atual nao pode editar autores.</div>}

      <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="rounded-lg bg-card shadow-editorial overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Autor</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Tipo</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Publico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <tr key={item.id} onClick={() => setSelectedId(item.id)} className={`cursor-pointer transition-colors ${item.id === (selected?.id ?? "") ? "bg-secondary/60" : "hover:bg-secondary/40"}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <User className="h-4 w-4" strokeWidth={1.5} />
                      </div>
                      <div>
                        <span className="text-[13px] font-medium text-foreground flex items-center gap-1.5">
                          {item.publicName}
                          {item.type === "columnist" && <Star className="h-3 w-3 text-bronze" strokeWidth={2} />}
                        </span>
                        <span className="text-[11px] text-muted-foreground">{item.jobTitle || item.role}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-[12px] text-muted-foreground">{item.type}</td>
                  <td className="px-4 py-3">
                    {item.isPublicPageEnabled ? (
                      <Link to={`/autores/${item.slug}`} className="inline-flex items-center gap-1 text-[11px] text-bronze hover:text-bronze/80">
                        ativa <ExternalLink className="h-3 w-3" />
                      </Link>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">inativa</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg bg-card p-6 shadow-editorial space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-semibold text-foreground font-ui">Perfil editorial</h3>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                O que for salvo aqui aparece nas paginas publicas de artigo, opiniao e autor.
              </p>
            </div>
            <button type="button" disabled={!canManageAuthors} onClick={handleSave} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
              <Save className="h-3.5 w-3.5" strokeWidth={2} />
              Salvar
            </button>
          </div>

          <fieldset disabled={!canManageAuthors} className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-[12px] font-medium text-foreground">Nome interno</span>
              <input value={form.name} onChange={(e) => handleChange("name", e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]" />
            </label>
            <label className="space-y-1.5">
              <span className="text-[12px] font-medium text-foreground">Nome publico</span>
              <input value={form.publicName} onChange={(e) => handleChange("publicName", e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]" />
            </label>
            <label className="space-y-1.5">
              <span className="text-[12px] font-medium text-foreground">Slug</span>
              <input value={form.slug} onChange={(e) => handleChange("slug", getSlug(e.target.value))} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]" />
            </label>
            <label className="space-y-1.5">
              <span className="text-[12px] font-medium text-foreground">E-mail</span>
              <input value={form.email} onChange={(e) => handleChange("email", e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]" />
            </label>
            <label className="space-y-1.5">
              <span className="text-[12px] font-medium text-foreground">Cargo</span>
              <input value={form.jobTitle} onChange={(e) => handleChange("jobTitle", e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]" />
            </label>
            <label className="space-y-1.5">
              <span className="text-[12px] font-medium text-foreground">Especialidade</span>
              <input value={form.specialty} onChange={(e) => handleChange("specialty", e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]" />
            </label>
            <label className="space-y-1.5">
              <span className="text-[12px] font-medium text-foreground">Tipo</span>
              <select value={form.type} onChange={(e) => handleChange("type", e.target.value as AuthorRecord["type"])} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]">
                <option value="internal">interno</option>
                <option value="external">externo</option>
                <option value="columnist">colunista</option>
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-[12px] font-medium text-foreground">Funcao editorial</span>
              <input value={form.role} onChange={(e) => handleChange("role", e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]" />
            </label>
            <label className="space-y-1.5">
              <span className="text-[12px] font-medium text-foreground">Avatar</span>
              <input value={form.avatarImageId} onChange={(e) => handleChange("avatarImageId", e.target.value)} placeholder="editorial-documento" className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]" />
            </label>
            <label className="space-y-1.5">
              <span className="text-[12px] font-medium text-foreground">LinkedIn</span>
              <input value={form.socialLinkedin} onChange={(e) => handleChange("socialLinkedin", e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]" />
            </label>
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-[12px] font-medium text-foreground">X / Twitter</span>
              <input value={form.socialX} onChange={(e) => handleChange("socialX", e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]" />
            </label>
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-[12px] font-medium text-foreground">Bio curta</span>
              <textarea value={form.shortBio} onChange={(e) => handleChange("shortBio", e.target.value)} rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-[13px]" />
            </label>
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-[12px] font-medium text-foreground">Bio longa</span>
              <textarea value={form.longBio} onChange={(e) => handleChange("longBio", e.target.value)} rows={4} className="w-full rounded-md border border-input bg-background px-3 py-2 text-[13px]" />
            </label>
          </fieldset>

          <fieldset disabled={!canManageAuthors}><label className="flex items-center justify-between rounded-md border border-border px-4 py-3">
            <span className="text-[13px] text-foreground">Pagina publica ativa</span>
            <input type="checkbox" checked={form.isPublicPageEnabled} onChange={(e) => handleChange("isPublicPageEnabled", e.target.checked)} />
          </label></fieldset>
        </div>
      </div>
    </div>
  );
}
