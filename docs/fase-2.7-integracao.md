# Fase 2.7 — Integração Admin ↔ Portal

Status: **pendente** (requer Lovable Cloud / Supabase)

---

## Objetivo

Conectar o admin ao portal público com dados reais persistidos.

---

## Pré-requisito

Ativar **Lovable Cloud** para obter:
- Banco de dados PostgreSQL
- Autenticação real
- Storage para imagens
- Edge Functions para lógica de servidor

---

## Schema do banco de dados

### Tabelas principais

```sql
-- Editorias
create table editorias (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  active boolean default true,
  created_at timestamptz default now()
);

-- Autores
create table autores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  name text not null,
  slug text unique not null,
  role text not null,
  email text,
  bio text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Fontes
create table fontes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sigla text not null,
  type text not null,
  url text,
  official boolean default true,
  created_at timestamptz default now()
);

-- Conteúdos
create table conteudos (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('noticia', 'decisao', 'artigo', 'opiniao')),
  title text not null,
  subtitle text,
  slug text unique not null,
  editoria_id uuid references editorias(id),
  autor_id uuid references autores(id),
  fonte_id uuid references fontes(id),
  status text not null default 'draft' check (status in ('draft','review','approved','scheduled','published','archived')),
  lead text,
  body text,
  cover_image_url text,
  cover_caption text,
  tags text[],
  meta_title text,
  meta_description text,
  published_at timestamptz,
  scheduled_at timestamptz,
  views integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Campos específicos de decisão
create table conteudo_decisao (
  conteudo_id uuid primary key references conteudos(id) on delete cascade,
  tribunal text,
  processo_numero text,
  relator text,
  data_julgamento date,
  tipo_decisao text,
  tese_fixada text,
  impacto text check (impacto in ('alto', 'medio', 'baixo'))
);

-- Campos específicos de opinião
create table conteudo_opiniao (
  conteudo_id uuid primary key references conteudos(id) on delete cascade,
  posicao text,
  disclaimer text
);

-- Home destaques
create table home_destaques (
  id uuid primary key default gen_random_uuid(),
  conteudo_id uuid references conteudos(id),
  position integer not null,
  type text not null default 'destaque',
  active boolean default true
);

-- Newsletter leads
create table newsletter_leads (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  subscribed_at timestamptz default now(),
  active boolean default true
);

-- User roles (segurança)
create type app_role as enum ('admin', 'editor', 'autor', 'colaborador');

create table user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
```

### RLS policies

Todas as tabelas devem ter RLS habilitado com policies baseadas em `has_role()`.

---

## Etapas de integração

| Etapa   | Descrição                                    |
|---------|----------------------------------------------|
| 2.7.1   | CRUD de conteúdos com Supabase               |
| 2.7.2   | CRUD de editorias, autores, fontes           |
| 2.7.3   | Auth real (login/logout com Supabase Auth)    |
| 2.7.4   | Home destaques persistidos                   |
| 2.7.5   | Listagens públicas com queries reais         |
| 2.7.6   | Página individual por slug                   |
| 2.7.7   | Busca full-text                              |
| 2.7.8   | Newsletter leads                             |

---

## Critérios de aceite

- [ ] Conteúdo criado no admin aparece no portal
- [ ] Home responde aos destaques configurados
- [ ] Auth real funciona (login/logout)
- [ ] RLS protege dados corretamente
- [ ] Fluxo editorial de ponta a ponta
