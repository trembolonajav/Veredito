import React, { createContext, useContext, useMemo, useRef, useState } from "react";

export type ContentTypeKey = "noticia" | "decisao" | "artigo" | "opiniao";
export type ContentStatus = "draft" | "review" | "adjustments" | "approved" | "scheduled" | "published" | "archived";
export type EditorialWorkflowActionKey =
  | "save_draft"
  | "send_review"
  | "request_adjustments"
  | "approve"
  | "schedule"
  | "publish_now"
  | "archive"
  | "restore_draft"
  | "back_to_approved";

export type EditorialSectionEntity = {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: "active" | "inactive";
};

export type AuthorEntity = {
  id: number;
  name: string;
  slug: string;
  role: string;
  email: string;
  bio: string;
  status: "active" | "inactive";
  initials: string;
};

export type SourceEntity = {
  id: number;
  name: string;
  sigla: string;
  type: string;
  url: string;
  reliability: "alta" | "media" | "baixa";
  status: "active" | "inactive";
};

export type ContentEntity = {
  id: number;
  title: string;
  typeKey: ContentTypeKey;
  editoriaId: number;
  authorId: number;
  status: ContentStatus;
  dateLabel: string;
  views: number;
  subtitle: string;
  lead: string;
  body: string;
  tags: string[];
  coverCaption: string;
  metaTitle: string;
  metaDesc: string;
  fonteId: number | null;
  tribunal: string;
  processoNumero: string;
  relator: string;
  dataJulgamento: string;
  tipoDecisao: string;
  teseFixada: string;
  impacto: string;
  temaCentral: string;
  referencias: string;
  posicao: string;
  disclaimer: string;
};

export type HomeHighlightEntity = {
  id: number;
  position: number;
  contentId: number;
  slotType: "Manchete" | "Destaque" | "Secundário";
};

export type EditorialHistoryEntry = {
  id: number;
  contentId: number;
  status: ContentStatus;
  actionKey: EditorialWorkflowActionKey | "created";
  actionLabel: string;
  actor: string;
  dateTimeLabel: string;
  note?: string;
};

export type EditorialNoteEntry = {
  id: number;
  contentId: number;
  author: string;
  dateTimeLabel: string;
  text: string;
};

type ContentDraft = Omit<ContentEntity, "id" | "dateLabel" | "views"> & {
  dateLabel?: string;
  views?: number;
};

type UpdateConteudoMeta = {
  workflowAction?: EditorialWorkflowActionKey;
  note?: string;
};

type EditorialStoreValue = {
  editorias: EditorialSectionEntity[];
  autores: AuthorEntity[];
  fontes: SourceEntity[];
  conteudos: ContentEntity[];
  homeHighlights: HomeHighlightEntity[];
  createEditoria: (input: Omit<EditorialSectionEntity, "id">) => number;
  updateEditoria: (id: number, input: Omit<EditorialSectionEntity, "id">) => void;
  removeEditoria: (id: number) => boolean;
  createAutor: (input: Omit<AuthorEntity, "id" | "initials">) => number;
  updateAutor: (id: number, input: Omit<AuthorEntity, "id" | "initials">) => void;
  removeAutor: (id: number) => boolean;
  createFonte: (input: Omit<SourceEntity, "id">) => number;
  updateFonte: (id: number, input: Omit<SourceEntity, "id">) => void;
  removeFonte: (id: number) => boolean;
  createConteudo: (input: ContentDraft, meta?: UpdateConteudoMeta) => number;
  updateConteudo: (id: number, input: Partial<ContentEntity>, meta?: UpdateConteudoMeta) => void;
  removeConteudo: (id: number) => void;
  addEditorialNote: (contentId: number, text: string) => void;
  getHistoryForConteudo: (contentId: number) => EditorialHistoryEntry[];
  getNotesForConteudo: (contentId: number) => EditorialNoteEntry[];
  upsertHomeHighlight: (input: Omit<HomeHighlightEntity, "id">, id?: number) => number;
  removeHomeHighlight: (id: number) => void;
  getEditoriaById: (id: number) => EditorialSectionEntity | undefined;
  getAutorById: (id: number) => AuthorEntity | undefined;
  getFonteById: (id: number | null) => SourceEntity | undefined;
  getConteudoById: (id: number) => ContentEntity | undefined;
};

