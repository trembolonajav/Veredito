import React from "react";
import { Link } from "react-router-dom";
import logoPrincipal from "@/assets/logo_principal.png";

const footerSections = [
  {
    title: "Editorias",
    links: [
      { label: "Tributário", to: "/editoria/tributario" },
      { label: "Empresarial", to: "/editoria/empresarial" },
      { label: "Trabalhista", to: "/editoria/trabalhista" },
      { label: "Constitucional", to: "/editoria/constitucional" },
    ],
  },
  {
    title: "Conteúdo",
    links: [
      { label: "Notícias", to: "/noticias" },
      { label: "Decisões", to: "/decisoes" },
      { label: "Artigos", to: "/artigos" },
      { label: "Opinião", to: "/opiniao" },
    ],
  },
  {
    title: "Institucional",
    links: [
      { label: "Sobre o Veredito", to: "/sobre" },
      { label: "Contato", to: "/contato" },
      { label: "Privacidade", to: "/privacidade" },
      { label: "Termos de uso", to: "/termos" },
    ],
  },
];

export function PublicFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <img src={logoPrincipal} alt="Veredito" className="h-10 w-auto brightness-0 invert opacity-80 mb-4" />
            <p className="text-[13px] text-primary-foreground/60 leading-relaxed">
              Jornalismo jurídico com profundidade, rigor editorial e compromisso com a informação de qualidade.
            </p>

            {/* Newsletter mini */}
            <div className="mt-6">
              <p className="text-[12px] font-semibold text-primary-foreground/80 mb-2 font-ui">Newsletter semanal</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  className="h-9 flex-1 rounded-md bg-primary-foreground/10 border border-primary-foreground/20 px-3 text-[13px] text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary-foreground/30"
                />
                <button className="h-9 rounded-md bg-bronze px-3 text-[12px] font-medium text-bronze-foreground hover:bg-bronze/90 transition-colors font-ui">
                  Assinar
                </button>
              </div>
            </div>
          </div>

          {/* Link sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-[12px] font-semibold uppercase tracking-wider text-primary-foreground/50 mb-3 font-ui">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-[13px] text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-primary-foreground/40">
            © {new Date().getFullYear()} Veredito. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacidade" className="text-[11px] text-primary-foreground/40 hover:text-primary-foreground/70 transition-colors">
              Privacidade
            </Link>
            <Link to="/termos" className="text-[11px] text-primary-foreground/40 hover:text-primary-foreground/70 transition-colors">
              Termos
            </Link>
            <Link to="/login" className="text-[11px] text-primary-foreground/40 hover:text-primary-foreground/70 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
