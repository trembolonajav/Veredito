import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoginPage from "./pages/admin/LoginPage";
import { AdminLayout } from "./components/admin/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import ConteudoNovoTipoPage from "./pages/admin/ConteudoNovoTipoPage";
import ConteudoFormPage from "./pages/admin/ConteudoFormPage";
import ConteudoPreviewPage from "./pages/admin/ConteudoPreviewPage";
import {
  ConteudosPage,
  EditoriasPage,
  AutoresPage,
  FontesPage,
  HomeDestaquesPage,
} from "./pages/admin/EditorialSupportPages";
import { NewsletterPage, UsuariosPage, ConfiguracoesPage } from "./pages/admin/PlaceholderPages";
import { PublicLayout } from "./components/public/PublicLayout";
import HomePage from "./pages/public/HomePage";
import {
  NoticiasListPage,
  DecisoesListPage,
  ArtigosListPage,
  OpinioesListPage,
  ConteudoPublicoPage,
  EditoriaPublicaPage,
  AutorPublicoPage,
  BuscaPage,
  SobrePage,
  ContatoPage,
  NewsletterPublicaPage,
  PrivacidadePage,
  TermosPage,
} from "./pages/public/PublicPages";
import { EditorialStoreProvider } from "./pages/admin/editorial-store";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <EditorialStoreProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/noticias" element={<NoticiasListPage />} />
              <Route path="/decisoes" element={<DecisoesListPage />} />
              <Route path="/artigos" element={<ArtigosListPage />} />
              <Route path="/opiniao" element={<OpinioesListPage />} />
              <Route path="/editoria/:slug" element={<EditoriaPublicaPage />} />
              <Route path="/autor/:slug" element={<AutorPublicoPage />} />
              <Route path="/:tipo/:slug" element={<ConteudoPublicoPage />} />
              <Route path="/busca" element={<BuscaPage />} />
              <Route path="/sobre" element={<SobrePage />} />
              <Route path="/contato" element={<ContatoPage />} />
              <Route path="/newsletter" element={<NewsletterPublicaPage />} />
              <Route path="/privacidade" element={<PrivacidadePage />} />
              <Route path="/termos" element={<TermosPage />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="conteudos" element={<ConteudosPage />} />
              <Route path="conteudos/tipo" element={<ConteudoNovoTipoPage />} />
              <Route path="conteudos/novo" element={<ConteudoFormPage />} />
              <Route path="conteudos/:id/editar" element={<ConteudoFormPage />} />
              <Route path="conteudos/:id/preview" element={<ConteudoPreviewPage />} />
              <Route path="editorias" element={<EditoriasPage />} />
              <Route path="autores" element={<AutoresPage />} />
              <Route path="fontes" element={<FontesPage />} />
              <Route path="home-destaques" element={<HomeDestaquesPage />} />
              <Route path="newsletter" element={<NewsletterPage />} />
              <Route path="usuarios" element={<UsuariosPage />} />
              <Route path="configuracoes" element={<ConfiguracoesPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </EditorialStoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