const EditorialStoreContext = createContext<EditorialStoreValue | null>(null);

const initialEditorias: EditorialSectionEntity[] = [
  { id: 1, name: "Tributário", slug: "tributario", description: "Decisões e análises tributárias", status: "active" },
  { id: 2, name: "Empresarial", slug: "empresarial", description: "Direito corporativo e societário", status: "active" },
  { id: 3, name: "Imobiliário", slug: "imobiliario", description: "Legislação e mercado imobiliário", status: "active" },
  { id: 4, name: "Sucessório", slug: "sucessorio", description: "Herança, inventário e planejamento", status: "active" },
  { id: 5, name: "Trabalhista", slug: "trabalhista", description: "Relações de trabalho e jurisprudência", status: "active" },
  { id: 6, name: "Constitucional", slug: "constitucional", description: "Direito constitucional e garantias", status: "inactive" },
];

const initialAutores: AuthorEntity[] = [
  { id: 1, name: "Ana Beatriz Duarte", slug: "ana-beatriz-duarte", role: "Editora Sênior", email: "ana@veredito.com", bio: "Jornalista especializada em direito tributário e constitucional.", status: "active", initials: "AB" },
  { id: 2, name: "Carlos Mendes", slug: "carlos-mendes", role: "Repórter Jurídico", email: "carlos@veredito.com", bio: "Cobertura diária de regulação e tribunais superiores.", status: "active", initials: "CM" },
  { id: 3, name: "Dra. Fernanda Lima", slug: "fernanda-lima", role: "Colunista", email: "fernanda@veredito.com", bio: "Advogada tributarista e articulista do Veredito.", status: "active", initials: "FL" },
  { id: 4, name: "Prof. Ricardo Alves", slug: "ricardo-alves", role: "Colaborador", email: "ricardo@veredito.com", bio: "Professor e pesquisador de direito sucessório e patrimonial.", status: "active", initials: "RA" },
  { id: 5, name: "Mariana Costa", slug: "mariana-costa", role: "Repórter Jurídico", email: "mariana@veredito.com", bio: "Especialista em cobertura trabalhista e julgados estratégicos.", status: "active", initials: "MC" },
  { id: 6, name: "João Pedro Silva", slug: "joao-pedro-silva", role: "Editor Assistente", email: "joao@veredito.com", bio: "Editor focado em empresarial, tecnologia e compliance.", status: "active", initials: "JP" },
];

const initialFontes: SourceEntity[] = [
  { id: 1, name: "Supremo Tribunal Federal", sigla: "STF", type: "Tribunal Superior", url: "https://stf.jus.br", reliability: "alta", status: "active" },
  { id: 2, name: "Superior Tribunal de Justiça", sigla: "STJ", type: "Tribunal Superior", url: "https://stj.jus.br", reliability: "alta", status: "active" },
  { id: 3, name: "Tribunal Superior do Trabalho", sigla: "TST", type: "Tribunal Superior", url: "https://tst.jus.br", reliability: "alta", status: "active" },
  { id: 4, name: "Conselho Nacional de Justiça", sigla: "CNJ", type: "Órgão Regulador", url: "https://cnj.jus.br", reliability: "alta", status: "active" },
  { id: 5, name: "Receita Federal", sigla: "RFB", type: "Órgão Governamental", url: "https://gov.br/receitafederal", reliability: "alta", status: "active" },
  { id: 6, name: "Diário Oficial da União", sigla: "DOU", type: "Publicação Oficial", url: "https://dou.gov.br", reliability: "media", status: "active" },
];

