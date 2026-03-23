# Pendencias Reais Fase 2.4 - Veredito

## Objetivo

Listar objetivamente o que ainda falta para considerar a Fase 2.4 realmente encerrada apos o fechamento da 2.6.

## O que falta para fechar a 2.4

| Prioridade | Item pendente | Motivo |
|---|---|---|
| alta | transformar a base publica em derivacao da base editorial canonica local | hoje o portal usa `public-content.ts` como fonte paralela |
| alta | eliminar duplicidade entre autores do admin e autores publicos | a pagina de autor publica nao nasce do cadastro canonico do admin |
| alta | eliminar duplicidade entre editorias do admin e editorias publicas | a pagina de editoria publica nao nasce do cadastro canonico do admin |
| alta | eliminar duplicidade entre conteudos do nucleo editorial e conteudos publicos | home, listagens e paginas individuais publicas ainda usam colecoes mockadas proprias |
| alta | conectar home publica a uma curadoria derivada da camada editorial local | o modulo de home/destaques do admin ainda nao sustenta o portal nem em nivel mockado |
| media | definir a fronteira canonica entre mock local do admin e mock local do portal | hoje ha duas fontes concorrentes de verdade local |
| media | revisar usuarios, newsletter e configuracoes apenas como modulos estruturais coerentes com a futura integracao | seguem compativeis com 2.4, mas sem impacto real na ponte admin -> portal |

## Dependencias internas

- a base editorial do admin ja precisa ser tratada como fonte unica de entidades
- a camada publica precisa parar de manter colecoes paralelas para conteudo, editoria e autor
- a home publica depende da definicao de qual conjunto de conteudos e destaques e canonico
- a abertura da 2.7 depende de um contrato unico de dados locais antes de qualquer integracao real

## O que precisa ser resolvido antes da 2.7

1. Definir uma fonte unica local para conteudo, autoria, editoria e destaque.
2. Remover a dependencia estrutural de `src/pages/public/public-content.ts` como base primaria paralela.
3. Fazer a camada publica 2.5/2.6 consumir a base editorial canonica, ainda que em mock local.
4. Garantir que home, pagina de autor, pagina de editoria e listagens publicas derivem da mesma base do admin.
5. Revalidar a 2.4 depois dessa unificacao para confirmar que a fase deixou de ser apenas "admin-fechada".

## Ordem recomendada de execucao do fechamento

1. Unificar entidades de editoria, autor e conteudo entre admin e camada publica local.
2. Ligar a home publica e os destaques publicos a essa base unificada.
3. Ligar paginas de autor e editoria publicas a essa mesma base.
4. Revalidar listagens e paginas individuais publicas sem datasets paralelos.
5. Atualizar a documentacao consolidada e so depois abrir a 2.7.

## Conclusao objetiva

A Fase 2.4 **nao deve ser tratada como encerrada para fins de abrir a 2.7**.

Ela esta bem resolvida como camada canonica do admin, mas ainda carece de fechamento estrutural na relacao com a camada publica criada e consolidada em 2.5/2.6.
