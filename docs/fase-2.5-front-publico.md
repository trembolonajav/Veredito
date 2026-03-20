# Fase 2.5 — Layout Base do Front Público

Status: **pendente** (após Fase 2.3)
Prioridade: **alta**

---

## Objetivo

Criar a base visual pública do portal Veredito — a parte que o leitor acessa.

---

## Componentes desta fase

### Layout Global

| Componente        | Descrição                                           |
|-------------------|-----------------------------------------------------|
| `PublicLayout`    | Shell com header + footer + outlet                  |
| `PublicHeader`    | Logo, nav principal, busca, menu mobile             |
| `PublicFooter`    | Links, newsletter signup, copyright                 |
| `MobileMenu`     | Drawer/sheet com navegação mobile                   |

### Componentes Editoriais

| Componente            | Descrição                                       |
|-----------------------|-------------------------------------------------|
| `BreakingBar`         | Barra de última hora no topo (opcional)          |
| `HeroPrincipal`       | Manchete principal com imagem grande             |
| `HeroSecundario`      | Grid de destaques secundários                    |
| `CardNoticia`         | Card padrão para notícia (imagem + título + meta)|
| `CardDecisao`         | Card com badge de tribunal e impacto             |
| `CardArtigo`          | Card editorial com lead                          |
| `CardOpiniao`         | Card com avatar do autor e posição               |
| `BlocoNewsletter`     | CTA de inscrição na newsletter                   |
| `BoxAutor`            | Card do autor (bio + artigos recentes)           |
| `LeiaTambem`          | Seção "Leia também" com cards relacionados       |
| `Breadcrumb`          | Navegação hierárquica                            |
| `Paginacao`           | Navegação entre páginas de listagem              |
| `SectionHeader`       | Título de seção com editoria + "ver todas"       |

---

## Rotas públicas

```
/                           → Home
/noticias                   → Listagem de notícias
/decisoes                   → Listagem de decisões
/artigos                    → Listagem de artigos
/opiniao                    → Listagem de opiniões
/editoria/:slug             → Página de editoria
/autor/:slug                → Página do autor
/:tipo/:slug                → Página individual do conteúdo
/busca                      → Busca
/sobre                      → Sobre o Veredito
/contato                    → Contato
/newsletter                 → Página da newsletter
/privacidade                → Política de privacidade
/termos                     → Termos de uso
```

---

## Paleta no front público

A mesma paleta oficial se aplica, mas com ênfase diferente:

- **Ivory** (`--background`): fundo principal das páginas
- **Charcoal** (`--foreground`): texto editorial
- **Deep Navy**: header, CTAs, links de destaque
- **Muted Bronze**: eyebrows de editoria, destaques editoriais
- **Off-White**: cards de conteúdo
- **Soft Mist**: bordas, separadores

---

## Tipografia no front público

- **Instrument Serif**: títulos de matérias, manchetes, nomes de editorias
- **Inter**: corpo de texto, metadados, navegação, botões

Escala de tamanhos para o front:
- Manchete principal: `text-4xl` / `text-5xl`
- Título de matéria: `text-2xl` / `text-3xl`
- Subtítulo: `text-lg`
- Corpo: `text-base` (16px)
- Meta / eyebrow: `text-xs` / `text-sm`

---

## Estrutura de arquivos

```
src/components/public/
  PublicLayout.tsx
  PublicHeader.tsx
  PublicFooter.tsx
  MobileMenu.tsx
  BreakingBar.tsx
  HeroPrincipal.tsx
  HeroSecundario.tsx
  CardNoticia.tsx
  CardDecisao.tsx
  CardArtigo.tsx
  CardOpiniao.tsx
  BlocoNewsletter.tsx
  BoxAutor.tsx
  LeiaTambem.tsx
  SectionHeader.tsx

src/pages/public/
  HomePage.tsx
  NoticiasPage.tsx
  DecisoesPage.tsx
  ArtigosPage.tsx
  OpinioesPage.tsx
  ConteudoPage.tsx        — página individual
  EditoriaPage.tsx
  AutorPage.tsx
  BuscaPage.tsx
  SobrePage.tsx
  ContatoPage.tsx
  NewsletterPage.tsx
  PrivacidadePage.tsx
  TermosPage.tsx
```

---

## Critérios de aceite

- [ ] O front tem identidade visual própria alinhada à marca
- [ ] Header com logo, nav e busca funcional
- [ ] Footer com links e newsletter CTA
- [ ] Cards editoriais consistentes
- [ ] Responsivo: mobile-first
- [ ] Dados mockados mas realistas
- [ ] Sem dependência do admin — funciona standalone
