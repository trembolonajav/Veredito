# Auditoria Fase 2.3 - Veredito

## Objetivo da auditoria

Auditar tecnicamente e funcionalmente a Fase 2.3 do projeto Veredito, comparando documentacao e implementacao real do nucleo editorial do admin.

## Escopo auditado

- listagem de conteudos
- selecao de tipo
- formularios de noticia, decisao, artigo e opiniao
- preview/detalhe de conteudo
- workflow editorial mockado
- consistencia entre listagem, formulario e preview
- base local/mockada que sustenta o nucleo editorial

## Arquivos e documentos lidos

### Documentacao ativa

- `docs/status-implementacao-consolidado.md`
- `docs/roadmap-fase-2-consolidado.md`
- `docs/gaps-para-avancar.md`
- `docs/fase-2.3-nucleo-editorial.md`

### Documentacao complementar historica

- `C:\projetos\jornal\docs\fase 2.3.1.txt`
- `C:\projetos\jornal\docs\fase 2.3.2.txt`
- `C:\projetos\jornal\docs\fase 2.3.3.txt`
- `C:\projetos\jornal\docs\fase 2.3.4.txt`
- `C:\projetos\jornal\docs\fase 2.3.5.txt`
- `C:\projetos\jornal\docs\fase 2.3.6.txt`
- `C:\projetos\jornal\docs\fase 2.3.7.txt`
- `C:\projetos\jornal\docs\fase 2.3.8.txt`
- `C:\projetos\jornal\docs\fase 2.3.9.txt`
- `C:\projetos\jornal\docs\fase 2.3.10.txt`

### Codigo auditado

- `src/App.tsx`
- `src/components/admin/AdminLayout.tsx`
- `src/pages/admin/ConteudoNovoTipoPage.tsx`
- `src/pages/admin/ConteudoFormPage.tsx`
- `src/pages/admin/ConteudoPreviewPage.tsx`
- `src/pages/admin/EditorialSupportPages.tsx`
- `src/pages/admin/editorial-store.tsx`
- `src/pages/admin/PlaceholderPages.tsx`

## Escopo real da 2.3

A documentacao consolidada e o codigo convergem em um nucleo editorial com estes blocos:

- listagem de conteudos
- selecao do tipo editorial
- formularios por tipo
- preview de conteudo
- workflow editorial mockado
- status editoriais
- base local/mockada minima para o modulo de Conteudos

## Checklist da 2.3

| Item | Status | Leitura real |
|---|---|---|
| 2.3.1 Listagem de conteudos | parcial | tabela, busca, filtros basicos e contagem existem; fluxo de preview a partir da listagem nao existe |
| 2.3.2 Selecao de tipo | concluido | tela dedicada com 4 tipos e navegacao para o formulario real |
| 2.3.3 Formulario de noticia | parcial | formulario real existe, mas ainda sem fechamento completo do fluxo e sem campo explicito de data de publicacao |
| 2.3.4 Formulario de decisao | parcial | campos juridicos principais existem; fechamento operacional ainda e incompleto |
| 2.3.5 Formulario de artigo | parcial | formulario existe, mas sem varios campos historicamente planejados |
| 2.3.6 Formulario de opiniao | parcial | formulario existe, mas sem fechamento operacional com preview e listagem |
| 2.3.7 Preview de conteudo | parcial | tela existe e le a base local; nao e acessivel pela listagem e nao concentra operacao editorial |
| 2.3.8 Workflow editorial mockado | parcial | transicoes de status existem no formulario; nao ha consolidacao no preview nem modelo operacional unico |
| 2.3.9 Historico editorial mockado | ausente | nao existe timeline/historico no projeto atual |
| 2.3.10 Notas editoriais mockadas | ausente | nao existe bloco de notas/observacoes no projeto atual |

## Verificacao funcional

| Fluxo | Status | Diagnostico |
|---|---|---|
| listagem -> abrir preview | ausente | a listagem nao possui acao de visualizar nem titulo clicavel para `/preview` |
| listagem -> editar item | parcial | existe edicao rapida em modal; nao abre o editor principal da 2.3 |
| preview -> voltar para listagem | concluido | existe botao de retorno |
| preview -> editar conteudo | concluido | existe botao para voltar ao editor |
| preview -> workflow mockado | ausente | preview nao exibe status operacional, acoes editoriais, checklist, timeline ou notas |
| workflow -> refletir na listagem | parcial | mudancas feitas no formulario atualizam a store local e voltam para a listagem; o fluxo nao parte do preview |
| workflow -> refletir no preview | parcial | o conteudo atualizado e lido pelo preview, mas o preview nao mostra status nem etapa editorial |
| formularios -> coerencia com o tipo | parcial | o editor principal respeita o tipo; a edicao rapida da listagem permite trocar tipo sem cobrir campos especificos |

