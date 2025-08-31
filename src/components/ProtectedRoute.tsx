import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const loginTime = localStorage.getItem("adminLoginTime");
    
    if (!adminToken || !loginTime) {
      navigate("/login");
      toast({
        title: "Acesso negado",
        description: "Você precisa fazer login para acessar esta área.",
        variant: "destructive",
      });
      return;
    }

    // Verificar se o login não expirou (24 horas)
    const loginTimestamp = parseInt(loginTime);
    const now = Date.now();
    const hoursSinceLogin = (now - loginTimestamp) / (1000 * 60 * 60);
    
    if (hoursSinceLogin > 24) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminLoginTime");
      navigate("/login");
      toast({
        title: "Sessão expirada",
        description: "Por favor, faça login novamente.",
        variant: "destructive",
      });
      return;
    }
  }, [navigate, toast]);

  return <>{children}</>;
};

export default ProtectedRoute;