const initialConteudos: ContentEntity[] = [
  {
    id: 1,
    title: "STF suspende efeitos de lei estadual sobre ICMS",
    typeKey: "decisao",
    editoriaId: 1,
    authorId: 1,
    status: "review",
    dateLabel: "20 mar 2026",
    views: 342,
    subtitle: "Decisão afeta diretamente a arrecadação de 12 estados e abre precedente para novas contestações",
    lead: "O Supremo Tribunal Federal decidiu, por maioria de votos, suspender os efeitos de lei estadual que concedia benefícios fiscais de ICMS sem aprovação do CONFAZ.",
    body: "A decisão, proferida na última sessão plenária, tem efeitos imediatos e impacta diretamente a política fiscal de ao menos 12 unidades federativas.\n\nEspecialistas em direito tributário avaliam que a medida deve reordenar estratégias fiscais e contenciosas nas próximas semanas.",
    tags: ["STF", "ICMS", "CONFAZ", "Tributário"],
    coverCaption: "Plenário do STF durante julgamento sobre guerra fiscal.",
    metaTitle: "STF suspende efeitos de lei estadual sobre ICMS",
    metaDesc: "Análise da decisão do STF que suspendeu lei estadual de benefício fiscal de ICMS sem autorização do CONFAZ.",
    fonteId: 1,
    tribunal: "STF",
    processoNumero: "ADI 7.633/DF",
    relator: "Min. Roberto Barroso",
    dataJulgamento: "2026-03-20",
    tipoDecisao: "Acórdão",
    teseFixada: "É inconstitucional lei estadual que concede benefício fiscal de ICMS sem prévia autorização do CONFAZ.",
    impacto: "alto",
    temaCentral: "",
    referencias: "",
    posicao: "",
    disclaimer: "",
  },
  {
    id: 2,
    title: "Nova regulamentação do mercado imobiliário",
    typeKey: "noticia",
    editoriaId: 3,
    authorId: 2,
    status: "draft",
    dateLabel: "20 mar 2026",
    views: 0,
    subtitle: "Mudança normativa reorganiza práticas de registro e garantias em operações imobiliárias",
    lead: "Nova regulamentação reorganiza etapas de registro, financiamento e formalização de garantias no setor imobiliário.",
    body: "A medida foi recebida com cautela por escritórios especializados, que avaliam impacto direto em contratos e operações de financiamento.\n\nO texto ainda deve gerar ajustes operacionais no mercado nas próximas semanas.",
    tags: ["mercado imobiliário", "regulação"],
    coverCaption: "",
    metaTitle: "Nova regulamentação do mercado imobiliário",
    metaDesc: "Mudanças regulatórias no mercado imobiliário e impacto prático para operações e contratos.",
    fonteId: 6,
    tribunal: "",
    processoNumero: "",
    relator: "",
    dataJulgamento: "",
    tipoDecisao: "",
    teseFixada: "",
    impacto: "",
    temaCentral: "",
    referencias: "",
    posicao: "",
    disclaimer: "",
  },
  {
    id: 3,
    title: "Impacto da reforma tributária nos escritórios",
    typeKey: "artigo",
    editoriaId: 1,
    authorId: 3,
    status: "published",
    dateLabel: "19 mar 2026",
    views: 1284,
    subtitle: "Como a reorganização do sistema tributário muda a prática consultiva e contenciosa",
    lead: "A reforma tributária exige reconfiguração de modelos de atendimento, revisão contratual e novas rotinas de compliance tributário.",
    body: "A reorganização do sistema tributário impõe um novo padrão de leitura para escritórios, departamentos jurídicos e consultorias.\n\nMais do que mudança normativa, trata-se de reposicionamento estratégico do serviço jurídico.",
    tags: ["reforma tributária", "escritórios", "compliance"],
    coverCaption: "",
    metaTitle: "Impacto da reforma tributária nos escritórios",
    metaDesc: "Artigo sobre os efeitos da reforma tributária na operação jurídica de escritórios e consultorias.",
    fonteId: null,
    tribunal: "",
    processoNumero: "",
    relator: "",
    dataJulgamento: "",
    tipoDecisao: "",
    teseFixada: "",
    impacto: "",
    temaCentral: "Reforma tributária e operação jurídica",
    referencias: "Reforma tributária\nIBS e CBS\nModelos de atendimento",
    posicao: "",
    disclaimer: "",
  },
  {
    id: 4,
    title: "O futuro do direito sucessório digital",
    typeKey: "opiniao",
    editoriaId: 4,
    authorId: 4,
    status: "published",
    dateLabel: "19 mar 2026",
    views: 876,
    subtitle: "A sucessão patrimonial precisa alcançar ativos digitais e novas formas de posse",
    lead: "A discussão sobre herança digital deixou de ser periférica e já exige resposta mais clara do direito brasileiro.",
    body: "O patrimônio digital já ocupa espaço real na vida econômica e afetiva das famílias.\n\nIgnorar isso no planejamento sucessório é insistir em um modelo patrimonial incompleto.",
    tags: ["herança digital", "sucessório"],
    coverCaption: "",
    metaTitle: "O futuro do direito sucessório digital",
    metaDesc: "Opinião sobre os desafios do direito sucessório diante da expansão do patrimônio digital.",
    fonteId: null,
    tribunal: "",
    processoNumero: "",
    relator: "",
    dataJulgamento: "",
    tipoDecisao: "",
    teseFixada: "",
    impacto: "",
    temaCentral: "",
    referencias: "",
    posicao: "Análise",
    disclaimer: "As opiniões expressas neste texto são de responsabilidade do autor e não refletem necessariamente a posição editorial do Veredito.",
  },
  {
    id: 5,
    title: "TST define nova súmula sobre trabalho remoto",
    typeKey: "decisao",
    editoriaId: 5,
    authorId: 5,
    status: "scheduled",
    dateLabel: "21 mar 2026",
    views: 0,
    subtitle: "Entendimento orienta tratamento de jornada e controle de disponibilidade no teletrabalho",
    lead: "O Tribunal Superior do Trabalho consolidou novo entendimento sobre jornada flexível e controle de disponibilidade em trabalho remoto.",
    body: "A súmula redefine a leitura prática de disponibilidade digital, tempo à disposição e uso de plataformas corporativas.\n\nO tema deve repercutir na gestão trabalhista de empresas e escritórios.",
    tags: ["TST", "trabalho remoto", "súmula"],
    coverCaption: "",
    metaTitle: "TST define nova súmula sobre trabalho remoto",
    metaDesc: "Decisão do TST consolida novo entendimento sobre jornada e disponibilidade no teletrabalho.",
    fonteId: 3,
    tribunal: "TST",
    processoNumero: "IRR-1000123-98.2024.5.00.0000",
    relator: "Min. Maria Helena Mallmann",
    dataJulgamento: "2026-03-21",
    tipoDecisao: "Súmula",
    teseFixada: "O controle de disponibilidade digital no teletrabalho exige avaliação concreta da efetiva subordinação temporal.",
    impacto: "medio",
    temaCentral: "",
    referencias: "",
    posicao: "",
    disclaimer: "",
  },
  {
    id: 6,
    title: "Análise: compliance nas startups brasileiras",
    typeKey: "artigo",
    editoriaId: 2,
    authorId: 6,
    status: "approved",
    dateLabel: "20 mar 2026",
    views: 0,
    subtitle: "O que muda com a nova pressão regulatória sobre governança e proteção de dados",
    lead: "Startups brasileiras entram em novo ciclo de maturidade regulatória, exigindo revisão de governança e controles internos.",
    body: "O ambiente de inovação não elimina riscos jurídicos; ao contrário, exige controles mais sofisticados à medida que o negócio escala.\n\nCompliance deixa de ser apêndice e passa a ser infraestrutura de crescimento.",
    tags: ["startups", "compliance", "governança"],
    coverCaption: "",
    metaTitle: "Compliance nas startups brasileiras",
    metaDesc: "Artigo sobre governança, regulação e compliance em startups brasileiras.",
    fonteId: null,
    tribunal: "",
    processoNumero: "",
    relator: "",
    dataJulgamento: "",
    tipoDecisao: "",
    teseFixada: "",
    impacto: "",
    temaCentral: "Compliance e crescimento escalável",
    referencias: "LGPD\nGovernança corporativa\nDue diligence",
    posicao: "",
    disclaimer: "",
  },
  {
    id: 7,
    title: "Novo marco legal das garantias entra em vigor",
    typeKey: "noticia",
    editoriaId: 2,
    authorId: 1,
    status: "published",
    dateLabel: "18 mar 2026",
    views: 2105,
    subtitle: "Nova norma busca ampliar acesso ao crédito e reorganizar o uso de garantias privadas",
    lead: "O novo marco legal das garantias entra em vigor com impacto direto em contratos, crédito e recuperação de ativos.",
    body: "Escritórios e empresas já reavaliam cláusulas de garantias e fluxos de formalização contratual.\n\nA expectativa é de aumento de previsibilidade, mas a aplicação prática ainda dependerá de consolidação jurisprudencial.",
    tags: ["garantias", "crédito", "empresarial"],
    coverCaption: "",
    metaTitle: "Novo marco legal das garantias entra em vigor",
    metaDesc: "Notícia sobre a entrada em vigor do novo marco legal das garantias e seus efeitos no crédito.",
    fonteId: 6,
    tribunal: "",
    processoNumero: "",
    relator: "",
    dataJulgamento: "",
    tipoDecisao: "",
    teseFixada: "",
    impacto: "",
    temaCentral: "",
    referencias: "",
    posicao: "",
    disclaimer: "",
  },
];

