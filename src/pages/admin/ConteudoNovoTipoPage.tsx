import React from "react";
import { useNavigate } from "react-router-dom";
import { Newspaper, Scale, BookOpen, MessageSquare, ArrowLeft } from "lucide-react";

const tipos = [
  {
    value: "noticia",
    label: "Notícia",
    icon: Newspaper,
    description: "Fatos e acontecimentos jurídicos relevantes",
    examples: "Novas leis, regulamentações, movimentações processuais",
  },
  {
    value: "decisao",
    label: "Decisão",
    icon: Scale,
    description: "Análise de decisões de tribunais superiores",
    examples: "Acórdãos, súmulas, liminares, teses fixadas",
  },
  {
    value: "artigo",
    label: "Artigo",
    icon: BookOpen,
    description: "Análise aprofundada sobre temas jurídicos",
    examples: "Análises doutrinárias, estudos de caso, tendências",
  },
  {
    value: "opiniao",
    label: "Opinião",
    icon: MessageSquare,
    description: "Posicionamento editorial sobre temas atuais",
    examples: "Colunas, editoriais, pontos de vista",
  },
];

export default function ConteudoNovoTipoPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/conteudos")}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <div>
          <h2 className="font-display text-2xl text-foreground">Novo conteúdo</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Escolha o tipo de conteúdo que deseja criar
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 max-w-3xl">
        {tipos.map((tipo) => (
          <button
            key={tipo.value}
            onClick={() => navigate(`/admin/conteudos/novo?tipo=${tipo.value}`)}
            className="rounded-lg bg-card p-6 shadow-editorial hover:shadow-editorial-lg transition-all text-left group border border-transparent hover:border-bronze/20"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <tipo.icon className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <h3 className="mt-4 text-[15px] font-semibold text-foreground font-ui">
              {tipo.label}
            </h3>
            <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
              {tipo.description}
            </p>
            <p className="mt-2 text-[11px] text-bronze font-medium">
              {tipo.examples}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
