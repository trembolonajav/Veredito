import React from "react";
import { Link } from "react-router-dom";
import logoPrincipal from "@/assets/logo_principal.png";

const footerSections = [
  {
    title: "Formatos",
    links: [
      { label: "Notícias", to: "/noticias" },
      { label: "Decisões", to: "/decisoes" },
      { label: "Artigos", to: "/artigos" },
      { label: "Opinião", to: "/opiniao" },
    ],
  },
  {
    title: "Editorias",
    links: [
      { label: "Tributário", to: "/editoria/tributario" },
      { label: "Empresarial", to: "/editoria/empresarial" },
      { label: "Imobiliário", to: "/editoria/imobiliario" },
      { label: "Sucessório", to: "/editoria/sucessorio" },
    ],
  },
  {
    title: "Institucional",
    links: [
      { label: "Sobre o Veredito", to: "/sobre" },
      { label: "Newsletter", to: "/newsletter" },
      { label: "Contato", to: "/contato" },
      { label: "Privacidade", to: "/privacidade" },
      { label: "Termos de uso", to: "/termos" },
    ],
  },
];

export function PublicFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* ── Newsletter strip ── */}
      <div className="border-b border-primary-foreground/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
          <div className="max-w-2xl mx-auto text-center">
            <p className="section-label !text-bronze-foreground mb-3">Curadoria semanal</p>
            <h3 className="font-display text-2xl lg:text-3xl text-primary-foreground mb-2">
              Newsletter Veredito
            </h3>
            <p className="text-[13px] text-primary-foreground/50 mb-6 max-w-md mx-auto font-ui">
              As decisões mais relevantes da semana, análises exclusivas e o que você precisa saber sobre o cenário jurídico brasileiro.
            </p>
            <div className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="h-10 flex-1 bg-transparent border border-primary-foreground/15 px-3 text-[13px] text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:border-bronze/50 transition-colors font-ui"
              />
              <button className="h-10 bg-bronze px-5 text-[11px] font-bold text-bronze-foreground hover:bg-bronze/90 transition-colors font-ui uppercase tracking-[0.1em]">
                Assinar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main footer ── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <img src={logoPrincipal} alt="Veredito" className="h-8 w-auto brightness-0 invert opacity-60 mb-4" />
            <p className="text-[12px] text-primary-foreground/35 leading-relaxed max-w-xs font-ui">
              Jornalismo jurídico com profundidade, rigor editorial e compromisso com a informação de qualidade.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary-foreground/30 mb-4 font-ui">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-[12px] text-primary-foreground/45 hover:text-primary-foreground transition-colors font-ui"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-primary-foreground/8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-primary-foreground/25 font-ui">
            © {new Date().getFullYear()} Veredito. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacidade" className="text-[10px] text-primary-foreground/25 hover:text-primary-foreground/50 transition-colors font-ui">Privacidade</Link>
            <Link to="/termos" className="text-[10px] text-primary-foreground/25 hover:text-primary-foreground/50 transition-colors font-ui">Termos</Link>
            <Link to="/login" className="text-[10px] text-primary-foreground/25 hover:text-primary-foreground/50 transition-colors font-ui">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