const initialHomeHighlights: HomeHighlightEntity[] = [
  { id: 1, position: 1, contentId: 1, slotType: "Manchete" },
  { id: 2, position: 2, contentId: 3, slotType: "Destaque" },
  { id: 3, position: 3, contentId: 4, slotType: "Destaque" },
  { id: 4, position: 4, contentId: 7, slotType: "Secundário" },
];

export const contentStatusLabels: Record<ContentStatus, string> = {
  draft: "Rascunho",
  review: "Em revisão",
  adjustments: "Ajustes",
  approved: "Aprovado",
  scheduled: "Agendado",
  published: "Publicado",
  archived: "Arquivado",
};

export const contentStatusStyles: Record<ContentStatus, string> = {
  draft: "bg-status-draft/10 text-status-draft",
  review: "bg-status-review/10 text-status-review",
  adjustments: "bg-amber-500/10 text-amber-700",
  approved: "bg-status-approved/10 text-status-approved",
  scheduled: "bg-status-scheduled/10 text-status-scheduled",
  published: "bg-status-published/10 text-status-published",
  archived: "bg-status-archived/10 text-status-archived",
};

export const editorialStageLabels: Record<ContentStatus, string> = {
  draft: "Redação",
  review: "Mesa de revisão",
  adjustments: "Retorno para ajustes",
  approved: "Pronto para publicação",
  scheduled: "Fila de publicação",
  published: "Conteúdo no ar",
  archived: "Arquivo editorial",
};

