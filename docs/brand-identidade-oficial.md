# Brand — Identidade Oficial do Veredito

Status: **ativo**
Escopo: fonte de verdade oficial da marca

---

## 1. Conceito da Marca

O Veredito é uma marca editorial jurídica de linha **premium sóbria**.

### A marca deve comunicar:
- Autoridade jurídica
- Sofisticação editorial
- Sobriedade institucional
- Clareza visual
- Refinamento contemporâneo
- Premium discreto
- Jornalismo jurídico técnico

### A marca NÃO deve comunicar:
- Luxo espalhafatoso
- Dourado brilhante ou metálico fake
- Simbolismo jurídico excessivo (balanças, martelos decorativos)
- Barroquismo visual
- Boilerplate corporativo genérico
- Visual SaaS sem assinatura

---

## 2. Paleta Oficial

### Core Palette

| Nome         | Hex       | HSL                    | Uso principal                              |
|--------------|-----------|------------------------|--------------------------------------------|
| Deep Navy    | `#1D334B` | `212 43% 20%`         | Navegação, CTAs, sidebar, contraste nobre  |
| Muted Bronze | `#7A5432` | `28 41% 34%`          | Acentos editoriais, eyebrows, destaques    |
| Off-White    | `#F7F3EC` | `38 42% 95%`          | Cards, fundos secundários, tabelas         |
| Ivory        | `#FFFDF9` | `40 100% 99%`         | Fundo principal, áreas de leitura          |
| Charcoal     | `#121B26` | `212 38% 11%`         | Texto principal, tipografia escura         |
| Soft Mist    | `#DDD5C7` | `34 24% 82%`          | Bordas, divisores, inputs, linhas de tabela|

### Regras de aplicação cromática

- **Deep Navy** substitui preto puro como base nobre.
- **Muted Bronze** substitui dourado chamativo — acento editorial discreto.
- **Off-White + Ivory** dominam fundos, superfícies e áreas de leitura.
- **Charcoal** é o escuro tipográfico principal.
- **Soft Mist** sustenta bordas, divisores e superfícies silenciosas.

### Cores de Status (admin)

| Status     | HSL               | Uso                        |
|------------|-------------------|----------------------------|
| Draft      | `212 20% 50%`    | Rascunhos                  |
| Review     | `35 90% 50%`     | Em revisão                 |
| Approved   | `160 60% 40%`    | Aprovados                  |
| Scheduled  | `212 55% 50%`    | Agendados                  |
| Published  | `160 70% 35%`    | Publicados                 |
| Archived   | `212 10% 65%`    | Arquivados                 |

### Sidebar (Deep Navy tones)

| Token                      | HSL               |
|----------------------------|--------------------|
| `--sidebar-background`     | `212 43% 20%`     |
| `--sidebar-foreground`     | `38 42% 95%`      |
| `--sidebar-accent`         | `212 40% 25%`     |
| `--sidebar-border`         | `212 35% 28%`     |
| `--sidebar-primary`        | `28 41% 34%`      |

---

## 3. Tipografia

| Família             | Variável CSS       | Uso                                         |
|---------------------|--------------------|----------------------------------------------|
| Instrument Serif    | `--font-display`   | Headings editoriais, títulos institucionais  |
| Inter               | `--font-ui`        | Interface, formulários, tabelas, navegação   |

### Regras:
- `h1`–`h6` usam `font-display` com `letter-spacing: -0.02em`
- Body usa `font-ui` (Inter)
- Tamanhos de texto no admin: `11px`, `12px`, `13px`, `15px` (escala reduzida editorial)
- Não trocar essa combinação sem decisão explícita

---

## 4. Ícones

- **Biblioteca**: `lucide-react` (exclusiva)
- **Espessura padrão**: `strokeWidth={1.5}`
- **Tamanhos padrão**: `h-3.5 w-3.5` (inline), `h-4 w-4` (botões), `h-5 w-5` (cards/nav)
- **Cor padrão**: `text-muted-foreground` (idle), `text-foreground` (hover/active)

### Ícones em uso no admin:

