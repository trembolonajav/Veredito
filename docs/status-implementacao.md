# Status de Implementação — Veredito

Última atualização: 20 mar 2026

---

## Visão geral

| Fase   | Nome                        | Status        |
|--------|-----------------------------|---------------|
| 2.1    | Fundação visual             | ✅ Completa   |
| 2.2    | Layout base do admin        | ✅ Completa   |
| 2.3    | Núcleo editorial            | 🔄 Em progresso |
| 2.4    | Cadastros e operação        | ✅ Completa   |
| 2.5    | Layout base front público   | ⬚ Pendente   |
| 2.6    | Páginas públicas            | ⬚ Pendente   |
| 2.7    | Integração admin ↔ portal   | ⬚ Pendente   |
| 2.8    | Refinamento e SEO           | ⬚ Pendente   |

---

## Detalhamento

### Fase 2.1 — Fundação ✅
- [x] Design tokens (CSS custom properties)
- [x] Paleta oficial implementada em HSL
- [x] Tipografia (Instrument Serif + Inter)
- [x] Componentes base (Button, Input, Select, Card, Table, Dialog, Badge)
- [x] Ícones padronizados (lucide-react, strokeWidth 1.5)
- [x] Estados de status com cores e dots
- [x] Sombras editoriais (3 níveis)
- [x] Dark mode tokens

### Fase 2.2 — Layout Admin ✅
- [x] Login com banner lateral oficial
- [x] Sidebar Deep Navy com navegação completa
- [x] Topbar com busca e notificações
- [x] Dashboard com métricas e atividade recente
- [x] Responsividade básica
- [x] Botão de logout

### Fase 2.3 — Núcleo Editorial 🔄
- [x] Listagem de conteúdos com filtros e busca
- [x] CRUD básico via modal
- [x] Seletor de autor (puxa de cadastro)
- [ ] **Tela de escolha do tipo** (Notícia/Decisão/Artigo/Opinião)
- [ ] **Formulários específicos por tipo** com campos dedicados
- [ ] **Layout split** (conteúdo + sidebar de status)
- [ ] **Preview editorial** do conteúdo
- [ ] **Fluxo de status** (rascunho → revisão → aprovação → publicação)

### Fase 2.4 — Cadastros ✅
- [x] Editorias — CRUD completo com cards
- [x] Autores — CRUD com tabela e papéis
- [x] Fontes — CRUD com tribunais e órgãos
- [x] Home & Destaques — Reordenação e gestão de slots
- [x] Usuários — CRUD com papéis e status
- [x] Newsletter — Métricas e histórico de envios
- [x] Configurações — Seções com formulários

### Fases 2.5–2.8 — Pendentes
Ver documentação individual de cada fase.