export const workflowActionLabels: Record<EditorialWorkflowActionKey, string> = {
  save_draft: "Salvar rascunho",
  send_review: "Enviar para revisão",
  request_adjustments: "Devolver para ajustes",
  approve: "Aprovar conteúdo",
  schedule: "Agendar publicação",
  publish_now: "Publicar agora",
  archive: "Arquivar conteúdo",
  restore_draft: "Restaurar para rascunho",
  back_to_approved: "Voltar para aprovado",
};

const workflowActionToStatus: Record<EditorialWorkflowActionKey, ContentStatus> = {
  save_draft: "draft",
  send_review: "review",
  request_adjustments: "adjustments",
  approve: "approved",
  schedule: "scheduled",
  publish_now: "published",
  archive: "archived",
  restore_draft: "draft",
  back_to_approved: "approved",
};

const workflowTransitions: Record<ContentStatus, EditorialWorkflowActionKey[]> = {
  draft: ["save_draft", "send_review"],
  review: ["request_adjustments", "approve"],
  adjustments: ["save_draft", "send_review"],
  approved: ["schedule", "publish_now", "archive"],
  scheduled: ["publish_now", "back_to_approved", "archive"],
  published: ["archive", "restore_draft"],
  archived: ["restore_draft"],
};

const workflowActors = {
  created: "Redação Veredito",
  save_draft: "Editor de conteúdo",
  send_review: "Editor de conteúdo",
  request_adjustments: "Mesa de revisão",
  approve: "Editor responsável",
  schedule: "Coordenação editorial",
  publish_now: "Coordenação editorial",
  archive: "Coordenação editorial",
  restore_draft: "Editor de conteúdo",
  back_to_approved: "Coordenação editorial",
} as const;

const workflowNotes: Partial<Record<EditorialWorkflowActionKey, string>> = {
  send_review: "Conteúdo encaminhado para conferência editorial.",
  request_adjustments: "Ajustes solicitados antes da publicação.",
  approve: "Conteúdo liberado para publicação.",
  schedule: "Publicação reservada na fila editorial local.",
  publish_now: "Conteúdo disponibilizado no mock editorial.",
  archive: "Conteúdo removido da fila ativa e enviado ao arquivo.",
  restore_draft: "Conteúdo restaurado para nova rodada de edição.",
  back_to_approved: "Agendamento revertido para aprovação final.",
};

export const homeHighlightEligibleStatuses: ContentStatus[] = ["approved", "scheduled", "published"];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatTodayLabel() {
  const now = new Date();
  return `${now.getDate()} ${now.toLocaleString("pt-BR", { month: "short" })} ${now.getFullYear()}`;
}

