import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/services/adminService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("adminToken");
        const loginTime = localStorage.getItem("adminLoginTime");

        if (!token || !loginTime) {
          toast({
            title: "Acesso negado",
            description: "Você precisa fazer login para acessar esta página.",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }

        // Verificar se o token é válido
        const tokenData = JSON.parse(atob(token));
        const loginDate = new Date(loginTime);
        const currentDate = new Date();
        const hoursDiff = (currentDate.getTime() - loginDate.getTime()) / (1000 * 60 * 60);

        // Sessão expira após 24 horas
        if (hoursDiff > 24) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminLoginTime");
          
          toast({
            title: "Sessão expirada",
            description: "Sua sessão expirou. Faça login novamente.",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }

        // Verificar se o usuário ainda existe no sistema
        const user = adminService.getUserByEmail(tokenData.email);
        if (!user) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminLoginTime");
          
          toast({
            title: "Usuário não encontrado",
            description: "Seu usuário foi removido do sistema.",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }

        // Atualizar último login
        adminService.updateLastLogin(tokenData.email);

      } catch (error) {
        console.error('Erro na verificação de autenticação:', error);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminLoginTime");
        
        toast({
          title: "Erro de autenticação",
          description: "Ocorreu um erro na verificação. Faça login novamente.",
          variant: "destructive",
        });
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, toast]);

  return <>{children}</>;
};

export default ProtectedRoute;
