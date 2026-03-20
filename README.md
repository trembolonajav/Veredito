# Veredito

Aplicação frontend do portal Veredito, com área pública editorial e painel administrativo.

## Stack

- React 18
- TypeScript
- Vite 5
- Tailwind CSS
- shadcn/ui
- React Router
- TanStack Query

## Requisitos

- Node.js 18+
- npm 9+

## Instalação

```bash
npm install
```

## Desenvolvimento

Subir o projeto em modo local:

```bash
npm run dev
```

Subir em porta específica:

```bash
npm run dev -- --host 127.0.0.1 --port 4174 --strictPort
```

## Rotas principais

### Área pública

- `/`
- `/noticias`
- `/decisoes`
- `/artigos`
- `/opiniao`
- `/editoria/:slug`
- `/:tipo/:slug`
- `/busca`
- `/sobre`
- `/contato`
- `/newsletter`
- `/privacidade`
- `/termos`

### Área administrativa

- `/login`
- `/admin`
- `/admin/conteudos`
- `/admin/conteudos/tipo`
- `/admin/conteudos/novo`
- `/admin/conteudos/:id/editar`
- `/admin/conteudos/:id/preview`
- `/admin/editorias`
- `/admin/autores`
- `/admin/fontes`
- `/admin/home-destaques`
- `/admin/newsletter`
- `/admin/usuarios`
- `/admin/configuracoes`

## Estado atual

- Frontend público implementado com home, listagens e páginas institucionais
- Painel administrativo implementado com dashboard e fluxo de criação/edição de conteúdo
- Login administrativo ainda demonstrativo no frontend
- Estrutura de conteúdo e navegação prontas para integração com backend/API

## Scripts

```bash
npm run dev
npm run build
npm run build:dev
npm run lint
npm run test
```

## Estrutura principal

- `src/pages/public`: páginas da área pública
- `src/pages/admin`: páginas do painel administrativo
- `src/components/public`: layout e componentes públicos
- `src/components/admin`: layout e componentes administrativos
- `docs`: documentação funcional e de implementação