function formatDateTimeLabel(date = new Date()) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatScheduledLabel() {
  const nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 1);
  return `${nextDay.getDate()} ${nextDay.toLocaleString("pt-BR", { month: "short" })} ${nextDay.getFullYear()}`;
}

function makeHistoryEntry(
  id: number,
  contentId: number,
  status: ContentStatus,
  actionKey: EditorialWorkflowActionKey | "created",
  note?: string,
  date?: Date,
): EditorialHistoryEntry {
  return {
    id,
    contentId,
    status,
    actionKey,
    actionLabel: actionKey === "created" ? "Conteúdo criado" : workflowActionLabels[actionKey],
    actor: workflowActors[actionKey],
    dateTimeLabel: formatDateTimeLabel(date),
    note,
  };
}

function buildInitialHistoryEntries(content: ContentEntity): EditorialHistoryEntry[] {
  const entries: EditorialHistoryEntry[] = [];
  const contentDate = content.status === "published" ? new Date("2026-03-18T09:10:00") : new Date("2026-03-20T09:30:00");
  entries.push(makeHistoryEntry(content.id * 1000 + 1, content.id, "draft", "created", undefined, contentDate));

  if (content.status !== "draft") {
    const secondDate = new Date(contentDate.getTime() + 1000 * 60 * 35);
    const matchingAction = (Object.keys(workflowActionToStatus) as EditorialWorkflowActionKey[]).find(
      (actionKey) => workflowActionToStatus[actionKey] === content.status && actionKey !== "save_draft" && actionKey !== "restore_draft",
    );

    if (matchingAction) {
      entries.push(makeHistoryEntry(content.id * 1000 + 2, content.id, content.status, matchingAction, workflowNotes[matchingAction], secondDate));
    }
  }

  return entries;
}

function buildInitialNotes(): EditorialNoteEntry[] {
  return [
    {
      id: 9101,
      contentId: 1,
      author: "Mesa de revisão",
      dateTimeLabel: "20/03/2026, 11:20",
      text: "Conferir abertura com referência explícita ao impacto federativo antes da aprovação.",
    },
    {
      id: 9102,
      contentId: 5,
      author: "Coordenação editorial",
      dateTimeLabel: "20/03/2026, 14:05",
      text: "Agendamento mantido para a manhã seguinte por causa da janela de destaque trabalhista.",
    },
  ];
}

export function getContentTypeLabel(typeKey: ContentTypeKey) {
  return {
    noticia: "Notícia",
    decisao: "Decisão",
    artigo: "Artigo",
    opiniao: "Opinião",
  }[typeKey];
}

export function getAvailableWorkflowActions(status: ContentStatus) {
  return workflowTransitions[status];
}

export function getWorkflowTargetStatus(action: EditorialWorkflowActionKey) {
  return workflowActionToStatus[action];
}

export function getWorkflowStageLabel(status: ContentStatus) {
  return editorialStageLabels[status];
}

export function isWorkflowActionAllowed(status: ContentStatus, action: EditorialWorkflowActionKey) {
  return workflowTransitions[status].includes(action);
}

export function isContentSourceType(typeKey: ContentTypeKey) {
  return typeKey === "noticia" || typeKey === "decisao";
}

