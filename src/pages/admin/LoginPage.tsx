import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import bannerLogin from "@/assets/banner_lateral_login.png";
import logoPrincipal from "@/assets/logo_principal.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/admin");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left — banner editorial */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          backgroundImage: `url(${bannerLogin})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-primary/30" />

        <div className="relative z-10">
          <img src={logoPrincipal} alt="Veredito" className="h-20 w-auto brightness-0 invert opacity-90" />
        </div>

        <div className="relative z-10">
          <blockquote className="font-display text-2xl italic text-primary-foreground/90 leading-relaxed">
            "Informação jurídica com profundidade"
          </blockquote>
          <p className="mt-4 text-[13px] text-primary-foreground/50">
            Painel administrativo do portal Veredito.
            <br />
            Acesso restrito à equipe editorial.
          </p>
        </div>

        <p className="relative z-10 text-[11px] text-primary-foreground/30">
          © {new Date().getFullYear()} Veredito. Todos os direitos reservados.
        </p>
      </div>

      {/* Right — login form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="mb-10 lg:hidden flex flex-col items-center">
            <img src={logoPrincipal} alt="Veredito" className="h-16 w-auto mb-2" />
          </div>

          <div className="mb-8">
            <h2 className="text-[15px] font-semibold text-foreground font-ui">Entrar no painel</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Acesse com suas credenciais da redação.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-foreground">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="editor@veredito.com"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-foreground">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 pr-10 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                  ) : (
                    <Eye className="h-4 w-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="h-10 w-full rounded-md bg-primary text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors duration-150"
            >
              Entrar
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] text-muted-foreground">
            Acesso demonstrativo — sem autenticação real
          </p>
        </div>
      </div>
    </div>
  );
}
