# Fase 2.3 — Núcleo Editorial do Admin

Status: **próxima implementação**
Prioridade: **alta** — é a fase mais importante do admin

---

## Objetivo

Permitir criar, listar, editar e revisar conteúdo editorial completo, com formulários específicos por tipo.

---

## Etapas de implementação

### 2.3.1 — Listagem de conteúdos ✅ (já implementado)

- Tabela densa com colunas: Título, Tipo, Editoria, Autor, Status, Data, Views
- Filtros por status (Todos, Rascunho, Revisão, Publicado)
- Busca por título/autor
- Ações: Editar, Excluir
- Contagem de resultados

### 2.3.2 — Tela de escolha do tipo de conteúdo

**Arquivo**: `src/pages/admin/ConteudoNovoPage.tsx`

Ao clicar "Novo conteúdo", o usuário deve ver uma tela (não modal) com 4 cards para escolher o tipo:

| Tipo      | Ícone        | Descrição                              |
|-----------|-------------|----------------------------------------|
| Notícia   | `Newspaper` | Fatos e acontecimentos jurídicos       |
| Decisão   | `Scale`     | Análise de decisões de tribunais       |
| Artigo    | `BookOpen`  | Análise aprofundada sobre temas        |
| Opinião   | `MessageSquare`| Posicionamento editorial            |

Cada card navega para `/admin/conteudos/novo?tipo=noticia` etc.

### 2.3.3 — Formulário de Notícia

**Rota**: `/admin/conteudos/novo?tipo=noticia` e `/admin/conteudos/:id/editar`

Campos:
```
- Título (text, obrigatório)
- Subtítulo (text)
- Editoria (select, obrigatório — puxa de editorias cadastradas)
- Autor (select, obrigatório — puxa de autores cadastrados)
- Fonte (select — puxa de fontes cadastradas)
- Data de publicação (date)
- Imagem de capa (upload placeholder)
- Legenda da imagem (text)
- Lead / Chamada (textarea, max 280 chars)
- Corpo do texto (textarea grande / futuro rich text)
- Tags (text, comma-separated)
- Status (select: rascunho, revisão, aprovado, agendado, publicado)
- SEO: Meta título, Meta descrição
```

Layout: formulário em coluna principal (2/3) + sidebar lateral (1/3) com:
- Status + ações
- Metadados (autor, editoria, fonte)
- SEO
- Imagem de capa

### 2.3.4 — Formulário de Decisão

Campos adicionais em relação à notícia:
```
- Tribunal (select: STF, STJ, TST, CNJ, TRFs, TJs)
- Número do processo (text)
- Relator (text)
- Data do julgamento (date)
- Tipo de decisão (select: Acórdão, Decisão Monocrática, Súmula, Liminar)
- Tese fixada (textarea)
- Impacto (select: Alto, Médio, Baixo)
```

### 2.3.5 — Formulário de Artigo

Campos adicionais:
```
- Tema central (text)
- Palavras-chave acadêmicas (text)
- Referências bibliográficas (textarea)
- Nota de rodapé (textarea)
```

### 2.3.6 — Formulário de Opinião

Campos adicionais:
```
- Posição editorial (select: Favorável, Contrário, Neutro, Análise)
- Disclaimer (textarea — ex: "opinião do autor, não reflete posição editorial")
```

### 2.3.7 — Preview de conteúdo

**Rota**: `/admin/conteudos/:id/preview`

- Renderização do conteúdo como será exibido no portal público
- Layout de página de artigo com tipografia editorial
- Banner de "preview" fixo no topo
- Botão "Voltar ao editor"

### 2.3.8 — Checklist e ações editoriais

Fluxo de status no formulário:

```
Rascunho → Enviar para revisão → Aprovar → Agendar → Publicar
                                         → Arquivar
```

Na sidebar do formulário, mostrar:
- Status atual com badge colorido
- Botões de ação conforme status atual:
  - Rascunho: "Salvar rascunho", "Enviar para revisão"
  - Revisão: "Aprovar", "Devolver ao autor"
  - Aprovado: "Agendar publicação", "Publicar agora"
  - Agendado: "Publicar agora", "Cancelar agendamento"
  - Publicado: "Despublicar", "Arquivar"

---

## Estrutura de arquivos recomendada

```
src/pages/admin/
  ConteudoNovoTipoPage.tsx      — escolha do tipo
  ConteudoFormPage.tsx           — formulário unificado com campos dinâmicos por tipo
  ConteudoPreviewPage.tsx        — preview editorial

src/components/admin/conteudo/
  ConteudoForm.tsx               — form principal
  ConteudoSidebar.tsx            — sidebar com status/ações/meta
  ConteudoFields.tsx             — campos comuns
  ConteudoFieldsNoticia.tsx      — campos específicos de notícia
  ConteudoFieldsDecisao.tsx      — campos específicos de decisão
  ConteudoFieldsArtigo.tsx       — campos específicos de artigo
  ConteudoFieldsOpiniao.tsx      — campos específicos de opinião
  StatusActions.tsx              — botões de ação por status
```

---

## Critérios de aceite

- [ ] Cada tipo de conteúdo tem campos específicos
- [ ] Autores, editorias e fontes são selecionáveis (vêm dos cadastros)
- [ ] O fluxo editorial (rascunho → publicação) funciona
- [ ] Preview renderiza o conteúdo em formato editorial
- [ ] Formulário tem layout split (conteúdo + sidebar)
- [ ] Não quebra nenhuma tela anterior

---

## O que NÃO fazer nesta fase

- Rich text editor completo (usar textarea por enquanto)
- Upload real de imagens (placeholder visual)
- Integração com backend real
- Automações editoriais avançadas
- Analytics de conteúdo
> Status: historico de planejamento
> Este documento nao representa mais o status real da 2.3.
> Fontes ativas:
> - `C:\projetos\jornal\docs\status-implementacao-consolidado.md`
> - `C:\projetos\jornal\docs\roadmap-fase-2-consolidado.md`
