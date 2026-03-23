# Checagem Fase 2.4 Pos 2.6 - Veredito

## Objetivo da checagem

Validar tecnicamente e funcionalmente o estado real da Fase 2.4 apos o fechamento da 2.6, confrontando a documentacao consolidada com a implementacao real do admin e da camada publica.

## Escopo auditado

- editorias
- autores
- fontes
- home e destaques
- usuarios como camada estrutural local/mockada
- relacao desses modulos com:
  - formulario de conteudo
  - preview de conteudo
  - listagem de conteudos
  - home publica
  - paginas publicas da 2.5 e 2.6

## Arquivos e documentos lidos

### Documentacao ativa

- `docs/status-implementacao-consolidado.md`
- `docs/roadmap-fase-2-consolidado.md`
- `docs/gaps-para-avancar.md`
- `docs/fase 2.4-canônica.txt`
- `docs/fase-2.4-fechada.md`

### Documentacao complementar

- `C:\projetos\jornal\docs\fase 2.4.txt` se aplicavel como referencia historica de intencao da fase

### Codigo auditado

- `src/pages/admin/editorial-store.tsx`
- `src/pages/admin/EditorialSupportPages.tsx`
- `src/pages/admin/ConteudoFormPage.tsx`
- `src/pages/admin/ConteudoPreviewPage.tsx`
- `src/pages/admin/PlaceholderPages.tsx`
- `src/pages/public/public-content.ts`

## Escopo real da 2.4

A 2.4 deveria consolidar os modulos de apoio editorial do admin como base canonica local/mockada para sustentar o nucleo editorial e preparar o caminho para a camada publica e para a futura integracao da 2.7.

Isso inclui, no minimo:

- editorias como fonte editorial do conteudo
- autores como fonte canonica de autoria do conteudo
- fontes como base de apoio para noticia e decisao
- home e destaques como curadoria local coerente com os conteudos existentes
- usuarios como camada estrutural visual, sem auth real
- reducao de listas duplicadas e hardcodes onde ja existe modulo canonico correspondente

## Checklist da 2.4

| Item | Status | Leitura real |
|---|---|---|
| Editorias no admin | concluido | entidade local canonica existe na store e sustenta conteudo no admin |
| Autores no admin | concluido | entidade local canonica existe na store e sustenta conteudo no admin |
| Fontes no admin | concluido | entidade local canonica existe na store e sustenta noticia e decisao no admin |
| Home e destaques no admin | concluido | modulo usa conteudos reais da store local e aplica elegibilidade canonica |
| Usuarios como camada estrutural | parcial | modulo segue apenas como UI/local, o que e compativel com o escopo, mas sem peso operacional real |
| Conteudo consumindo editorias | concluido | formulario, preview e listagem resolvem editoria pela store local |
| Conteudo consumindo autores | concluido | formulario, preview e listagem resolvem autor pela store local |
| Conteudo consumindo fontes | concluido | noticia e decisao resolvem fonte pela store local |
| Home admin consumindo conteudos reais da store | concluido | destaques usam opcoes construidas a partir do conteudo local elegivel |
| Relacao canonica com 2.5 e 2.6 | parcial | a camada publica continua usando base propria em `public-content.ts`, sem consumir a base canonica do admin |
| Eliminacao de duplicidade relevante para a futura 2.7 | parcial | a duplicidade caiu no admin, mas reaparece forte no front publico |

## O que ja existe de verdade

- store editorial local compartilhada com editorias, autores, fontes, conteudos e home highlights
- validacoes de duplicidade em slugs e siglas para cadastros canonicos do admin
- bloqueio de inativacao contraditoria de entidades ainda ligadas a conteudos
- formulario de conteudo consumindo editorias, autores e fontes da base local do admin
- preview de conteudo resolvendo autoria, editoria e fonte a partir da base local do admin
- listagem de conteudos exibindo metadata a partir da base local do admin
- home/destaques no admin operando sobre conteudos elegiveis da store local

## Verificacao de integracao

| Integracao auditada | Status | Diagnostico |
|---|---|---|
| editorias alimentam o conteudo | concluido | o conteudo usa `editoriaId` e resolve pela store local |
| autores alimentam o conteudo | concluido | o conteudo usa `authorId` e resolve pela store local |
| fontes alimentam noticia e decisao | concluido | o formulario e o preview usam `fonteId` para tipos suportados |
| home/destaques no admin consomem conteudos reais | concluido | o modulo de home usa opcoes derivadas de conteudos elegiveis |
| 2.5 e 2.6 consomem a base canonica do admin | ausente | o front publico opera sobre `mockAuthors`, `mockEditorias` e colecoes proprias em `public-content.ts` |
| existe duplicacao/hardcode onde deveria haver consumo canonico | sim, parcial | a duplicacao saiu do nucleo editorial do admin, mas permanece forte na camada publica |

## Lacunas encontradas

### O que ainda esta quebrado conceitualmente

- a 2.4 foi fechada no admin, mas nao se tornou base canonica da camada publica mockada
- o produto passou a ter duas verdades locais paralelas:
  - a base editorial canonica do admin
  - a base publica mockada em `public-content.ts`

### O que ainda esta inconsistente

- autores publicos nao nascem da base de autores do admin
- editorias publicas nao nascem da base de editorias do admin
- conteudos publicos nao nascem dos conteudos do nucleo editorial/admin
- home publica e secoes editoriais publicas nao nascem da curadoria de home/destaques do admin

### O que ainda depende de hardcode

- `mockAuthors`
- `mockEditorias`
- `mockNoticias`
- `mockDecisoes`
- `mockArtigos`
- `mockOpinioes`
- composicoes de home publica como `homeManchete`, `homeHighlights` e `homeEditorialSections`

### O que ainda esta mockado demais

- a ponte entre admin e portal ainda nao existe nem em nivel local/canonico de frontend
- a home publica continua montada por datasets manuais e nao por curadoria derivada da base editorial canonica

### O que ainda nao virou fonte canonica

- camada publica de autores
- camada publica de editorias
- camada publica de conteudo
- composicao publica da home
- relacao canonica entre cadastros/admin e paginas publicas da 2.5/2.6

## Dependencias ainda abertas

- unificar a base publica com a base editorial local do admin antes da 2.7
- definir qual camada local sera a fonte unica para conteudo, autoria, editoria e destaque
- eliminar a duplicidade entre `editorial-store.tsx` e `public-content.ts`
- fazer a home publica e as paginas publicas dependerem da camada editorial canonica, mesmo que ainda em mock local

## Riscos de avancar sem fechar a 2.4

- a 2.7 nascera sobre duas fontes locais divergentes de conteudo
- qualquer integracao admin -> portal exigira reconciliar slugs, autores, editorias e destaques duplicados
- a pagina de autor, a pagina de editoria e a home publica terao retrabalho para abandonar a base mockada atual
- a integracao real ficara apoiada em contrato publico instavel e nao canonico
- o admin parecera fonte de verdade, mas o portal continuara derivando de outra base, o que enfraquece a leitura da 2.4 como fase encerrada

## Recomendacao final

**2.4 ainda precisa de fechamento.**

Leitura objetiva:

- a 2.4 pode ser considerada fechada apenas no perimetro do admin e do nucleo editorial local
- a 2.4 ainda nao pode ser considerada encerrada para fins de abertura segura da 2.7
- motivo principal: a 2.5 e a 2.6 nao estao apoiadas de forma canonica nessa base; a camada publica continua sustentada por mocks paralelos e duplicados
