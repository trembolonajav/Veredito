import React, { useMemo, useState } from "react";
import { Plus, Save, Shield } from "lucide-react";
import { getAdminUsers, getCurrentAdminUser, getPermissionsForRole, getRolePermissions } from "@/domain/editorial/selectors";
import { updateSiteConfig, upsertAdminUser, updateRolePermissions, useEditorialSnapshot } from "@/domain/editorial/store";

const permissionCatalog = [
  { key: "edit_content", label: "Editar conteudo" },
  { key: "submit_review", label: "Enviar para revisao" },
  { key: "legal_review", label: "Revisao juridica" },
  { key: "approve", label: "Aprovar" },
  { key: "publish", label: "Publicar" },
  { key: "edit_home", label: "Editar home" },
  { key: "manage_editorias", label: "Gerenciar editorias" },
  { key: "manage_sources", label: "Gerenciar fontes" },
  { key: "manage_settings", label: "Gerenciar configuracoes" },
  { key: "manage_users", label: "Gerenciar usuarios" },
  { key: "manage_newsletter", label: "Operar newsletter" },
];

const roleOptions = [
  "admin",
  "editor-chefe",
  "editor",
  "revisor_juridico",
  "autor",
  "colunista",
  "operador_newsletter",
];

export default function UsuariosPage() {
  const snapshot = useEditorialSnapshot();
  const canManageUsers = getPermissionsForRole(getCurrentAdminUser(snapshot)?.role || "", snapshot).includes("manage_users");
  const users = useMemo(() => getAdminUsers(snapshot), [snapshot]);
  const permissionsByRole = useMemo(
    () => new Map(getRolePermissions(snapshot).map((item) => [item.role, item.permissions])),
    [snapshot]
  );
  const currentUser = getCurrentAdminUser(snapshot);
  const [selectedRole, setSelectedRole] = useState<string>(getRolePermissions(snapshot)[0]?.role ?? "editor");
  const [newUser, setNewUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "editor",
    status: "active" as "active" | "inactive",
  });

  const handleTogglePermission = (permission: string) => {
    const current = permissionsByRole.get(selectedRole) ?? [];
    const next = current.includes(permission)
      ? current.filter((item) => item !== permission)
      : [...current, permission];
    updateRolePermissions(selectedRole, next);
  };

  const handleSaveUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) return;
    upsertAdminUser({
      id: newUser.id || `user-${Date.now()}`,
      name: newUser.name.trim(),
      email: newUser.email.trim(),
      role: newUser.role,
      status: newUser.status,
    });
    setNewUser({ id: "", name: "", email: "", role: "editor", status: "active" });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl text-foreground">Usuarios e permissoes</h2>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          Matriz inicial de papeis para workflow, home e governanca editorial.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="rounded-lg bg-card shadow-editorial overflow-hidden">
          <div className="border-b border-border px-5 py-3.5">
            <h3 className="text-[14px] font-semibold text-foreground">Usuarios do painel</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Usuario</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Papel</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((item) => (
                <tr key={item.id} className="hover:bg-secondary/40 transition-colors">
                  <td className="px-5 py-3">
                    <div>
                      <p className="text-[13px] font-medium text-foreground">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground">{item.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-muted-foreground">{item.role}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] ${item.status === "active" ? "bg-status-published/10 text-status-published" : "bg-muted text-muted-foreground"}`}>
                      {item.status === "active" ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-5">
          <div className="rounded-lg bg-card p-5 shadow-editorial space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" strokeWidth={1.5} />
              <h3 className="text-[14px] font-semibold text-foreground">Operador atual</h3>
            </div>
            <select
              value={currentUser?.id || ""}
              onChange={(e) => updateSiteConfig({ currentAdminUserId: e.target.value })}
              disabled={!canManageUsers}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.name} · {user.role}</option>
              ))}
            </select>
          </div>

          <div className="rounded-lg bg-card p-5 shadow-editorial space-y-4">
            {!canManageUsers && <p className="text-[12px] text-muted-foreground">Somente administradores podem alterar operador atual, usuarios e permissoes.</p>}
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" strokeWidth={1.5} />
              <h3 className="text-[14px] font-semibold text-foreground">Matriz por papel</h3>
            </div>
            <select disabled={!canManageUsers} value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px] disabled:opacity-50">
              {roleOptions.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <div className="grid gap-2">
              {permissionCatalog.map((permission) => {
                const checked = getPermissionsForRole(selectedRole, snapshot).includes(permission.key);
                return (
                  <label key={permission.key} className="flex items-center justify-between rounded-md border border-border px-4 py-2.5">
                    <span className="text-[13px] text-foreground">{permission.label}</span>
                    <input type="checkbox" disabled={!canManageUsers} checked={checked} onChange={() => handleTogglePermission(permission.key)} />
                  </label>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg bg-card p-5 shadow-editorial space-y-4">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-primary" strokeWidth={1.5} />
              <h3 className="text-[14px] font-semibold text-foreground">Novo usuario</h3>
            </div>
            <input disabled={!canManageUsers} value={newUser.name} onChange={(e) => setNewUser((current) => ({ ...current, name: e.target.value }))} placeholder="Nome" className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]" />
            <input disabled={!canManageUsers} value={newUser.email} onChange={(e) => setNewUser((current) => ({ ...current, email: e.target.value }))} placeholder="email@veredito.com" className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]" />
            <div className="grid gap-3 md:grid-cols-2">
              <select disabled={!canManageUsers} value={newUser.role} onChange={(e) => setNewUser((current) => ({ ...current, role: e.target.value }))} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]">
                {roleOptions.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <select disabled={!canManageUsers} value={newUser.status} onChange={(e) => setNewUser((current) => ({ ...current, status: e.target.value as "active" | "inactive" }))} className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]">
                <option value="active">ativo</option>
                <option value="inactive">inativo</option>
              </select>
            </div>
            <button type="button" disabled={!canManageUsers} onClick={handleSaveUser} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
              <Save className="h-3.5 w-3.5" strokeWidth={2} />
              Salvar usuario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