export function EditorialStoreProvider({ children }: { children: React.ReactNode }) {
  const [editorias, setEditorias] = useState(initialEditorias);
  const [autores, setAutores] = useState(initialAutores);
  const [fontes, setFontes] = useState(initialFontes);
  const [conteudos, setConteudos] = useState(initialConteudos);
  const [homeHighlights, setHomeHighlights] = useState(initialHomeHighlights);
  const [historyEntries, setHistoryEntries] = useState<EditorialHistoryEntry[]>(
    initialConteudos.flatMap((content) => buildInitialHistoryEntries(content)),
  );
  const [noteEntries, setNoteEntries] = useState<EditorialNoteEntry[]>(buildInitialNotes);
  const nextIdRef = useRef(200);

  const issueId = () => {
    const current = nextIdRef.current;
    nextIdRef.current += 1;
    return current;
  };

  const appendHistoryEntry = (
    contentId: number,
    status: ContentStatus,
    actionKey: EditorialWorkflowActionKey | "created",
    note?: string,
  ) => {
    setHistoryEntries((prev) => [...prev, makeHistoryEntry(issueId(), contentId, status, actionKey, note)]);
  };

  const value = useMemo<EditorialStoreValue>(() => ({
    editorias,
    autores,
    fontes,
    conteudos,
    homeHighlights,
    createEditoria: (input) => {
      const id = issueId();
      setEditorias((prev) => [...prev, { id, ...input }]);
      return id;
    },
    updateEditoria: (id, input) => {
      setEditorias((prev) => prev.map((item) => (item.id === id ? { id, ...input } : item)));
    },
    removeEditoria: (id) => {
      if (conteudos.some((item) => item.editoriaId === id)) return false;
      setEditorias((prev) => prev.filter((item) => item.id !== id));
      return true;
    },
    createAutor: (input) => {
      const id = issueId();
      setAutores((prev) => [...prev, { id, initials: getInitials(input.name), ...input }]);
      return id;
    },
    updateAutor: (id, input) => {
      setAutores((prev) => prev.map((item) => (item.id === id ? { id, initials: getInitials(input.name), ...input } : item)));
    },
    removeAutor: (id) => {
      if (conteudos.some((item) => item.authorId === id)) return false;
      setAutores((prev) => prev.filter((item) => item.id !== id));
      return true;
    },
    createFonte: (input) => {
      const id = issueId();
      setFontes((prev) => [...prev, { id, ...input }]);
      return id;
    },
    updateFonte: (id, input) => {
      setFontes((prev) => prev.map((item) => (item.id === id ? { id, ...input } : item)));
    },
    removeFonte: (id) => {
      if (conteudos.some((item) => item.fonteId === id)) return false;
      setFontes((prev) => prev.filter((item) => item.id !== id));
      return true;
    },
    createConteudo: (input, meta) => {
      const id = issueId();
      const initialStatus = meta?.workflowAction ? getWorkflowTargetStatus(meta.workflowAction) : input.status;
      const createdContent: ContentEntity = {
        id,
        dateLabel:
          initialStatus === "scheduled"
            ? formatScheduledLabel()
            : initialStatus === "published"
              ? formatTodayLabel()
              : input.dateLabel || formatTodayLabel(),
        views: input.views || 0,
        ...input,
        status: initialStatus,
      };

      setConteudos((prev) => [...prev, createdContent]);
      appendHistoryEntry(id, "draft", "created");

      if (meta?.workflowAction && meta.workflowAction !== "save_draft") {
        appendHistoryEntry(id, initialStatus, meta.workflowAction, meta.note || workflowNotes[meta.workflowAction]);
      }

      return id;
    },
    updateConteudo: (id, input, meta) => {
      const current = conteudos.find((item) => item.id === id);
      if (!current) return;

      const nextStatus = input.status || current.status;
      const nextDateLabel =
        nextStatus === "published"
          ? formatTodayLabel()
          : nextStatus === "scheduled" && current.status !== "scheduled"
            ? formatScheduledLabel()
            : input.dateLabel || current.dateLabel;

      setConteudos((prev) => prev.map((item) => (
        item.id === id
          ? {
              ...item,
              ...input,
              status: nextStatus,
              dateLabel: nextDateLabel,
            }
          : item
      )));

      if (nextStatus !== current.status) {
        const actionKey = meta?.workflowAction
          || (Object.keys(workflowActionToStatus) as EditorialWorkflowActionKey[]).find((candidate) => workflowActionToStatus[candidate] === nextStatus)
          || "save_draft";

        appendHistoryEntry(id, nextStatus, actionKey, meta?.note || workflowNotes[actionKey]);
      }
    },
    removeConteudo: (id) => {
      setConteudos((prev) => prev.filter((item) => item.id !== id));
      setHistoryEntries((prev) => prev.filter((item) => item.contentId !== id));
      setNoteEntries((prev) => prev.filter((item) => item.contentId !== id));
      setHomeHighlights((prev) =>
        prev
          .filter((item) => item.contentId !== id)
          .map((item, index) => ({ ...item, position: index + 1 })),
      );
    },
    addEditorialNote: (contentId, text) => {
      const cleanText = text.trim();
      if (!cleanText) return;
      setNoteEntries((prev) => [
        {
          id: issueId(),
          contentId,
          author: "Mesa de revisão",
          dateTimeLabel: formatDateTimeLabel(),
          text: cleanText,
        },
        ...prev,
      ]);
    },
    getHistoryForConteudo: (contentId) =>
      historyEntries
        .filter((item) => item.contentId === contentId)
        .sort((a, b) => b.id - a.id),
    getNotesForConteudo: (contentId) =>
      noteEntries
        .filter((item) => item.contentId === contentId)
        .sort((a, b) => b.id - a.id),
    upsertHomeHighlight: (input, id) => {
      if (id) {
        setHomeHighlights((prev) => prev.map((item) => (item.id === id ? { ...item, ...input } : item)));
        return id;
      }
      const next = issueId();
      setHomeHighlights((prev) => [...prev, { id: next, ...input }]);
      return next;
    },
    removeHomeHighlight: (id) => {
      setHomeHighlights((prev) =>
        prev
          .filter((item) => item.id !== id)
          .sort((a, b) => a.position - b.position)
          .map((item, index) => ({ ...item, position: index + 1 })),
      );
    },
    getEditoriaById: (id) => editorias.find((item) => item.id === id),
    getAutorById: (id) => autores.find((item) => item.id === id),
    getFonteById: (id) => fontes.find((item) => item.id === id),
    getConteudoById: (id) => conteudos.find((item) => item.id === id),
  }), [editorias, autores, fontes, conteudos, homeHighlights, historyEntries, noteEntries]);

  return (
    <EditorialStoreContext.Provider value={value}>
      {children}
    </EditorialStoreContext.Provider>
  );
}

