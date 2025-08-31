import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "@/components/Navigation";
import UpdateNotification from "@/components/UpdateNotification";
import useAppUpdate from "@/hooks/useAppUpdate";
import Home from "./pages/Home";
import Denuncia from "./pages/Denuncia";
import Educativo from "./pages/Educativo";
import Contatos from "./pages/Contatos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { showUpdatePrompt, handleUpdate, dismissUpdate } = useAppUpdate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/denuncia" element={<Denuncia />} />
        <Route path="/educativo" element={<Educativo />} />
        <Route path="/contatos" element={<Contatos />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Notificação de atualização */}
      <UpdateNotification
        isVisible={showUpdatePrompt}
        onUpdate={handleUpdate}
        onDismiss={dismissUpdate}
      />
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