| Contexto          | Ícone               | Import                |
|-------------------|----------------------|-----------------------|
| Dashboard         | `LayoutDashboard`    | lucide-react          |
| Conteúdos         | `FileText`           | lucide-react          |
| Editorias         | `Layers`             | lucide-react          |
| Autores           | `Users`              | lucide-react          |
| Fontes            | `Link2`              | lucide-react          |
| Home/Destaques    | `LayoutGrid`         | lucide-react          |
| Newsletter        | `Mail`               | lucide-react          |
| Usuários          | `UserCog`            | lucide-react          |
| Configurações     | `Settings`           | lucide-react          |
| Sair              | `LogOut`             | lucide-react          |
| Busca             | `Search`             | lucide-react          |
| Notificações      | `Bell`               | lucide-react          |
| Novo              | `Plus`               | lucide-react          |
| Editar            | `Edit`               | lucide-react          |
| Excluir           | `Trash2`             | lucide-react          |
| Salvar            | `Save`               | lucide-react          |
| Voltar            | `ArrowLeft`          | lucide-react          |
| Olho (senha)      | `Eye` / `EyeOff`    | lucide-react          |
| Mais ações        | `MoreHorizontal`     | lucide-react          |
| Mover             | `ChevronUp/Down`     | lucide-react          |
| Enviar            | `Send`               | lucide-react          |
| Download          | `Download`           | lucide-react          |

### Regra: não misturar lucide-react com outra biblioteca de ícones.

---

## 5. Assets Oficiais

### Origem (referência primária):
- `src/assets/logo_principal.png` — Logo principal
- `src/assets/banner_lateral_login.png` — Banner da tela de login
- `public/brand/favicon-png.png` — Favicon

### Aplicação no código:
- Logo na sidebar: `h-12`, `brightness-0 invert opacity-90`
- Logo no login (desktop): `h-24`, `brightness-0 invert opacity-90`
- Logo no login (mobile): `h-20`
- Banner: `background-image` com `background-size: cover`

### Regra:
Não redesenhar, simplificar ou reinterpretar assets sem decisão explícita.

---

## 6. Elevação e Sombras

| Token               | Valor                                                                  |
|----------------------|------------------------------------------------------------------------|
| `--shadow-sm`        | `0 1px 2px 0 rgba(29, 51, 75, 0.04)`                                 |
| `--shadow-md`        | `0 0 0 1px rgba(29,51,75,0.04), 0 2px 4px rgba(29,51,75,0.06)`       |
| `--shadow-lg`        | `...0 12px 24px rgba(29,51,75,0.06)`                                  |

Classes utilitárias: `shadow-editorial-sm`, `shadow-editorial`, `shadow-editorial-lg`

---

## 7. Componentes Base do Design System

Todos devem usar tokens semânticos. Nunca `text-white`, `bg-black` etc. direto.

| Componente       | Arquivo                          | Status  |
|------------------|----------------------------------|---------|
| Button (primary) | Inline helpers em PlaceholderPages| ✅      |
| Button (secondary)| Inline helpers                  | ✅      |
| Input            | FormInput helper                 | ✅      |
| Textarea         | FormTextarea helper              | ✅      |
| Select           | FormSelect helper                | ✅      |
| Card             | Inline (bg-card + shadow-editorial)| ✅    |
| Badge/Status     | statusStyles + statusLabels      | ✅      |
| Table            | Inline pattern                   | ✅      |
| Dialog/Modal     | shadcn Dialog                    | ✅      |
| ConfirmDialog    | Custom helper                    | ✅      |
| DropdownActions  | Custom helper                    | ✅      |
| PageHeader       | Custom helper                    | ✅      |
| EmptyState       | Inline (colSpan message)         | ✅      |

---

## 8. Regras Críticas

1. A paleta oficial NÃO pode ser substituída por conveniência técnica
2. Assets NÃO podem ser reinterpretados
3. Toda cor deve vir de tokens CSS (`hsl(var(--...))`)
4. Mudanças de cor devem ser por camada cromática, nunca por refactor estrutural
5. O layout premium atual é base obrigatória — não rebaixar
6. Não usar preto puro (`#000`) como base
7. Não usar cinzas genéricos de painel SaaS
8. Não criar logos diferentes por módulo
