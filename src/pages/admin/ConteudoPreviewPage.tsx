import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";
import { getContentPageBySlug } from "@/domain/editorial/selectors";
import { useEditorialSnapshot } from "@/domain/editorial/store";

export default function ConteudoPreviewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const snapshot = useEditorialSnapshot();
  const current = id ? snapshot.contents.find((item) => item.id === id) : undefined;
  const page = current ? getContentPageBySlug(current.slug, snapshot) : null;
  if (!page) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg bg-bronze/10 border border-bronze/20 px-5 py-3">
        <div>
          <span className="text-[13px] font-semibold text-bronze font-ui">Pré-visualização</span>
          <span className="text-[12px] text-muted-foreground ml-3">Prévia real do conteúdo público.</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(`/admin/conteudos/${id}/editar`)} className="flex h-8 items-center gap-1.5 rounded-md border border-input bg-card px-3 text-[12px] font-medium text-foreground hover:bg-secondary transition-colors"><Edit className="h-3.5 w-3.5" strokeWidth={1.5} /> Voltar ao editor</button>
          <button onClick={() => navigate("/admin/conteudos")} className="flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-[12px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors"><ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> Voltar à lista</button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-bronze">{page.content.editoriaName}</span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{page.content.type}</span>
        </div>
        <h1 className="font-display text-4xl leading-tight text-foreground mb-3">{page.content.title}</h1>
        {page.content.subtitle && <p className="text-lg text-muted-foreground leading-relaxed mb-6">{page.content.subtitle}</p>}
        <div className="flex items-center gap-4 pb-6 border-b border-border mb-8">
          <div><p className="text-[13px] font-medium text-foreground">{page.content.authorName}</p><p className="text-[11px] text-muted-foreground">{page.author.role}</p></div>
          <div className="h-8 w-px bg-border" />
          <div className="text-[12px] text-muted-foreground"><p>{page.content.publishedLabel}</p><p>{page.content.readingTimeLabel}</p></div>
        </div>
        {page.content.imageUrl && <div className="overflow-hidden mb-8"><img src={page.content.imageUrl} alt={page.content.imageAlt || page.content.title} className="w-full h-[320px] object-cover" /></div>}
        <div className="prose prose-sm max-w-none text-foreground leading-relaxed space-y-4">
          {page.content.body.split("\n\n").map((paragraph, index) => <p key={index} className="text-[15px] leading-[1.8]">{paragraph}</p>)}
        </div>
      </div>
    </div>
  );
}
