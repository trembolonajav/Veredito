# Fase 2.7 Fechada - Veredito

Status: ativa  
Fase: 2.7 encerrada

## Objetivo da fase

Conectar de forma real a base editorial do admin ao front público dentro do próprio projeto, eliminando a massa pública paralela e fazendo o portal consumir a mesma fonte local canônica do núcleo editorial.

## Escopo implementado

- integração real entre store editorial do admin e rotas públicas
- unificação da fonte local de conteúdos, editorias, autores, fontes e destaques
- substituição da base paralela de `public-content.ts` por seletores derivados da store editorial
- aplicação de regra pública de publicação
- integração da home pública com a curadoria de `homeHighlights`
- integração de editorias, autores e fontes nas páginas públicas principais
- remoção do provider duplicado no shell admin para manter uma única store compartilhada

## Fonte canônica adotada

- `EditorialStoreProvider` no nível da aplicação
- store editorial local compartilhada entre admin e front público
- `src/pages/public/public-content.ts` passou a funcionar como camada de derivação pública da store do admin, e não mais como massa mockada paralela

## O que passou a alimentar o front público

- conteúdos publicados do admin
- editorias ativas com conteúdo publicado
- autores ativos com conteúdo publicado
- fontes vinculadas a notícia e decisão quando aplicável
- curadoria da home baseada em `homeHighlights`

## Regra de publicação adotada

- apenas conteúdos com status `published` aparecem no portal público
- conteúdos em `draft`, `review`, `adjustments`, `approved`, `scheduled` e `archived` permanecem fora da camada pública final

## Home e curadoria

- a home pública passou a derivar manchete e destaques da curadoria definida no admin
- quando a curadoria não fecha uma composição completa, o front usa fallback a partir dos próprios conteúdos publicados da mesma base canônica

## Entidades integradas

- conteúdos
- editorias
- autores
- fontes
- home/destaques

## O que ficou fora do escopo

- backend real externo
- banco real
- integração com API externa
- autenticação real
- permissões reais
- upload real
- newsletter com envio real
- SEO técnico final da 2.8
- automação editorial real
- analytics e integrações externas

## Arquivos impactados

- `src/App.tsx`
- `src/components/admin/AdminLayout.tsx`
- `src/components/public/PublicHeader.tsx`
- `src/components/public/PublicFooter.tsx`
- `src/components/public/PublicEditorial.tsx`
- `src/pages/public/public-content.ts`
- `src/pages/public/HomePage.tsx`
- `src/pages/public/PublicPages.tsx`

## Validação com build

- `npm run build` concluído com sucesso no projeto real

## Conclusão da fase

A Fase 2.7 pode ser considerada encerrada. O front público agora consome a base editorial correta do admin dentro do projeto atual, deixando a 2.8 livre para acabamento, SEO e refinamentos finais.
