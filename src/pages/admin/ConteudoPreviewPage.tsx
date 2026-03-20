import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, ExternalLink } from "lucide-react";

export default function ConteudoPreviewPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock content for preview
  const content = {
    type: "Decisão",
    editoria: "Tributário",
    title: "STF suspende efeitos de lei estadual sobre ICMS",
    subtitle: "Decisão afeta diretamente a arrecadação de 12 estados e abre precedente para novas contestações",
    author: "Ana Beatriz Duarte",
    authorRole: "Editora Sênior",
    date: "20 de março de 2026",
    readTime: "8 min de leitura",
    tribunal: "STF",
    processo: "ADI 7.633/DF",
    relator: "Min. Roberto Barroso",
    impacto: "Alto",
    tese: "É inconstitucional lei estadual que concede benefício fiscal de ICMS sem prévia autorização do CONFAZ.",
    lead: "O Supremo Tribunal Federal decidiu, por maioria de votos, suspender os efeitos de lei estadual que concedia benefícios fiscais de ICMS sem aprovação do CONFAZ.",
    body: `A decisão, proferida na última sessão plenária, tem efeitos imediatos e impacta diretamente a política fiscal de ao menos 12 unidades federativas que mantinham legislação semelhante.

O relator, Ministro Roberto Barroso, destacou em seu voto que "a concessão unilateral de benefícios fiscais de ICMS, sem a devida autorização do CONFAZ, configura guerra fiscal entre os estados e viola o pacto federativo".

A tese fixada pelo tribunal estabelece um precedente importante para casos análogos em tramitação nas cortes estaduais e federais. Especialistas em direito tributário avaliam que a decisão pode levar a uma revisão generalizada de políticas de incentivo fiscal em todo o país.

O julgamento foi acompanhado por representantes de diversos estados, que já sinalizaram a possibilidade de modulação dos efeitos da decisão, especialmente no que diz respeito a empresas que já se beneficiavam dos incentivos fiscais declarados inconstitucionais.`,
    tags: ["STF", "ICMS", "Tributário", "Guerra fiscal", "CONFAZ"],
  };

  return (
    <div className="space-y-6">
      {/* Preview banner */}
      <div className="flex items-center justify-between rounded-lg bg-bronze/10 border border-bronze/20 px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-semibold text-bronze font-ui">Pré-visualização</span>
          <span className="text-[12px] text-muted-foreground">Prévia de como o conteúdo aparecerá no portal público</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/admin/conteudos/${id || "1"}/editar`)}
            className="flex h-8 items-center gap-1.5 rounded-md border border-input bg-card px-3 text-[12px] font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <Edit className="h-3.5 w-3.5" strokeWidth={1.5} /> Voltar ao editor
          </button>
          <button
            onClick={() => navigate("/admin/conteudos")}
            className="flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-[12px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> Voltar à lista
          </button>
        </div>
      </div>

      {/* Preview content */}
      <div className="mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-6">
          <span>Veredito</span>
          <span>/</span>
          <span className="text-bronze font-medium">{content.editoria}</span>
          <span>/</span>
          <span>{content.type}</span>
        </div>

        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-bronze">{content.editoria}</span>
          <span className="text-muted-foreground/30">·</span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{content.type}</span>
        </div>

        {/* Title */}
        <h1 className="font-display text-4xl leading-tight text-foreground mb-3">
          {content.title}
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          {content.subtitle}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 pb-6 border-b border-border mb-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
              {content.author.split(" ").map(w => w[0]).slice(0, 2).join("")}
            </div>
            <div>
              <p className="text-[13px] font-medium text-foreground">{content.author}</p>
              <p className="text-[11px] text-muted-foreground">{content.authorRole}</p>
            </div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-[12px] text-muted-foreground">
            <p>{content.date}</p>
            <p>{content.readTime}</p>
          </div>
        </div>

        {/* Decision box */}
        {content.tribunal && (
          <div className="rounded-lg bg-primary/5 border border-primary/10 p-6 mb-8 space-y-3">
            <h3 className="text-[13px] font-semibold text-foreground font-ui">Dados da decisão</h3>
            <div className="grid grid-cols-2 gap-4 text-[13px]">
              <div>
                <span className="text-muted-foreground">Tribunal: </span>
                <span className="font-medium text-foreground">{content.tribunal}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Processo: </span>
                <span className="font-medium text-foreground">{content.processo}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Relator: </span>
                <span className="font-medium text-foreground">{content.relator}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Impacto: </span>
                <span className="font-medium text-destructive">{content.impacto}</span>
              </div>
            </div>
            {content.tese && (
              <div className="mt-3 pt-3 border-t border-primary/10">
                <span className="text-[12px] font-semibold text-foreground block mb-1">Tese fixada</span>
                <p className="text-[13px] text-foreground italic leading-relaxed">"{content.tese}"</p>
              </div>
            )}
          </div>
        )}

        {/* Lead */}
        <p className="text-[15px] font-medium text-foreground leading-relaxed mb-6">
          {content.lead}
        </p>

        {/* Body */}
        <div className="prose prose-sm max-w-none text-foreground leading-relaxed space-y-4">
          {content.body.split("\n\n").map((p, i) => (
            <p key={i} className="text-[15px] leading-[1.8]">{p}</p>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border">
          {content.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-[11px] font-medium text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        {/* Author box */}
        <div className="mt-8 rounded-lg bg-card p-6 shadow-editorial flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shrink-0">
            {content.author.split(" ").map(w => w[0]).slice(0, 2).join("")}
          </div>
          <div>
            <p className="text-[15px] font-semibold text-foreground">{content.author}</p>
            <p className="text-[12px] text-bronze font-medium">{content.authorRole}</p>
            <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed">
              Jornalista especializada em direito tributário e constitucional. Cobre o Supremo Tribunal Federal desde 2018.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