export function useEditorialStore() {
  const value = useContext(EditorialStoreContext);
  if (!value) {
    throw new Error("useEditorialStore must be used within EditorialStoreProvider");
  }
  return value;
}

export function buildEditoriaOptions(editorias: EditorialSectionEntity[]) {
  return editorias
    .filter((item) => item.status === "active")
    .map((item) => ({ value: String(item.id), label: item.name }));
}

export function buildAutorOptions(autores: AuthorEntity[]) {
  return autores
    .filter((item) => item.status === "active")
    .map((item) => ({ value: String(item.id), label: item.name }));
}

export function buildFonteOptions(fontes: SourceEntity[]) {
  return [
    { value: "", label: "Nenhuma" },
    ...fontes
      .filter((item) => item.status === "active")
      .map((item) => ({ value: String(item.id), label: `${item.sigla} — ${item.name}` })),
  ];
}

export function isConteudoCanonicallySupported(
  conteudo: ContentEntity,
  editorias: EditorialSectionEntity[],
  autores: AuthorEntity[],
  fontes: SourceEntity[],
) {
  const editoria = editorias.find((item) => item.id === conteudo.editoriaId);
  const autor = autores.find((item) => item.id === conteudo.authorId);
  const fonte = conteudo.fonteId ? fontes.find((item) => item.id === conteudo.fonteId) : null;

  if (!editoria || editoria.status !== "active") return false;
  if (!autor || autor.status !== "active") return false;
  if (isContentSourceType(conteudo.typeKey) && conteudo.fonteId && (!fonte || fonte.status !== "active")) return false;

  return true;
}

export function canConteudoAppearInHomeHighlights(
  conteudo: ContentEntity,
  editorias: EditorialSectionEntity[],
  autores: AuthorEntity[],
  fontes: SourceEntity[],
) {
  return homeHighlightEligibleStatuses.includes(conteudo.status)
    && isConteudoCanonicallySupported(conteudo, editorias, autores, fontes);
}

export function buildHomeHighlightContentOptions(
  conteudos: ContentEntity[],
  editorias: EditorialSectionEntity[],
  autores: AuthorEntity[],
  fontes: SourceEntity[],
) {
  return conteudos
    .filter((item) => canConteudoAppearInHomeHighlights(item, editorias, autores, fontes))
    .sort((a, b) => b.id - a.id)
    .map((item) => {
      const editoria = editorias.find((entry) => entry.id === item.editoriaId)?.name || "Sem editoria";
      return {
        value: String(item.id),
        label: `${getContentTypeLabel(item.typeKey)} — ${item.title} · ${editoria}`,
      };
    });
}

export function buildContentOptions(conteudos: ContentEntity[]) {
  return conteudos.map((item) => ({
    value: String(item.id),
    label: `${getContentTypeLabel(item.typeKey)} — ${item.title}`,
  }));
}

export function normalizeSlug(value: string) {
  return slugify(value);
}
