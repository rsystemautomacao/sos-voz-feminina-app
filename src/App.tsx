import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UpdateNotification from "@/components/UpdateNotification";
import InstallPWA from "@/components/InstallPWA";
import { LGPDModal } from "@/components/LGPDModal";
import ProtectedRoute from "@/components/ProtectedRoute";
import SuperAdminRoute from "@/components/SuperAdminRoute";
import useAppUpdate from "@/hooks/useAppUpdate";
import { useLGPD } from "@/hooks/useLGPD";
import Home from "./pages/Home";
import Denuncia from "./pages/Denuncia";
import Educativo from "./pages/Educativo";
import Contatos from "./pages/Contatos";
import Sobre from "./pages/Sobre";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdminConfiguracoes from "./pages/AdminConfiguracoes";
import AdminEstatisticas from "./pages/AdminEstatisticas";
import AdminRegister from "./pages/AdminRegister";
import AdminResetPassword from "./pages/AdminResetPassword";
import Privacidade from "./pages/Privacidade";
import Termos from "./pages/Termos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { showUpdatePrompt, handleUpdate, dismissUpdate } = useAppUpdate();
  const { showLGPD, acceptLGPD } = useLGPD();

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/denuncia" element={<Denuncia />} />
        <Route path="/educativo" element={<Educativo />} />
        <Route path="/contatos" element={<Contatos />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/reset-password" element={<AdminResetPassword />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/configuracoes" 
          element={
            <ProtectedRoute>
              <SuperAdminRoute>
                <AdminConfiguracoes />
              </SuperAdminRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/estatisticas" 
          element={
            <ProtectedRoute>
              <AdminEstatisticas />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Modal LGPD */}
      <LGPDModal 
        isOpen={showLGPD} 
        onAccept={acceptLGPD} 
      />
      
      {/* Notificação de atualização */}
      <UpdateNotification
        isVisible={showUpdatePrompt}
        onUpdate={handleUpdate}
        onDismiss={dismissUpdate}
      />

      {/* Botão de instalação PWA */}
      <InstallPWA />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
