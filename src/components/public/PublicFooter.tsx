import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import logoPrincipal from "@/assets/logo_principal.png";
import { usePublicEditorialData } from "@/pages/public/public-content";
import { EditorialNewsletterPanel, PublicDivider, PublicPageContainer } from "./PublicEditorial";

const primaryLinks = [
  { label: "Noticias", to: "/noticias" },
  { label: "Decisoes", to: "/decisoes" },
  { label: "Artigos", to: "/artigos" },
  { label: "Opiniao", to: "/opiniao" },
];

const institutionalLinks = [
  { label: "Sobre o Veredito", to: "/sobre" },
  { label: "Contato", to: "/contato" },
  { label: "Privacidade", to: "/privacidade" },
  { label: "Termos de uso", to: "/termos" },
];

export function PublicFooter() {
  const { editorias } = usePublicEditorialData();

  const editorialLinks = useMemo(
    () => editorias.slice(0, 4).map((item) => ({ label: item.name, to: `/editoria/${item.slug}` })),
    [editorias],
  );

  return (
    <footer className="border-t border-border/80 bg-primary text-primary-foreground">
      <PublicPageContainer className="py-14 lg:py-16">
        <div className="grid gap-10 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))]">
            <div className="lg:pr-4">
              <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.24em] text-primary-foreground/45">
                Jornal juridico
              </span>
              <img src={logoPrincipal} alt="Veredito" className="mb-5 h-11 w-auto brightness-0 invert opacity-85" />
              <p className="max-w-xs text-[13px] leading-[1.85] text-primary-foreground/68">
                Jornalismo juridico com profundidade, rigor editorial e compromisso com leitura clara para quem acompanha o direito.
              </p>
              <div className="mt-6 space-y-2 text-[12px] text-primary-foreground/55">
                <p>Analise editorial objetiva</p>
                <p>Decisoes, noticias, artigos e opiniao</p>
                <p>Curadoria publica sobria e premium</p>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-foreground/50 font-ui">
                Navegacao
              </h3>
              <ul className="space-y-2.5">
                {primaryLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="rounded-sm text-[13px] leading-relaxed text-primary-foreground/72 transition-colors hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-foreground/50 font-ui">
                Editorias
              </h3>
              <ul className="space-y-2.5">
                {editorialLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="rounded-sm text-[13px] leading-relaxed text-primary-foreground/72 transition-colors hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-foreground/50 font-ui">
                Institucional
              </h3>
              <ul className="space-y-2.5">
                {institutionalLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="rounded-sm text-[13px] leading-relaxed text-primary-foreground/72 transition-colors hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <EditorialNewsletterPanel variant="footer" className="self-start" />
        </div>

        <div className="my-8">
          <PublicDivider className="bg-primary-foreground/12" />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-primary-foreground/42">
            Copyright {new Date().getFullYear()} Veredito. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/privacidade" className="rounded-sm text-[11px] text-primary-foreground/42 transition-colors hover:text-primary-foreground/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              Privacidade
            </Link>
            <Link to="/termos" className="rounded-sm text-[11px] text-primary-foreground/42 transition-colors hover:text-primary-foreground/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              Termos
            </Link>
            <Link to="/login" className="rounded-sm text-[11px] text-primary-foreground/42 transition-colors hover:text-primary-foreground/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              Admin
            </Link>
          </div>
        </div>
      </PublicPageContainer>
    </footer>
  );
}