## O que ja existe de verdade

- rota real de listagem de conteudos
- rota real de selecao de tipo
- rota real de formulario unificado
- rota real de preview
- estado local compartilhado do modulo editorial no admin
- badges e transicoes de status no editor principal
- campos especificos para decisao, artigo e opiniao
- leitura de editoria, autor e fonte a partir da base local atual

## O que esta so parcialmente implementado

- listagem como centro operacional do modulo
- preview como camada real de conferencia e operacao
- workflow editorial como fluxo unico entre listagem, preview e formulario
- coerencia completa entre edicao rapida da listagem e editor principal
- cobertura total dos campos planejados por tipo
- consistencia documental entre o que os docs historicos afirmam e o que o codigo realmente entrega hoje

## O que esta faltando na 2.3

- acao real de preview saindo da listagem
- acao real de preview saindo do editor
- centro operacional do workflow no preview
- bloco de checklist editorial no preview
- historico/timeline editorial
- notas editoriais
- regra unica e explicitada de transicoes editoriais
- fechamento entre edicao rapida e editor principal
- fechamento completo dos campos historicamente planejados para artigo e opiniao
- fechamento do fluxo como modulo editorial coerente, nao apenas como telas conectadas por store local

## Inconsistencias encontradas

### Entre listagem e preview

- o preview possui rota, mas a listagem nao o abre
- a documentacao historica de 2.3.7 afirma integracao listagem -> preview; o codigo atual nao confirma isso

### Entre listagem e formulario

- a listagem usa uma edicao rapida em modal, enquanto a fase 2.3 foi desenhada com editor principal em pagina dedicada
- o modal permite alterar `typeKey`, `status`, `editoria` e `autor`, mas nao expande os campos especificos por tipo

### Entre formulario e preview

- o formulario possui workflow mockado e status operacional; o preview nao exibe esse estado
- o preview nao mostra SEO, checklist, bloco operacional, timeline ou notas que os docs historicos atribuem a ele

### Entre docs e codigo

- docs historicos de 2.3.7, 2.3.8, 2.3.9 e 2.3.10 descrevem um preview muito mais operacional do que o implementado hoje
- docs historicos de 2.3.1 descrevem acao de visualizar na listagem; o codigo atual nao a entrega
- a documentacao consolidada acerta ao manter a 2.3 como parcial

## O que esta mockado demais

- toda a store editorial vive apenas em memoria da sessao do admin
- transicoes de status nao possuem log, responsavel, timestamp ou regra operacional formal
- o preview e apenas leitura editorial, nao centro de fluxo
- a edicao rapida da listagem simplifica demais o modelo do conteudo

## O que ainda depende de hardcode ou fragilidade estrutural

- filtros rapidos da listagem cobrem so parte dos status existentes
- preview nao diferencia artigo e opiniao com blocos operacionais proprios alem da leitura basica
- varios comportamentos da 2.3 dependem da store local atual, mas sem camada dedicada de revisao, historico ou notas

## O que ainda nao conversa bem com a futura 2.4

- o preview nao opera como camada de conferencia do conteudo antes da curadoria e do uso canonico de cadastros
- o modal de edicao rapida da listagem contorna o editor principal e enfraquece o modelo editorial
- o workflow ainda nao amarra listagem, editor e preview como um unico circuito operacional

## Riscos de avancar sem fechar a 2.3

- retrabalho na integracao entre listagem, preview e workflow
- duplicacao de regras entre modal de listagem e formulario principal
- curadoria da home apoiada em conteudo ainda sem fluxo editorial consolidado
- dificuldade maior para integrar historico, notas e governanca editorial depois que 2.4/2.5 avancam
- aumento do acoplamento em cima de um preview que ainda nao representa o centro operacional prometido

## Recomendacao final

**2.3 ainda precisa de fechamento**.

Motivo objetivo:

- o nucleo editorial existe, mas nao esta fechado como fluxo coerente
- preview, workflow, listagem e edicao ainda nao operam como uma unica camada editorial
- historico e notas continuam ausentes
- a listagem nao entrega o fluxo de preview descrito na documentacao historica
